export const presets = [
  {
    id: 'internship-rush',
    name: 'Internship Rush',
    description: 'Tight arrivals with mixed burst times that show why scheduling choice matters.',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 7, priority: 2 },
      { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 3 },
      { id: 'P4', arrivalTime: 4, burstTime: 4, priority: 2 },
    ],
    quantum: 2,
  },
  {
    id: 'campus-lab',
    name: 'Campus Lab Demo',
    description: 'A balanced classroom-style dataset that makes the Gantt chart easy to read.',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 3 },
      { id: 'P2', arrivalTime: 2, burstTime: 3, priority: 1 },
      { id: 'P3', arrivalTime: 3, burstTime: 6, priority: 4 },
      { id: 'P4', arrivalTime: 5, burstTime: 2, priority: 2 },
    ],
    quantum: 3,
  },
  {
    id: 'deadline-sprint',
    name: 'Deadline Sprint',
    description: 'Short urgent jobs arrive behind a long-running task, ideal for comparing FCFS vs SJF.',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 9, priority: 4 },
      { id: 'P2', arrivalTime: 1, burstTime: 2, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 3, priority: 2 },
      { id: 'P4', arrivalTime: 6, burstTime: 1, priority: 1 },
    ],
    quantum: 2,
  },
];

export function clonePreset(presetId) {
  const preset = presets.find((entry) => entry.id === presetId) ?? presets[0];
  return {
    ...preset,
    processes: preset.processes.map((process) => ({ ...process })),
  };
}
