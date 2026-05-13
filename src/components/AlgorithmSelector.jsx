import { getAlgorithmLabel } from '../lib/schedulers';

const options = ['fcfs', 'sjf', 'priority', 'round-robin'];

export default function AlgorithmSelector({ algorithm, quantum, onAlgorithmChange, onQuantumChange }) {
  return (
    <section className="panel controls-panel" aria-labelledby="algorithm-heading">
      <div className="panel-heading-row">
        <div>
          <p className="eyebrow">Controls</p>
          <h2 id="algorithm-heading">Algorithm selector</h2>
        </div>
      </div>
      <div className="algorithm-grid">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`chip-button ${algorithm === option ? 'active' : ''}`}
            onClick={() => onAlgorithmChange(option)}
          >
            {getAlgorithmLabel(option)}
          </button>
        ))}
      </div>
      {algorithm === 'round-robin' ? (
        <label className="field-block" htmlFor="quantum-input">
          <span>Time quantum</span>
          <input
            id="quantum-input"
            type="number"
            min="1"
            value={quantum}
            onChange={(event) => onQuantumChange(event.target.value)}
          />
        </label>
      ) : null}
    </section>
  );
}
