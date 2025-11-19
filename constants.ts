
import { TargetAPI, AttackVector } from './types';

export const TARGET_APIS: TargetAPI[] = ["Simulated-LLM-A", "Simulated-LLM-B", "Local Mock"];
export const ATTACK_VECTORS: AttackVector[] = ["Prompt Injection", "Data Exfiltration (simulated)", "Chain-of-Thought Stress", "Safety Evasion (simulated)"];
export const MAX_ROUNDS = 50;
