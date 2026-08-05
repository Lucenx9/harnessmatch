import { describe, expect, it } from "vitest";
import {
  existingSpotlightIssue,
  spotlightAlertBody,
  spotlightIssueTitle,
} from "../scripts/lib/spotlight-alert.mjs";

const runUrl = "https://github.com/Lucenx9/harnessmatch/actions/runs/1234567890";

describe("spotlight staleness alert", () => {
  it("reuses the open alert instead of opening a second one", () => {
    const issues = [
      { number: 11, title: "Something else" },
      { number: 12, title: spotlightIssueTitle },
    ];

    expect(existingSpotlightIssue(issues)?.number).toBe(12);
  });

  it("never mistakes a pull request for the open alert", () => {
    const issues = [{ number: 13, title: spotlightIssueTitle, pull_request: { url: "https://example.test" } }];

    expect(existingSpotlightIssue(issues)).toBeNull();
  });

  it("opens a fresh alert when none is tracked", () => {
    expect(existingSpotlightIssue([])).toBeNull();
    expect(() => existingSpotlightIssue("not-a-list" as unknown as unknown[])).toThrow(/must be an array/);
  });

  it("names the failing run so the alert is actionable", () => {
    const body = spotlightAlertBody(runUrl);

    expect(body).toContain(runUrl);
    expect(body).toContain("src/data/home-spotlight.ts");
  });

  it("refuses an alert that cannot point at the failing run", () => {
    expect(() => spotlightAlertBody("")).toThrow(/failing run URL/);
    expect(() => spotlightAlertBody("javascript:alert(1)")).toThrow(/failing run URL/);
  });
});
