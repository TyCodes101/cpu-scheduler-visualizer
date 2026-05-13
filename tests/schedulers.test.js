import { describe, expect, test } from 'vitest';
import { simulateSchedule } from '../src/lib/schedulers';

describe('simulateSchedule', () => {
  test('calculates FCFS timeline and metrics', () => {
    const result = simulateSchedule({
      algorithm: 'fcfs',
      processes: [
        { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
        { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
        { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 3 },
      ],
    });

    expect(result.timeline.map((block) => block.label)).toEqual(['P1', 'P2', 'P3']);
    expect(result.processMetrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'P1', waitingTime: 0, turnaroundTime: 5, responseTime: 0 }),
        expect.objectContaining({ id: 'P2', waitingTime: 4, turnaroundTime: 7, responseTime: 4 }),
        expect.objectContaining({ id: 'P3', waitingTime: 6, turnaroundTime: 7, responseTime: 6 }),
      ])
    );
  });

  test('runs non-preemptive SJF using shortest available burst', () => {
    const result = simulateSchedule({
      algorithm: 'sjf',
      processes: [
        { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
        { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
        { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 3 },
      ],
    });

    expect(result.timeline.map((block) => block.label)).toEqual(['P1', 'P3', 'P2']);
    expect(result.processMetrics.find((process) => process.id === 'P3')).toMatchObject({
      waitingTime: 3,
      turnaroundTime: 4,
      responseTime: 3,
    });
  });

  test('runs non-preemptive priority scheduling using lower number as higher priority', () => {
    const result = simulateSchedule({
      algorithm: 'priority',
      processes: [
        { id: 'P1', arrivalTime: 0, burstTime: 4, priority: 3 },
        { id: 'P2', arrivalTime: 0, burstTime: 3, priority: 1 },
        { id: 'P3', arrivalTime: 1, burstTime: 2, priority: 2 },
      ],
    });

    expect(result.timeline.map((block) => block.label)).toEqual(['P2', 'P3', 'P1']);
    expect(result.processMetrics.find((process) => process.id === 'P1')).toMatchObject({
      completionTime: 9,
      waitingTime: 5,
    });
  });

  test('runs round robin with the provided quantum', () => {
    const result = simulateSchedule({
      algorithm: 'round-robin',
      quantum: 2,
      processes: [
        { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
        { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
        { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 3 },
      ],
    });

    expect(result.timeline.map((block) => `${block.label}:${block.start}-${block.end}`)).toEqual([
      'P1:0-2',
      'P2:2-4',
      'P3:4-5',
      'P1:5-7',
      'P2:7-8',
      'P1:8-9',
    ]);

    expect(result.processMetrics.find((process) => process.id === 'P2')).toMatchObject({
      responseTime: 1,
      waitingTime: 4,
      turnaroundTime: 7,
    });
  });
});
