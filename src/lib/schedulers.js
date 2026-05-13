import { computeAverages } from './metrics';

function normalizeProcesses(processes) {
  return processes
    .map((process, index) => ({
      id: String(process.id || `P${index + 1}`),
      arrivalTime: Number(process.arrivalTime),
      burstTime: Number(process.burstTime),
      priority: Number(process.priority),
      originalIndex: index,
    }))
    .filter(
      (process) =>
        Number.isFinite(process.arrivalTime) &&
        Number.isFinite(process.burstTime) &&
        Number.isFinite(process.priority) &&
        process.arrivalTime >= 0 &&
        process.burstTime > 0
    );
}

function compareByArrival(a, b) {
  return a.arrivalTime - b.arrivalTime || a.originalIndex - b.originalIndex;
}

function finalizeMetrics(processes, processState, timeline, algorithm) {
  const metrics = processes.map((process) => {
    const state = processState.get(process.id);
    const turnaroundTime = state.completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    const responseTime = state.firstStart - process.arrivalTime;

    return {
      id: process.id,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      priority: process.priority,
      completionTime: state.completionTime,
      turnaroundTime,
      waitingTime,
      responseTime,
    };
  });

  return {
    algorithm,
    timeline,
    processMetrics: metrics,
    ...computeAverages(metrics),
  };
}

function createStateMap(processes) {
  return new Map(
    processes.map((process) => [
      process.id,
      {
        remainingTime: process.burstTime,
        firstStart: null,
        completionTime: null,
      },
    ])
  );
}

function pushBlock(timeline, label, start, end) {
  if (end <= start) return;
  const last = timeline[timeline.length - 1];
  if (last && last.label === label && last.end === start) {
    last.end = end;
    return;
  }
  timeline.push({ label, start, end, duration: end - start, isIdle: label === 'Idle' });
}

function selectAvailable(processes, completedIds, time, selector) {
  const available = processes.filter(
    (process) => !completedIds.has(process.id) && process.arrivalTime <= time
  );
  if (!available.length) return null;
  available.sort(selector);
  return available[0];
}

function runNonPreemptive(processes, algorithm, selector) {
  const sorted = [...processes].sort(compareByArrival);
  const state = createStateMap(sorted);
  const timeline = [];
  const completedIds = new Set();
  let time = 0;

  while (completedIds.size < sorted.length) {
    const next = selectAvailable(sorted, completedIds, time, selector);

    if (!next) {
      const upcoming = sorted
        .filter((process) => !completedIds.has(process.id))
        .sort(compareByArrival)[0];
      pushBlock(timeline, 'Idle', time, upcoming.arrivalTime);
      time = upcoming.arrivalTime;
      continue;
    }

    const processState = state.get(next.id);
    if (processState.firstStart === null) {
      processState.firstStart = time;
    }
    const endTime = time + next.burstTime;
    pushBlock(timeline, next.id, time, endTime);
    processState.remainingTime = 0;
    processState.completionTime = endTime;
    completedIds.add(next.id);
    time = endTime;
  }

  return finalizeMetrics(sorted, state, timeline, algorithm);
}

function runRoundRobin(processes, quantum) {
  const sorted = [...processes].sort(compareByArrival);
  const state = createStateMap(sorted);
  const timeline = [];
  const queue = [];
  const enqueued = new Set();
  let index = 0;
  let time = 0;
  let completed = 0;

  const enqueueArrivals = (upToTime) => {
    while (index < sorted.length && sorted[index].arrivalTime <= upToTime) {
      const process = sorted[index];
      if (!enqueued.has(process.id)) {
        queue.push(process);
        enqueued.add(process.id);
      }
      index += 1;
    }
  };

  while (completed < sorted.length) {
    enqueueArrivals(time);

    if (!queue.length) {
      const nextProcess = sorted[index];
      pushBlock(timeline, 'Idle', time, nextProcess.arrivalTime);
      time = nextProcess.arrivalTime;
      enqueueArrivals(time);
      continue;
    }

    const current = queue.shift();
    const currentState = state.get(current.id);

    if (currentState.firstStart === null) {
      currentState.firstStart = time;
    }

    const slice = Math.min(currentState.remainingTime, quantum);
    const startTime = time;
    const endTime = time + slice;
    pushBlock(timeline, current.id, startTime, endTime);
    time = endTime;
    currentState.remainingTime -= slice;

    enqueueArrivals(time);

    if (currentState.remainingTime > 0) {
      queue.push(current);
    } else {
      currentState.completionTime = time;
      completed += 1;
    }
  }

  return finalizeMetrics(sorted, state, timeline, 'round-robin');
}

export function simulateSchedule({ algorithm, processes, quantum = 2 }) {
  const normalized = normalizeProcesses(processes);
  if (!normalized.length) {
    return {
      algorithm,
      timeline: [],
      processMetrics: [],
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
      averageResponseTime: 0,
      throughput: 0,
    };
  }

  switch (algorithm) {
    case 'fcfs':
      return runNonPreemptive(normalized, 'fcfs', compareByArrival);
    case 'sjf':
      return runNonPreemptive(
        normalized,
        'sjf',
        (a, b) =>
          a.burstTime - b.burstTime ||
          a.arrivalTime - b.arrivalTime ||
          a.originalIndex - b.originalIndex
      );
    case 'priority':
      return runNonPreemptive(
        normalized,
        'priority',
        (a, b) =>
          a.priority - b.priority ||
          a.arrivalTime - b.arrivalTime ||
          a.originalIndex - b.originalIndex
      );
    case 'round-robin':
      return runRoundRobin(normalized, Math.max(1, Number(quantum) || 1));
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
}

export function getAlgorithmLabel(algorithm) {
  const labels = {
    fcfs: 'First Come, First Served',
    sjf: 'Shortest Job First',
    priority: 'Priority Scheduling',
    'round-robin': 'Round Robin',
  };
  return labels[algorithm] || algorithm;
}
