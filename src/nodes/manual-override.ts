import type { AgentStateAnnotation } from "../agent/state";

export const manualOverrideNode = async (
  state: typeof AgentStateAnnotation.State
) => {
  // TODO: Implement the manual override logic

  return {
    manualOverride: true,
  };
};
