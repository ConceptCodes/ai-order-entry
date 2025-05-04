import path from "path";
import { HumanMessage } from "@langchain/core/messages";

import { graph } from "./agent/graph";
import { Nodes } from "./src/helpers/constants";

const run = async () => {
  // let isRunning = true;
  // while (isRunning) {
  //   const input = prompt("Input: ");
  //   if (!input || input.toLowerCase() === "exit") {
  //     console.log("Exiting...");
  //     isRunning = false;
  //     break;
  //   }
  //   try {
  //     const result = graph.stream(
  //       { messages: [new HumanMessage({ content: input })] },
  //       {
  //         ...config,
  //         streamMode: "values", // Or "updates"
  //       }
  //     );
  //     for await (const chunk of await result) {
  //       // Process streamed chunks - adjust based on your state/output
  //       console.log("--- Chunk ---");
  //       console.log(JSON.stringify(chunk, null, 2));
  //       // Example: Accessing a specific node's output
  //       // if (chunk.someNodeName) {
  //       //   prettifyOutput(JSON.stringify(chunk.someNodeName), "blue");
  //       // }
  //     }
  //     console.log("--- Stream End ---");
  //     // Or invoke directly for final result
  //     // const finalResult = await graph.invoke(
  //     //   { messages: [new HumanMessage({ content: input })] },
  //     //   config
  //     // );
  //     // console.log("--- Final Result ---");
  //     // console.log(JSON.stringify(finalResult, null, 2));
  //   } catch (error) {
  //     console.error("Error during graph execution:", error);
  //   }
  // }
};

run().catch((error) => {
  console.error("Error running the order-entry agent:", error);
  // Add any cleanup logic here (e.g., closeDb())
});
