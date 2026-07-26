export function ScoreBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="score-row" aria-label={`${label}: ${value} out of 5`}>
      <span>{label}</span>
      <strong>{value}<small>/5</small></strong>
    </div>
  );
}
