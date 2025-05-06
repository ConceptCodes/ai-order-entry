import { Command } from "@langchain/langgraph";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import { checkInventoryPrompt } from "../agent/prompts";
import type { AgentStateAnnotation } from "../agent/state";
import { executeQuery, getTableDefinitions } from "../helpers/db";
import { querySchema } from "../helpers/types";
import { Nodes } from "../helpers/constants";

export const checkInventoryNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { messages, prev } = state;
  const lastMessage = messages.at(-1);

  const tableDefinition = getTableDefinitions();
  const systemMessage = checkInventoryPrompt(tableDefinition);
  const structuredLLM = llm.withStructuredOutput(querySchema);

  const { query, params } = await structuredLLM.invoke([
    new SystemMessage(systemMessage),
    new HumanMessage(`User Request: ${lastMessage?.text}`),
  ]);

  const result = await executeQuery(query, params);

  if (result.length === 0) {
    return new Command({
      goto: Nodes.AUDIO_OUTPUT,
      update: {
        messages: [
          new AIMessage(
            "Sorry, I couldn't find any items in the inventory that match your request."
          ),
        ],
      },
    });
  }

  return new Command({
    goto: prev,
    update: {
      prev: "",
      queryResults: result,
    },
  });
};
