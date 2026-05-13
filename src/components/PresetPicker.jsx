export default function PresetPicker({ presets, activePresetId, onSelectPreset }) {
  return (
    <section className="panel" aria-labelledby="preset-heading">
      <p className="eyebrow">Fast demo</p>
      <h2 id="preset-heading">Try a preset scenario</h2>
      <div className="preset-grid">
        {presets.map((preset) => (
          <button
            type="button"
            key={preset.id}
            className={`preset-card ${activePresetId === preset.id ? 'active' : ''}`}
            onClick={() => onSelectPreset(preset.id)}
          >
            <strong>{preset.name}</strong>
            <span>{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
