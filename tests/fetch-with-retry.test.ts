import { describe, expect, it, vi } from "vitest";
import {
  fetchJsonWithRetry,
  fetchResponseWithRetry,
} from "../scripts/lib/fetch-with-retry.mjs";

const requestUrl = "https://example.test/resource";

describe("fetchResponseWithRetry", () => {
  it("fails immediately for a non-retryable HTTP response", async () => {
    const fetchImplementation = vi.fn().mockResolvedValue(
      new Response("not found", { status: 404 }),
    );
    const sleep = vi.fn();

    await expect(fetchResponseWithRetry(requestUrl, {}, {
      label: "fixture",
      timeoutMs: 1_000,
      retryDelayMs: 10,
      fetchImplementation,
      sleep,
    })).rejects.toThrow("fixture: HTTP 404 not found");

    expect(fetchImplementation).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it("retries a transient HTTP response and returns the first success", async () => {
    const success = new Response("ok", { status: 200 });
    const fetchImplementation = vi.fn()
      .mockResolvedValueOnce(new Response("unavailable", { status: 503 }))
      .mockResolvedValueOnce(success);
    const sleep = vi.fn().mockResolvedValue(undefined);

    await expect(fetchResponseWithRetry(requestUrl, {}, {
      label: "fixture",
      timeoutMs: 1_000,
      retryDelayMs: 25,
      fetchImplementation,
      sleep,
    })).resolves.toBe(success);

    expect(fetchImplementation).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledOnce();
    expect(sleep).toHaveBeenCalledWith(25);
  });

  it("reports the final transient HTTP response after exhausting retries", async () => {
    const fetchImplementation = vi.fn().mockImplementation(() => Promise.resolve(
      new Response("unavailable", { status: 503 }),
    ));
    const sleep = vi.fn().mockResolvedValue(undefined);

    await expect(fetchResponseWithRetry(requestUrl, {}, {
      label: "fixture",
      timeoutMs: 1_000,
      retryDelayMs: 10,
      fetchImplementation,
      sleep,
    })).rejects.toThrow("fixture: HTTP 503 unavailable");

    expect(fetchImplementation).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it("retries a successful response whose JSON body cannot be parsed", async () => {
    const fetchImplementation = vi.fn()
      .mockResolvedValueOnce(new Response("{", { status: 200 }))
      .mockResolvedValueOnce(Response.json({ status: "ok" }));
    const sleep = vi.fn().mockResolvedValue(undefined);

    await expect(fetchJsonWithRetry(requestUrl, {}, {
      label: "fixture",
      timeoutMs: 1_000,
      retryDelayMs: 10,
      fetchImplementation,
      sleep,
    })).resolves.toEqual({ status: "ok" });

    expect(fetchImplementation).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledOnce();
  });

  it("exhausts the retry budget for network failures", async () => {
    const networkError = new Error("connection reset");
    const fetchImplementation = vi.fn().mockRejectedValue(networkError);
    const sleep = vi.fn().mockResolvedValue(undefined);

    await expect(fetchResponseWithRetry(requestUrl, {}, {
      label: "fixture",
      timeoutMs: 1_000,
      retryDelayMs: 10,
      fetchImplementation,
      sleep,
    })).rejects.toThrow("fixture: request failed after 3 attempts");

    expect(fetchImplementation).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenNthCalledWith(1, 10);
    expect(sleep).toHaveBeenNthCalledWith(2, 20);
  });
});
