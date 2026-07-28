import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";

const blockedAddresses = new BlockList();

for (const [network, prefix] of [
  ["0.0.0.0", 8], ["10.0.0.0", 8], ["100.64.0.0", 10], ["127.0.0.0", 8],
  ["169.254.0.0", 16], ["172.16.0.0", 12], ["192.0.0.0", 24], ["192.168.0.0", 16],
  ["198.18.0.0", 15], ["224.0.0.0", 4],
]) blockedAddresses.addSubnet(network, prefix, "ipv4");

for (const [network, prefix] of [
  ["::", 128], ["::1", 128], ["fc00::", 7], ["fe80::", 10], ["ff00::", 8],
]) blockedAddresses.addSubnet(network, prefix, "ipv6");

export function isBlockedAddress(address) {
  const family = isIP(address);
  if (family === 4) return blockedAddresses.check(address, "ipv4");
  if (family === 6) {
    const mapped = address.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i)?.[1];
    return mapped ? isBlockedAddress(mapped) : blockedAddresses.check(address, "ipv6");
  }
  return true;
}

export async function assertPublicHttpUrl(input, resolve = lookup) {
  const url = new URL(input);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error(`Unsupported source URL protocol: ${url.protocol}`);
  if (url.username || url.password) throw new Error("Source URLs must not contain credentials.");

  const addresses = isIP(url.hostname)
    ? [{ address: url.hostname }]
    : await resolve(url.hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some(({ address }) => isBlockedAddress(address))) {
    throw new Error(`Source URL resolves to a non-public address: ${url.hostname}`);
  }
  return url;
}

export async function safeFetch(input, options, dependencies = {}) {
  const fetchImpl = dependencies.fetch ?? fetch;
  const resolve = dependencies.lookup ?? lookup;
  let url = new URL(input);
  let redirected = false;

  for (let redirects = 0; redirects <= 5; redirects += 1) {
    await assertPublicHttpUrl(url, resolve);
    const response = await fetchImpl(url, { ...options, redirect: "manual" });
    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return { response, finalUrl: url.href, redirected };
    }

    const location = response.headers.get("location");
    await response.body?.cancel();
    if (!location) return { response, finalUrl: url.href, redirected };
    if (redirects === 5) throw new Error("Source URL exceeded the redirect limit.");
    url = new URL(location, url);
    redirected = true;
  }
  throw new Error("Source URL exceeded the redirect limit.");
}
