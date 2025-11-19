
export type TargetAPI = "Simulated-LLM-A" | "Simulated-LLM-B" | "Local Mock";
export type AttackVector = "Prompt Injection" | "Data Exfiltration (simulated)" | "Chain-of-Thought Stress" | "Safety Evasion (simulated)";
export type SimulationStatus = "Idle" | "Running" | "Paused" | "Completed" | "Error";
export type LogTag = "Hallucination" | "Instruction-Following" | "Privacy" | "Evasion" | "Data Leak" | "Vulnerability";

export interface LogEntry {
  id: string;
  timestamp: string;
  round: number;
  summary: string;
  effectiveness: "Low" | "Medium" | "High" | "Critical";
  suggestion: string;
  tags: LogTag[];
  sniperPrompt: string;
  targetResponse: string;
}

export interface SimulationSettings {
  targetAPI: TargetAPI;
  attackVector: AttackVector;
  totalRounds: number;
}