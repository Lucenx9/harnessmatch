"use client";

import { useMemo, useState } from "react";
import { harnesses } from "@/data/harnesses";
import type { FeatureKey } from "@/lib/types";

const featureRows: Array<[FeatureKey, string]> = [
  ["mcp", "MCP"],
  ["localModels", "Local models"],
  ["subagents", "Subagents"],
  ["headless", "Headless"],
  ["browser", "Browser interaction"],
  ["sandbox", "Built-in sandbox"],
  ["checkpoints", "Checkpoints"],
];

const scoreRows = [
  ["simplicity", "Simplicity"],
  ["flexibility", "Flexibility"],
  ["security", "Security controls"],
  ["autonomy", "Autonomy"],
  ["automation", "Automation"],
  ["largeRepo", "Large-repo fit"],
  ["humanControl", "Human control"],
] as const;

export function CompareClient() {
  const [selected, setSelected] = useState(["claude-code", "codex", "opencode"]);
  const chosen = useMemo(
    () => selected.map((id) => harnesses.find((harness) => harness.id === id)).filter(Boolean),
    [selected],
  );

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 4) return current;
      return [...current, id];
    });
  }

  return (
    <div className="compare-layout">
      <aside className="compare-picker card">
        <h2>Select up to four</h2>
        <p>Keep the underlying model constant when comparing real performance.</p>
        <div className="picker-list">
          {harnesses.map((harness) => (
            <label key={harness.id} className="picker-row">
              <input
                type="checkbox"
                checked={selected.includes(harness.id)}
                onChange={() => toggle(harness.id)}
                disabled={!selected.includes(harness.id) && selected.length >= 4}
              />
              <span>
                <strong>{harness.name}</strong>
                <small>{harness.category}</small>
              </span>
            </label>
          ))}
        </div>
      </aside>

      <div className="comparison-scroll">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Dimension</th>
              {chosen.map((harness) => <th key={harness!.id}>{harness!.name}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Best fit</th>
              {chosen.map((harness) => <td key={harness!.id}>{harness!.bestFor[0]}</td>)}
            </tr>
            <tr>
              <th>Interfaces</th>
              {chosen.map((harness) => <td key={harness!.id}>{harness!.interfaces.join(", ")}</td>)}
            </tr>
            <tr>
              <th>Provider posture</th>
              {chosen.map((harness) => <td key={harness!.id}>{harness!.providerStyle}</td>)}
            </tr>
            <tr>
              <th>License</th>
              {chosen.map((harness) => <td key={harness!.id}>{harness!.license}</td>)}
            </tr>
            {featureRows.map(([feature, label]) => (
              <tr key={feature}>
                <th>{label}</th>
                {chosen.map((harness) => (
                  <td key={harness!.id} className={harness!.features[feature] ? "yes" : "no"}>
                    {harness!.features[feature] ? "Yes" : "No"}
                  </td>
                ))}
              </tr>
            ))}
            {scoreRows.map(([score, label]) => (
              <tr key={score}>
                <th>{label}</th>
                {chosen.map((harness) => (
                  <td key={harness!.id}><strong>{harness!.capabilities[score]}/5</strong></td>
                ))}
              </tr>
            ))}
            <tr>
              <th>Main trade-off</th>
              {chosen.map((harness) => <td key={harness!.id}>{harness!.tradeoffs[0]}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
