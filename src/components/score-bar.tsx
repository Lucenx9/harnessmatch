export function ScoreBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="score-row">
      <div className="score-label">
        <span>{label}</span>
        <strong>{value}/5</strong>
      </div>
      <div className="score-track" aria-label={`${label}: ${value} out of 5`}>
        <span style={{ width: `${value * 20}%` }} />
      </div>
    </div>
  );
}
