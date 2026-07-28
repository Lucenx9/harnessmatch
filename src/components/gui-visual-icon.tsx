export type GuiVisualIconName =
  | "catalog"
  | "code-audit"
  | "proprietary"
  | "focused-review"
  | "parallel-local"
  | "remote-control"
  | "team-workspace"
  | "workspace-isolation"
  | "workflow-fit"
  | "check-first"
  | "harness-coverage"
  | "required"
  | "preferred";

export function GuiVisualIcon({ name }: { name: GuiVisualIconName }) {
  const paths: Record<GuiVisualIconName, React.ReactNode> = {
    catalog: (
      <>
        <rect x="3.5" y="3.5" width="6" height="6" rx="1.25" />
        <rect x="14.5" y="3.5" width="6" height="6" rx="1.25" />
        <rect x="3.5" y="14.5" width="6" height="6" rx="1.25" />
        <rect x="14.5" y="14.5" width="6" height="6" rx="1.25" />
      </>
    ),
    "code-audit": (
      <>
        <path d="m8.5 7-5 5 5 5" />
        <path d="m15.5 7 5 5-5 5" />
        <path d="m13.5 4-3 16" />
      </>
    ),
    proprietary: (
      <>
        <rect x="4.5" y="10" width="15" height="11" rx="2" />
        <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
        <circle cx="12" cy="15.5" r="1" />
      </>
    ),
    "focused-review": (
      <>
        <path d="M2.75 12s3.4-5 9.25-5 9.25 5 9.25 5-3.4 5-9.25 5S2.75 12 2.75 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    "parallel-local": (
      <>
        <rect x="3" y="4" width="6" height="6" rx="1.5" />
        <rect x="15" y="14" width="6" height="6" rx="1.5" />
        <path d="M9 7h3a3 3 0 0 1 3 3v4" />
        <path d="M12 17H9a3 3 0 0 1-3-3v-4" />
      </>
    ),
    "remote-control": (
      <>
        <rect x="3" y="5" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 18v3" />
        <path d="m10 13 5-5m0 0h-4m4 0v4" />
      </>
    ),
    "team-workspace": (
      <>
        <circle cx="8" cy="9" r="3" />
        <circle cx="17" cy="8" r="2.25" />
        <path d="M2.75 20v-1.25A5.25 5.25 0 0 1 8 13.5a5.25 5.25 0 0 1 5.25 5.25V20" />
        <path d="M14.5 13.75A4.25 4.25 0 0 1 21 17.35V19" />
      </>
    ),
    "workspace-isolation": (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="m4.5 7.75 7.5 4.2 7.5-4.2M12 12v9" />
      </>
    ),
    "workflow-fit": (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    "check-first": (
      <>
        <path d="M10.3 4.55 2.75 18a2 2 0 0 0 1.75 3h15a2 2 0 0 0 1.75-3L13.7 4.55a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v5M12 17.5v.1" />
      </>
    ),
    "harness-coverage": (
      <>
        <circle cx="6" cy="7" r="2.5" />
        <circle cx="18" cy="7" r="2.5" />
        <circle cx="12" cy="18" r="2.5" />
        <path d="m8 8.5 2.75 7M16 8.5l-2.75 7M8.5 7h7" />
      </>
    ),
    required: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16.5 8.5" />
      </>
    ),
    preferred: (
      <path d="m12 3 2.7 5.45 6.02.88-4.36 4.25 1.03 6-5.39-2.84-5.39 2.84 1.03-6-4.36-4.25 6.02-.88L12 3Z" />
    ),
  };

  return (
    <span className={`gui-visual-icon gui-visual-icon--${name}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </svg>
    </span>
  );
}
