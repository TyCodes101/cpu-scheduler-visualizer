export default function ProcessTable({ processes, onChangeProcess, onAddProcess, onRemoveProcess, onReset }) {
  return (
    <section className="panel" aria-labelledby="process-heading">
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">Input</p>
          <h2 id="process-heading">Process table</h2>
        </div>
        <div className="panel-actions">
          <button type="button" className="secondary-button" onClick={onAddProcess}>
            Add row
          </button>
          <button type="button" className="ghost-button" onClick={onReset}>
            Reset rows
          </button>
        </div>
      </div>
      <div className="table-wrap">
        <table className="process-table">
          <thead>
            <tr>
              <th>Process</th>
              <th>Arrival</th>
              <th>Burst</th>
              <th>Priority</th>
              <th aria-label="actions"> </th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={process.id + index}>
                <td>
                  <input
                    aria-label={`Process id ${index + 1}`}
                    value={process.id}
                    onChange={(event) => onChangeProcess(index, 'id', event.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`Arrival time ${index + 1}`}
                    type="number"
                    min="0"
                    value={process.arrivalTime}
                    onChange={(event) => onChangeProcess(index, 'arrivalTime', event.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`Burst time ${index + 1}`}
                    type="number"
                    min="1"
                    value={process.burstTime}
                    onChange={(event) => onChangeProcess(index, 'burstTime', event.target.value)}
                  />
                </td>
                <td>
                  <input
                    aria-label={`Priority ${index + 1}`}
                    type="number"
                    min="1"
                    value={process.priority}
                    onChange={(event) => onChangeProcess(index, 'priority', event.target.value)}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => onRemoveProcess(index)}
                    disabled={processes.length === 1}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="helper-copy">
        Lower priority numbers are treated as higher priority. Burst time must be greater than zero.
      </p>
    </section>
  );
}
