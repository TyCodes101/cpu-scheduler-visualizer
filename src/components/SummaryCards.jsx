function SummaryCard({ label, value, accent }) {
  return (
    <article className={`summary-card ${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default function SummaryCards({ result, processCount }) {
  return (
    <section className="summary-grid" aria-label="metrics summary">
      <SummaryCard label="Processes" value={processCount} accent="accent-sage" />
      <SummaryCard label="Average waiting time" value={result.averageWaitingTime} accent="accent-gold" />
      <SummaryCard label="Average turnaround time" value={result.averageTurnaroundTime} accent="accent-blue" />
      <SummaryCard label="Average response time" value={result.averageResponseTime} accent="accent-rose" />
    </section>
  );
}
