import { z } from "zod";
import type { RunnableConfig } from "@langchain/core/runnables";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph";

import type {
  AgentStateAnnotation,
  ConfigurationAnnotation,
} from "../agent/state";
import { generateSpeech, playAudio } from "../helpers/utils";
import { llm } from "../helpers/llm";
import { Nodes } from "../helpers/constants";

const outputSchema = z.object({
  text: z.string(),
});

export const audioOutputNode = async (
  state: typeof AgentStateAnnotation.State,
  config: RunnableConfig<typeof ConfigurationAnnotation.State>
) => {
  const { messages, completed } = state;
  const language = config.configurable?.language;
  const lastMessage = messages[messages.length - 1];

  let output = lastMessage?.content as string;
  const structuredLLM = llm.withStructuredOutput(outputSchema);

  if (language !== "en") {
    const response = await structuredLLM.invoke([
      new SystemMessage(
        "You are a translator. Only return the translated text."
      ),
      new AIMessage(`Translate to ${language}: ${output}`),
    ]);
    output = response.text;
  }

  const audioBuffer = await generateSpeech(output);
  await playAudio(audioBuffer);

  if (completed) {
    return new Command({
      goto: END,
    });
  }

  return new Command({
    goto: Nodes.AUDIO_INPUT,
  });
};
