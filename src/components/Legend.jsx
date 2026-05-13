export default function Legend({ colorMap, algorithmDescription }) {
  const entries = Object.entries(colorMap);

  return (
    <section className="panel legend-panel" aria-labelledby="legend-heading">
      <p className="eyebrow">Read me fast</p>
      <h2 id="legend-heading">What this simulation shows</h2>
      <p className="helper-copy">{algorithmDescription}</p>
      <div className="legend-grid">
        {entries.map(([label, color]) => (
          <div className="legend-item" key={label}>
            <span className="legend-swatch" style={{ background: color }} aria-hidden="true" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
