import type { Icon } from "@phosphor-icons/react";
import {
  ArrowCounterClockwiseIcon,
  BrowserIcon,
  ChartLineIcon,
  CheckCircleIcon,
  CodeIcon,
  CpuIcon,
  CubeIcon,
  DatabaseIcon,
  EyeIcon,
  GitBranchIcon,
  ListChecksIcon,
  LockIcon,
  MonitorArrowUpIcon,
  PlugsConnectedIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  SquaresFourIcon,
  StackIcon,
  StarIcon,
  TargetIcon,
  UsersThreeIcon,
  WarningIcon,
} from "@phosphor-icons/react/ssr";

export type VisualIconName =
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
  | "preferred"
  | "local-models"
  | "security-sandbox"
  | "browser-tool"
  | "file-rollback"
  | "membership"
  | "operating-model"
  | "capability-support"
  | "evidence"
  | "measurements";

const icons: Record<VisualIconName, Icon> = {
  catalog: SquaresFourIcon,
  "code-audit": CodeIcon,
  proprietary: LockIcon,
  "focused-review": EyeIcon,
  "parallel-local": GitBranchIcon,
  "remote-control": MonitorArrowUpIcon,
  "team-workspace": UsersThreeIcon,
  "workspace-isolation": CubeIcon,
  "workflow-fit": TargetIcon,
  "check-first": WarningIcon,
  "harness-coverage": PlugsConnectedIcon,
  required: CheckCircleIcon,
  preferred: StarIcon,
  "local-models": CpuIcon,
  "security-sandbox": ShieldCheckIcon,
  "browser-tool": BrowserIcon,
  "file-rollback": ArrowCounterClockwiseIcon,
  membership: SealCheckIcon,
  "operating-model": StackIcon,
  "capability-support": ListChecksIcon,
  evidence: DatabaseIcon,
  measurements: ChartLineIcon,
};

export function VisualIcon({ name }: { name: VisualIconName }) {
  const IconComponent = icons[name];

  return (
    <span className={`visual-icon visual-icon--${name}`} aria-hidden="true">
      <IconComponent size={20} weight="regular" />
    </span>
  );
}
