import { useMemo, useState } from 'react';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import Legend from './components/Legend';
import MetricsTable from './components/MetricsTable';
import PresetPicker from './components/PresetPicker';
import ProcessTable from './components/ProcessTable';
import SummaryCards from './components/SummaryCards';
import { clonePreset, presets } from './data/presets';
import { getAlgorithmLabel, simulateSchedule } from './lib/schedulers';

const algorithmDescriptions = {
  fcfs: 'First Come, First Served runs the earliest arrival first. It is easy to understand, but short urgent work can get stuck behind long jobs.',
  sjf: 'Shortest Job First picks the shortest available burst next. It often improves average waiting time, but it needs good burst estimates.',
  priority: 'Priority Scheduling chooses the highest-priority available job first. In this demo, lower priority numbers mean higher priority.',
  'round-robin': 'Round Robin rotates work in fixed time slices. It is great for responsiveness because every process gets regular CPU time.',
};

function createEmptyProcess(index) {
  return {
    id: `P${index + 1}`,
    arrivalTime: 0,
    burstTime: 1,
    priority: index + 1,
  };
}

function buildColorMap(timeline) {
  const processIds = [...new Set(timeline.filter((block) => !block.isIdle).map((block) => block.label))];
  const map = { Idle: 'rgba(255,255,255,0.08)' };
  processIds.forEach((processId, index) => {
    const hue = (index * 77 + 148) % 360;
    map[processId] = `hsl(${hue} 70% 58%)`;
  });
  return map;
}

export default function App() {
  const defaultPreset = clonePreset(presets[0].id);
  const [activePresetId, setActivePresetId] = useState(defaultPreset.id);
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [processes, setProcesses] = useState(defaultPreset.processes);
  const [quantum, setQuantum] = useState(defaultPreset.quantum);

  const result = useMemo(
    () => simulateSchedule({ algorithm, processes, quantum }),
    [algorithm, processes, quantum]
  );

  const activePreset = presets.find((preset) => preset.id === activePresetId) ?? presets[0];
  const totalTimelineTime = result.timeline.length ? result.timeline[result.timeline.length - 1].end : 0;
  const colorMap = useMemo(() => buildColorMap(result.timeline), [result.timeline]);

  const handlePresetSelect = (presetId) => {
    const preset = clonePreset(presetId);
    setActivePresetId(preset.id);
    setProcesses(preset.processes);
    setQuantum(preset.quantum);
  };

  const handleProcessChange = (index, field, value) => {
    setProcesses((current) =>
      current.map((process, processIndex) =>
        processIndex === index
          ? {
              ...process,
              [field]: field === 'id' ? value : Number(value),
            }
          : process
      )
    );
  };

  const handleAddProcess = () => {
    setProcesses((current) => [...current, createEmptyProcess(current.length)]);
  };

  const handleRemoveProcess = (index) => {
    setProcesses((current) => current.filter((_, processIndex) => processIndex !== index));
  };

  const handleReset = () => {
    const preset = clonePreset(activePresetId);
    setProcesses(preset.processes);
    setQuantum(preset.quantum);
  };

  const legendColors = Object.fromEntries(
    Object.entries(colorMap).filter(([key]) => key !== 'Idle')
  );

  return (
    <div className="app-shell">
      <header className="hero-section">
        <div className="hero-copy-block">
          <p className="eyebrow">React project demo</p>
          <h1>CPU Scheduler Visualizer</h1>
          <p className="hero-copy">
            A polished operating systems project that turns classic scheduling algorithms into a recruiter-friendly visual demo.
            Compare FCFS, SJF, Priority, and Round Robin using editable process inputs, animated execution blocks, and live metrics.
          </p>
          <div className="hero-badges">
            <span>Interactive Gantt chart</span>
            <span>Editable process table</span>
            <span>Portfolio-ready UI</span>
          </div>
        </div>
        <div className="hero-metric-card panel">
          <p className="eyebrow">Current simulation</p>
          <h2>{getAlgorithmLabel(algorithm)}</h2>
          <p className="hero-side-copy">Preset: <strong>{activePreset.name}</strong></p>
          <div className="hero-side-stats">
            <div>
              <span>Total runtime</span>
              <strong>{totalTimelineTime}</strong>
            </div>
            <div>
              <span>Throughput</span>
              <strong>{result.throughput}</strong>
            </div>
          </div>
          <ul className="hero-side-list">
            <li>Editable process inputs</li>
            <li>Live metrics and averages</li>
            <li>Fast demo presets for screenshots</li>
          </ul>
        </div>
      </header>

      <main className="dashboard-grid">
        <div className="left-column">
          <PresetPicker presets={presets} activePresetId={activePresetId} onSelectPreset={handlePresetSelect} />
          <AlgorithmSelector
            algorithm={algorithm}
            quantum={quantum}
            onAlgorithmChange={setAlgorithm}
            onQuantumChange={setQuantum}
          />
          <ProcessTable
            processes={processes}
            onChangeProcess={handleProcessChange}
            onAddProcess={handleAddProcess}
            onRemoveProcess={handleRemoveProcess}
            onReset={handleReset}
          />
        </div>

        <div className="right-column">
          <SummaryCards result={result} processCount={result.processMetrics.length} />
          <GanttChart timeline={result.timeline} colorMap={colorMap} />
          <Legend colorMap={legendColors} algorithmDescription={algorithmDescriptions[algorithm]} />
          <MetricsTable processMetrics={result.processMetrics} />
        </div>
      </main>
    </div>
  );
}
