import { describe, expect, it, vi } from "vitest";
// @ts-expect-error The production helper is a directly executable JavaScript module.
import { assertPublicHttpUrl, isAccessRestrictedLanding, isBlockedAddress, safeFetch } from "../scripts/source-health-network.mjs";
// @ts-expect-error The production helper is a directly executable JavaScript module.
import { collectUrls, sourceUrlFields } from "../scripts/source-health-urls.mjs";

function response(status = 200, peerAddress = "93.184.216.34", headers = new Headers()) {
  return { status, ok: status >= 200 && status < 300, headers, peerAddress, body: { cancel: vi.fn() } };
}

function nodeRequestWithPeer(peerAddress?: string) {
  return vi.fn((_url, options, callback) => {
    const handlers = new Map<string, (error: Error) => void>();
    const request = {
      on: vi.fn((event: string, handler: (error: Error) => void) => {
        handlers.set(event, handler);
        return request;
      }),
      end: vi.fn(() => {
        options.lookup("example.com", { all: true }, (
          error: NodeJS.ErrnoException | null,
          addresses: Array<{ address: string; family: number }>,
        ) => {
          if (error) {
            handlers.get("error")?.(error);
            return;
          }
          callback({
            statusCode: 200,
            rawHeaders: [],
            socket: { remoteAddress: peerAddress ?? addresses.at(0)?.address },
            destroy: vi.fn(),
          });
        });
      }),
    };
    return request;
  });
}

describe("source health network safety", () => {
  it.each([
    "https://docs.example.com/login?redirect=%2Fprivate-doc",
    "https://docs.example.com/auth/signin?return_to=%2Fprivate-doc",
    "https://docs.example.com/sign-in?next=%2Fprivate-doc",
  ])("recognizes an access-controlled redirect landing at %s", (url) => {
    expect(isAccessRestrictedLanding(url)).toBe(true);
  });

  it.each([
    "https://docs.example.com/login",
    "https://docs.example.com/guides/sign-in",
    "https://docs.example.com/source?redirect=%2Fother",
  ])("does not misclassify a public source URL at %s", (url) => {
    expect(isAccessRestrictedLanding(url)).toBe(false);
  });

  it.each([
    "0.1.2.3",
    "10.2.3.4",
    "100.64.0.1",
    "127.0.0.1",
    "169.254.169.254",
    "172.20.1.1",
    "192.0.2.1",
    "192.168.1.1",
    "198.18.0.1",
    "198.51.100.1",
    "203.0.113.1",
    "224.0.0.1",
    "240.0.0.1",
    "::1",
    "::ffff:127.0.0.1",
    "::ffff:7f00:1",
    "64:ff9b::7f00:1",
    "100:0:0:1::1",
    "2001:db8::1",
    "2002:7f00:1::",
    "3fff::1",
    "5f00::1",
    "fd00::1",
    "fe80::1",
    "ff00::1",
  ])("blocks non-public or non-global address %s", (address) => {
    expect(isBlockedAddress(address)).toBe(true);
  });

  it("allows globally reachable IPv4 and IPv6 controls", () => {
    expect(isBlockedAddress("93.184.216.34")).toBe(false);
    expect(isBlockedAddress("2606:4700:4700::1111")).toBe(false);
  });

  it("rejects hostnames when any DNS result is non-public", async () => {
    const resolve = vi.fn().mockResolvedValue([
      { address: "93.184.216.34", family: 4 },
      { address: "127.0.0.1", family: 4 },
    ]);
    await expect(assertPublicHttpUrl("https://example.com/source", resolve)).rejects.toThrow("non-public");
  });

  it("pins the validated address set to the native request lookup", async () => {
    const resolve = vi.fn()
      .mockResolvedValueOnce([{ address: "93.184.216.34", family: 4 }])
      .mockResolvedValueOnce([{ address: "127.0.0.1", family: 4 }]);
    const httpsRequest = nodeRequestWithPeer();

    const result = await safeFetch("https://example.com/source", {}, { lookup: resolve, httpsRequest });

    expect(result.response.status).toBe(200);
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(httpsRequest).toHaveBeenCalledWith(
      new URL("https://example.com/source"),
      expect.objectContaining({ agent: false, lookup: expect.any(Function) }),
      expect.any(Function),
    );
  });

  it.each([
    "http://2130706433/source",
    "http://0x7f000001/source",
    "http://017700000001/source",
  ])("rejects an encoded loopback literal in %s", async (url) => {
    await expect(assertPublicHttpUrl(url)).rejects.toThrow("non-public");
  });

  it("rejects credentials and non-HTTP protocols", async () => {
    await expect(assertPublicHttpUrl("https://user:secret@example.com/source")).rejects.toThrow("credentials");
    await expect(assertPublicHttpUrl("file:///etc/passwd")).rejects.toThrow("Unsupported");
  });

  it("rejects a connection whose peer is outside the validated address set", async () => {
    const resolve = vi.fn().mockResolvedValue([{ address: "93.184.216.34", family: 4 }]);

    await expect(safeFetch("https://example.com/source", {}, {
      lookup: resolve,
      httpsRequest: nodeRequestWithPeer("127.0.0.1"),
    })).rejects.toThrow("unvalidated address");
  });

  it("validates and pins each redirect target before requesting it", async () => {
    const firstResponse = response(
      302,
      "93.184.216.34",
      new Headers({ location: "http://127.0.0.1/internal" }),
    );
    const request = vi.fn().mockResolvedValue(firstResponse);

    await expect(safeFetch("https://example.com/source", {}, {
      request,
      lookup: vi.fn().mockResolvedValue([{ address: "93.184.216.34", family: 4 }]),
    })).rejects.toThrow("non-public");
    expect(request).toHaveBeenCalledTimes(1);
    expect(firstResponse.body.cancel).toHaveBeenCalledOnce();
  });
});

describe("source health URL coverage", () => {
  it.each(["artifactUrl", "integrationUrl", "latestReleaseUrl"])("includes current field %s", (field) => {
    expect(sourceUrlFields.has(field)).toBe(true);
  });

  it("collects only admitted evidence and release URL fields", () => {
    const urls = new Set<string>();
    collectUrls({
      sourceUrl: "https://example.com/source",
      artifactUrl: "https://example.com/artifact",
      integrationUrl: "https://example.com/integration",
      latestReleaseUrl: "https://example.com/release",
      unrelatedCopy: "https://example.com/marketing",
    }, urls, new WeakSet());

    expect([...urls].sort()).toEqual([
      "https://example.com/artifact",
      "https://example.com/integration",
      "https://example.com/release",
      "https://example.com/source",
    ]);
  });
});
