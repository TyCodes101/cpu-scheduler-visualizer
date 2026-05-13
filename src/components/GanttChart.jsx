function blockStyle(block, index, totalDuration, colorMap) {
  const width = `${Math.max((block.duration / totalDuration) * 100, 6)}%`;
  return {
    width,
    background: block.isIdle ? 'rgba(255,255,255,0.06)' : colorMap[block.label],
    animationDelay: `${index * 80}ms`,
  };
}

export default function GanttChart({ timeline, colorMap }) {
  if (!timeline.length) {
    return (
      <section className="panel" aria-labelledby="gantt-heading">
        <p className="eyebrow">Timeline</p>
        <h2 id="gantt-heading">Gantt chart</h2>
        <p className="empty-state">Add a valid process list to generate a simulation timeline.</p>
      </section>
    );
  }

  const totalDuration = timeline[timeline.length - 1].end - timeline[0].start;

  return (
    <section className="panel" aria-labelledby="gantt-heading">
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">Timeline</p>
          <h2 id="gantt-heading">Gantt chart</h2>
        </div>
      </div>
      <div className="gantt-chart" role="img" aria-label="CPU execution timeline">
        {timeline.map((block, index) => (
          <div className="gantt-block" key={`${block.label}-${block.start}-${block.end}`} style={blockStyle(block, index, totalDuration, colorMap)}>
            <span className="gantt-label">{block.label}</span>
            <span className="gantt-range">{block.start} - {block.end}</span>
          </div>
        ))}
      </div>
      <div className="timeline-ticks">
        {timeline.map((block) => (
          <span key={`tick-${block.start}-${block.end}`}>{block.start}</span>
        ))}
        <span>{timeline[timeline.length - 1].end}</span>
      </div>
    </section>
  );
}
