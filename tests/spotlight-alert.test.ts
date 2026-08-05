import { describe, expect, it } from "vitest";
import {
  existingSpotlightIssue,
  findExistingSpotlightIssue,
  parseGitHubIssueSummary,
  spotlightAlertBody,
  spotlightIssueTitle,
  spotlightIssuePageSize,
  validatedGitHubRepository,
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

  it("checks later issue pages before deciding the alert is missing", async () => {
    const firstPage = Array.from({ length: spotlightIssuePageSize }, (_, index) => ({
      number: index + 1,
      title: `Unrelated issue ${index + 1}`,
    }));
    const requestedPages: number[] = [];

    const existing = await findExistingSpotlightIssue(async (page) => {
      requestedPages.push(page);
      return page === 1 ? firstPage : [{ number: 101, title: spotlightIssueTitle }];
    });

    expect({ issueNumber: existing?.number, requestedPages }).toEqual({
      issueNumber: 101,
      requestedPages: [1, 2],
    });
  });

  it("opens a fresh alert when none is tracked", () => {
    expect(existingSpotlightIssue([])).toBeNull();
    expect(() => existingSpotlightIssue("not-a-list")).toThrow(/must be an array/);
  });

  it("validates GitHub issue records before using them", () => {
    expect(parseGitHubIssueSummary({ number: 14, title: spotlightIssueTitle })).toEqual({
      number: 14,
      title: spotlightIssueTitle,
    });
    expect(() => parseGitHubIssueSummary({ number: "14", title: spotlightIssueTitle })).toThrow(
      /positive integer/,
    );
    expect(() => existingSpotlightIssue([null])).toThrow(/issue record must be an object/);
  });

  it("accepts only a repository owner and name", () => {
    expect(validatedGitHubRepository("Lucenx9/harnessmatch")).toBe("Lucenx9/harnessmatch");
    expect(() => validatedGitHubRepository("Lucenx9/harnessmatch/issues"))
      .toThrow(/owner\/repository/);
    expect(() => validatedGitHubRepository("Lucenx9/..")).toThrow(/owner\/repository/);
  });

  it("names the failing run so the alert is actionable", () => {
    const body = spotlightAlertBody(runUrl);

    expect(body).toContain(runUrl);
    expect(body).toContain("src/data/home-spotlight.ts");
  });

  it("refuses an alert that cannot point at the failing run", () => {
    expect(() => spotlightAlertBody("")).toThrow(/failing run URL/);
    expect(() => spotlightAlertBody("https://")).toThrow(/failing run URL/);
    expect(() => spotlightAlertBody("https://example.com/not-a-run")).toThrow(/failing run URL/);
    expect(() => spotlightAlertBody("javascript:alert(1)")).toThrow(/failing run URL/);
  });
});
