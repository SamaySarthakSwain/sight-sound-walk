/**
 * Multi-Objective Reinforcement Learning for Traffic Signal Optimization
 * Q-learning with state = (queue_len, congestion, time_of_day, weather)
 * Actions = phase durations for each signal
 */

export type SignalState = {
  nodeId: string;
  queueLength: number;
  congestion: number;
  timeSlot: number; // 0-23
  weather: number; // 0=clear, 1=rain, 2=fog, 3=heavy
  emergencyActive: boolean;
};

export type SignalAction = {
  greenNS: number; // north-south green duration (seconds)
  greenEW: number; // east-west green duration (seconds)
  yellowDuration: number;
  pedestrianPhase: number;
};

type QKey = string;

const ACTIONS: SignalAction[] = [
  { greenNS: 30, greenEW: 30, yellowDuration: 3, pedestrianPhase: 15 },
  { greenNS: 45, greenEW: 25, yellowDuration: 3, pedestrianPhase: 15 },
  { greenNS: 25, greenEW: 45, yellowDuration: 3, pedestrianPhase: 15 },
  { greenNS: 60, greenEW: 20, yellowDuration: 5, pedestrianPhase: 10 },
  { greenNS: 20, greenEW: 60, yellowDuration: 5, pedestrianPhase: 10 },
  { greenNS: 40, greenEW: 40, yellowDuration: 3, pedestrianPhase: 20 },
  { greenNS: 50, greenEW: 30, yellowDuration: 5, pedestrianPhase: 15 },
  { greenNS: 30, greenEW: 50, yellowDuration: 5, pedestrianPhase: 15 },
];

// Q-table per intersection
const qTables = new Map<string, Map<QKey, number[]>>();
const ALPHA = 0.15; // learning rate
const GAMMA = 0.9; // discount
const EPSILON = 0.15; // exploration

function stateKey(s: SignalState): QKey {
  const qBin = s.queueLength > 20 ? 2 : s.queueLength > 10 ? 1 : 0;
  const cBin = s.congestion > 80 ? 2 : s.congestion > 50 ? 1 : 0;
  const tBin = s.timeSlot >= 7 && s.timeSlot <= 10 ? 0 : s.timeSlot >= 16 && s.timeSlot <= 20 ? 1 : 2;
  return `${qBin}_${cBin}_${tBin}_${s.weather}_${s.emergencyActive ? 1 : 0}`;
}

function getQValues(nodeId: string, key: QKey): number[] {
  if (!qTables.has(nodeId)) qTables.set(nodeId, new Map());
  const table = qTables.get(nodeId)!;
  if (!table.has(key)) table.set(key, ACTIONS.map(() => 0));
  return table.get(key)!;
}

/** Reward function: multi-objective */
function computeReward(state: SignalState, action: SignalAction): number {
  let reward = 0;

  // Objective 1: Minimize queue length (higher queue = more penalty)
  reward -= state.queueLength * 2;

  // Objective 2: Throughput (balanced green times = better flow)
  const balance = 1 - Math.abs(action.greenNS - action.greenEW) / (action.greenNS + action.greenEW);
  reward += balance * 20;

  // Objective 3: Emergency priority
  if (state.emergencyActive) {
    reward += (action.greenNS >= 50 || action.greenEW >= 50) ? 50 : -30;
  }

  // Objective 4: Weather adaptation (longer phases in bad weather)
  if (state.weather > 0) {
    const totalCycle = action.greenNS + action.greenEW + action.yellowDuration * 2;
    reward += totalCycle > 80 ? 10 : -5;
  }

  // Objective 5: Congestion reduction
  if (state.congestion > 80) {
    reward += Math.max(action.greenNS, action.greenEW) >= 45 ? 15 : -10;
  }

  return reward;
}

/** Select best action using epsilon-greedy */
export function selectAction(state: SignalState): { action: SignalAction; actionIndex: number } {
  const key = stateKey(state);
  const qValues = getQValues(state.nodeId, key);

  if (Math.random() < EPSILON) {
    const idx = Math.floor(Math.random() * ACTIONS.length);
    return { action: ACTIONS[idx], actionIndex: idx };
  }

  let bestIdx = 0;
  let bestVal = -Infinity;
  for (let i = 0; i < qValues.length; i++) {
    if (qValues[i] > bestVal) {
      bestVal = qValues[i];
      bestIdx = i;
    }
  }
  return { action: ACTIONS[bestIdx], actionIndex: bestIdx };
}

/** Update Q-value after observing next state */
export function updateQ(
  state: SignalState,
  actionIdx: number,
  nextState: SignalState
): number {
  const key = stateKey(state);
  const nextKey = stateKey(nextState);
  const qValues = getQValues(state.nodeId, key);
  const nextQValues = getQValues(state.nodeId, nextKey);

  const reward = computeReward(state, ACTIONS[actionIdx]);
  const maxNextQ = Math.max(...nextQValues);

  qValues[actionIdx] = qValues[actionIdx] + ALPHA * (reward + GAMMA * maxNextQ - qValues[actionIdx]);

  return reward;
}

/** Run one optimization step for all signal intersections */
export function optimizeSignals(
  nodes: { id: string; queueLength: number; congestion: number; emergencyActive: boolean }[],
  weather: number = 0
): Map<string, { action: SignalAction; reward: number }> {
  const hour = new Date().getHours();
  const results = new Map<string, { action: SignalAction; reward: number }>();

  for (const node of nodes) {
    const state: SignalState = {
      nodeId: node.id,
      queueLength: node.queueLength,
      congestion: node.congestion,
      timeSlot: hour,
      weather,
      emergencyActive: node.emergencyActive,
    };

    const { action, actionIndex } = selectAction(state);

    // Simulate next state (simplified)
    const nextState: SignalState = {
      ...state,
      queueLength: Math.max(0, state.queueLength - Math.floor(Math.random() * 5)),
      congestion: Math.max(0, state.congestion - Math.floor(Math.random() * 10)),
    };

    const reward = updateQ(state, actionIndex, nextState);
    results.set(node.id, { action, reward });
  }

  return results;
}

export { ACTIONS };
