import { describe, expect, it, vi } from "vitest";
// @ts-expect-error The production helper is a directly executable JavaScript module.
import { assertPublicHttpUrl, isBlockedAddress, safeFetch } from "../scripts/source-health-network.mjs";

describe("source health network safety", () => {
  it.each(["127.0.0.1", "10.2.3.4", "169.254.169.254", "::1", "fd00::1", "::ffff:127.0.0.1"])(
    "blocks non-public address %s",
    (address) => expect(isBlockedAddress(address)).toBe(true),
  );

  it("rejects hostnames when any DNS result is non-public", async () => {
    const resolve = vi.fn().mockResolvedValue([{ address: "93.184.216.34" }, { address: "127.0.0.1" }]);
    await expect(assertPublicHttpUrl("https://example.com/source", resolve)).rejects.toThrow("non-public");
  });

  it("validates a redirect target before requesting it", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      status: 302,
      headers: new Headers({ location: "http://127.0.0.1/internal" }),
      body: { cancel: vi.fn() },
    });
    await expect(safeFetch("https://example.com/source", {}, {
      fetch: fetchImpl,
      lookup: vi.fn().mockResolvedValue([{ address: "93.184.216.34" }]),
    })).rejects.toThrow("non-public");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
