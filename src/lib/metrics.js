export function roundMetric(value) {
  return Number(value.toFixed(2));
}

export function computeAverages(processMetrics) {
  if (!processMetrics.length) {
    return {
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
      averageResponseTime: 0,
      throughput: 0,
    };
  }

  const totals = processMetrics.reduce(
    (acc, process) => {
      acc.waiting += process.waitingTime;
      acc.turnaround += process.turnaroundTime;
      acc.response += process.responseTime;
      acc.finish = Math.max(acc.finish, process.completionTime);
      return acc;
    },
    { waiting: 0, turnaround: 0, response: 0, finish: 0 }
  );

  return {
    averageWaitingTime: roundMetric(totals.waiting / processMetrics.length),
    averageTurnaroundTime: roundMetric(totals.turnaround / processMetrics.length),
    averageResponseTime: roundMetric(totals.response / processMetrics.length),
    throughput: roundMetric(processMetrics.length / (totals.finish || 1)),
  };
}
