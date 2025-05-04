import { HumanMessage } from "@langchain/core/messages";

import { listenAndTranscribe } from "../helpers/utils";
import type {
  AgentStateAnnotation,
  ConfigurationAnnotation,
} from "../agent/state";
import type { RunnableConfig } from "@langchain/core/runnables";

export const audioInputNode = async (
  _: typeof AgentStateAnnotation.State,
  config: RunnableConfig<typeof ConfigurationAnnotation.State>
) => {
  const language = config.configurable?.language || "en";
  const transcript = await listenAndTranscribe(language);

  return {
    messages: [new HumanMessage(transcript)],
  };
};
