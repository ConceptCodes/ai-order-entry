import { HumanMessage } from "@langchain/core/messages";

import { listenAndTranscribe } from "../helpers/utils";
import type { AgentStateAnnotation } from "../agent/state";

export const audioInputNode = async (_: typeof AgentStateAnnotation.State) => {
  let transcript = await listenAndTranscribe();

  return {
    messages: [new HumanMessage(transcript)],
  };
};
