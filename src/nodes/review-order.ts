import { z } from "zod";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { RunnableConfig } from "@langchain/core/runnables";

import type {
  AgentStateAnnotation,
  ConfigurationAnnotation,
} from "../agent/state";
import { llm } from "../helpers/llm";
import { reviewOrderPrompt } from "../agent/prompts";
import { Command } from "@langchain/langgraph";
import { Nodes } from "../helpers/constants";

const outputSchema = z.object({
  review: z.string(),
});

export const reviewOrderNode = async (
  state: typeof AgentStateAnnotation.State,
  config: RunnableConfig<typeof ConfigurationAnnotation.State>
) => {
  const { draft } = state;
  const upSellEnabled = config.configurable?.upSellEnabled ?? false;
  const currency = config.configurable?.currency ?? "USD";

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = reviewOrderPrompt(draft, currency);
  const { review } = await structuredLLM.invoke([new HumanMessage(prompt)]);

  if (upSellEnabled) {
    return new Command({
      goto: Nodes.UPSELL,
      update: {
        messages: [new HumanMessage(review)],
      },
    });
  }
  
  return new Command({
    goto: Nodes.AUDIO_OUTPUT,
    update: {
      messages: [new AIMessage(review)],
    },
  });
};
