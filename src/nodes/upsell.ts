import type { AgentStateAnnotation } from "../agent/state";

export const upSellNode = async (state: typeof AgentStateAnnotation.State) => {
  // TODO: (Option 1) query the database for patterns in previous orders to suggest an upsell
  // TODO: (Option 2) ask the llm to suggest an upsell
};
