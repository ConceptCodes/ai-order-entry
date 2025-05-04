import { z } from "zod";
import { Command } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";

import { llm } from "../helpers/llm";
import type { AgentStateAnnotation } from "../agent/state";
import { parseIntentOptions } from "../helpers/constants";
import { parseIntentPrompt } from "../agent/prompts";

const outputSchema = z.object({
  next: z.enum(parseIntentOptions),
});

export const parseIntentNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  const { messages } = state;
  const lastMessage = messages.at(-1);

  const prompt = parseIntentPrompt(
    lastMessage?.content as string,
    [...parseIntentOptions],
    messages.map((message) => message.text)
  );
  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const { next } = await structuredLLM.invoke([new HumanMessage(prompt)]);

  return new Command({
    goto: next,
  });
};
