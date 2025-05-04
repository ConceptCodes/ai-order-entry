# AI Fast Food Order Entry Voice Agent

This project implements a conversational AI voice agent designed specifically for taking food orders at a fast-food restaurant. It leverages LangGraph for managing the conversation flow and interacts with a database for menu information and order persistence.

## Architecture

The agent's logic is built using LangGraph's `StateGraph`, defined primarily in [`src/agent/graph.ts`](agent/graph.ts).

*   **State Management:** The conversation's state is tracked using [`AgentStateAnnotation`](agent/state.ts), which includes messages, the current draft order, database query results, and internal flow control flags. Configuration details like `businessName` or `language` are passed via [`ConfigurationAnnotation`](agent/state.ts).
*   **Core Nodes:** The graph operates through distinct nodes, each representing a stage in the order process (constants defined in [`src/helpers/constants.ts`](helpers/constants.ts)):
    *   `WELCOME_MESSAGE`: Greets the user and initiates the order.
    *   `AUDIO_INPUT`: Captures the user's spoken input.
    *   `PARSE_INTENT`: Analyzes the user's input to determine their goal (e.g., add item, modify order, confirm).
    *   `CHECK_INVENTORY`: Queries the database for menu items, prices, and available modifiers based on the user's request.
    *   `ITEM_SELECTION`: Adds validated items to the draft order.
    *   `MODIFY_ORDER`: Updates the draft order (e.g., adds modifiers, changes quantity, removes items).
    *   `REVIEW_ORDER`: Summarizes the current draft order for the user to review.
    *   `CONFIRM_ORDER`: Finalizes the order details and provides a concluding message.
    *   `AUDIO_OUTPUT`: Sends the agent's spoken response back to the user.
*   **Conversation Flow:**
    1.  The interaction begins with the `WELCOME_MESSAGE`.
    2.  The agent cycles through `AUDIO_INPUT` to capture user speech and `PARSE_INTENT` to understand it.
    3.  Based on the intent, the flow branches to nodes like `ITEM_SELECTION`, `MODIFY_ORDER`, or `CONFIRM_ORDER`.
    4.  Nodes involving menu items (`ITEM_SELECTION`, `MODIFY_ORDER`) typically use `CHECK_INVENTORY` first.
    5.  After updates, the flow often proceeds to `REVIEW_ORDER`.
    6.  Nodes requiring a response (`REVIEW_ORDER`, `CONFIRM_ORDER`, error handling) lead to `AUDIO_OUTPUT`.
    7.  This cycle repeats until the order is finalized via `CONFIRM_ORDER` or the conversation ends.
*   **Persistence:** Conversation state checkpoints are managed using `MemorySaver` for short-term memory. (Note: This can be swapped with a persistent solution like a Postgres checkpointer if needed).
*   **Database:** A SQLite database, managed via TypeORM ([`src/helpers/db.ts`](helpers/db.ts)), stores information about categories, products (menu items), modifiers, and finalized orders.

![Agent Architecture Diagram](/assets/graph.png)

## Functionality Overview

1.  **Initialization:** Connects to the SQLite database ([`initializeDatabase`](helpers/db.ts)).
2.  **Greeting:** Starts the conversation with a welcome message ([`welcomeMessageNode`](nodes/welcome-message.ts)).
3.  **Order Taking Loop:**
    *   Listens for and processes user voice input ([`audioInputNode`](nodes/audio-input.ts)).
    *   Determines the user's intent ([`parseIntentNode`](nodes/parse-intent.ts)).
    *   **Handles Item Addition:** Checks item availability ([`checkInventoryNode`](nodes/check-inventory.ts)) and adds it to the order ([`itemSelectionNode`](nodes/item-selection.ts)).
    *   **Handles Order Modification:** Checks modifier availability if necessary ([`checkInventoryNode`](nodes/check-inventory.ts)) and updates the order ([`modifyOrderNode`](nodes/modify-order.ts)).
    *   **Reviews Order:** Presents the current order details to the user ([`reviewOrderNode`](nodes/review-order.ts)).
    *   **Confirms Order:** Finalizes the transaction upon user confirmation ([`confirmOrderNode`](nodes/confirm-order.ts)).
    *   Provides voice responses throughout the process ([`audioOutputNode`](nodes/audio-output.ts)).
4.  **Termination:** The conversation concludes upon successful order confirmation or user exit.
5.  **Language Support:** Defaults to English (`en`). The language can be configured via [`ConfigurationAnnotation`](agent/state.ts).

## Core Components

*   **Graph Definition:** [`src/agent/graph.ts`](agent/graph.ts) - Defines the conversational flow structure.
*   **State Management:** [`src/agent/state.ts`](agent/state.ts) - Defines the data tracked during the conversation.
*   **Node Logic:** [`src/nodes/`](nodes) - Contains the implementation for each step (node) in the graph.
*   **LLM Prompts:** [`src/agent/prompts.ts`](agent/prompts.ts) - Stores the prompts used to guide the language model.
*   **Helpers & Utilities:** [`src/helpers/`](helpers) - Includes database setup, constants, type definitions, and utility functions.
*   **Database Schema:** [`src/helpers/db.ts`](helpers/db.ts) - Defines database tables using TypeORM entities.
*   **Database Seeding:** [`src/helpers/seed.ts`](helpers/seed.ts) - Script to populate the database with initial menu data.

## Prerequisites

*   Node.js and Bun installed.
*   Environment Variables: Ensure necessary environment variables are set (e.g., API keys for the Language Model, Speech-to-Text, or Text-to-Speech services if used). Create a `.env` file if needed.
*   Database seeded with initial menu data.

## Setup

1.  **Install Dependencies:**
    ````bash
    bun install
    ````
2.  **Seed Database:** (Run this once to populate the menu)
    ````bash
    bun run scripts/seed.ts
    ````

## Usage

*(Add instructions here on how to start and interact with the voice agent. Example below assumes a start script)*

1.  **Run the Agent:**
    ````bash
    bun run start 
    ````
2.  Interact with the agent via voice input/output according to your setup.

*(Consider adding sections on Configuration, Testing, or Deployment if applicable)*

