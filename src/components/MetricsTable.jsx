export default function MetricsTable({ processMetrics }) {
  return (
    <section className="panel" aria-labelledby="metrics-heading">
      <p className="eyebrow">Breakdown</p>
      <h2 id="metrics-heading">Per-process metrics</h2>
      <div className="table-wrap">
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival</th>
              <th>Burst</th>
              <th>Priority</th>
              <th>Completion</th>
              <th>Waiting</th>
              <th>Turnaround</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {processMetrics.map((process) => (
              <tr key={process.id}>
                <td>{process.id}</td>
                <td>{process.arrivalTime}</td>
                <td>{process.burstTime}</td>
                <td>{process.priority}</td>
                <td>{process.completionTime}</td>
                <td>{process.waitingTime}</td>
                <td>{process.turnaroundTime}</td>
                <td>{process.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
