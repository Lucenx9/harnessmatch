import { lookup } from "node:dns/promises";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { BlockList, isIP } from "node:net";

const blockedIpv4Addresses = new BlockList();
const blockedIpv6Addresses = new BlockList();

// IANA IPv4 special-purpose ranges that a source-health probe must not contact.
for (const [network, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
]) blockedIpv4Addresses.addSubnet(network, prefix, "ipv4");

// IPv6 special-purpose ranges that are non-global or encode translated/tunneled targets.
for (const [network, prefix] of [
  ["::", 96],
  ["::ffff:0:0", 96],
  ["64:ff9b::", 96],
  ["64:ff9b:1::", 48],
  ["100::", 64],
  ["100:0:0:1::", 64],
  ["2001::", 32],
  ["2001:2::", 48],
  ["2001:10::", 28],
  ["2001:db8::", 32],
  ["2002::", 16],
  ["3fff::", 20],
  ["5f00::", 16],
  ["fc00::", 7],
  ["fe80::", 10],
  ["fec0::", 10],
  ["ff00::", 8],
]) blockedIpv6Addresses.addSubnet(network, prefix, "ipv6");

const redirectStatuses = new Set([301, 302, 303, 307, 308]);

function normalizedHostname(url) {
  return url.hostname.replace(/^\[|\]$/g, "");
}

function normalizeAddresses(records) {
  return records.map(({ address }) => {
    const family = isIP(address);
    if (family === 0) throw new Error(`DNS returned an invalid address: ${address}`);
    return { address, family };
  });
}

function addressIsAllowed(address, allowedAddresses) {
  const family = isIP(address);
  if (family === 0 || isBlockedAddress(address)) return false;

  const allowList = new BlockList();
  for (const allowed of allowedAddresses) {
    if (allowed.family === family) {
      allowList.addAddress(allowed.address, family === 4 ? "ipv4" : "ipv6");
    }
  }
  return allowList.check(address, family === 4 ? "ipv4" : "ipv6");
}

function createPinnedLookup(addresses) {
  return (_hostname, options, callback) => {
    const lookupOptions = typeof options === "object" ? options : { family: options };
    const family = Number(lookupOptions?.family ?? 0);
    const candidates = family === 4 || family === 6
      ? addresses.filter((candidate) => candidate.family === family)
      : addresses;

    if (candidates.length === 0) {
      const error = new Error(`No validated address matches requested family ${family}.`);
      error.code = "ENOTFOUND";
      queueMicrotask(() => callback(error));
      return;
    }

    queueMicrotask(() => {
      if (lookupOptions?.all) callback(null, candidates);
      else callback(null, candidates[0].address, candidates[0].family);
    });
  };
}

function responseHeaders(message) {
  const headers = new Headers();
  for (let index = 0; index < message.rawHeaders.length; index += 2) {
    headers.append(message.rawHeaders[index], message.rawHeaders[index + 1]);
  }
  return headers;
}

function normalizeRequestHeaders(headers) {
  if (headers instanceof Headers) return Object.fromEntries(headers.entries());
  return headers;
}

function requestWithPinnedAddresses(url, options, addresses, dependencies = {}) {
  const requestImpl = url.protocol === "https:"
    ? dependencies.httpsRequest ?? httpsRequest
    : dependencies.httpRequest ?? httpRequest;

  return new Promise((resolve, reject) => {
    const request = requestImpl(url, {
      method: options.method,
      headers: normalizeRequestHeaders(options.headers),
      signal: options.signal,
      lookup: createPinnedLookup(addresses),
      agent: false,
    }, (message) => {
      const peerAddress = message.socket.remoteAddress ?? "";
      if (!addressIsAllowed(peerAddress, addresses)) {
        message.destroy();
        reject(new Error(`Source request connected to an unvalidated address: ${peerAddress || "unknown"}`));
        return;
      }

      const status = message.statusCode ?? 0;
      resolve({
        status,
        ok: status >= 200 && status < 300,
        headers: responseHeaders(message),
        peerAddress,
        body: {
          async cancel() {
            message.destroy();
          },
        },
      });
    });

    request.on("error", reject);
    request.end();
  });
}

export function isBlockedAddress(address) {
  const family = isIP(address);
  if (family === 4) return blockedIpv4Addresses.check(address, "ipv4");
  if (family === 6) return blockedIpv6Addresses.check(address, "ipv6");
  return true;
}

export async function resolvePublicHttpUrl(input, resolve = lookup) {
  const url = new URL(input);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`Unsupported source URL protocol: ${url.protocol}`);
  }
  if (url.username || url.password) throw new Error("Source URLs must not contain credentials.");

  const hostname = normalizedHostname(url);
  const literalFamily = isIP(hostname);
  const addresses = literalFamily
    ? [{ address: hostname, family: literalFamily }]
    : normalizeAddresses(await resolve(hostname, { all: true, verbatim: true }));

  if (addresses.length === 0 || addresses.some(({ address }) => isBlockedAddress(address))) {
    throw new Error(`Source URL resolves to a non-public address: ${hostname}`);
  }
  return { url, addresses };
}

export async function assertPublicHttpUrl(input, resolve = lookup) {
  return (await resolvePublicHttpUrl(input, resolve)).url;
}

export async function safeFetch(input, options = {}, dependencies = {}) {
  const resolve = dependencies.lookup ?? lookup;
  const request = dependencies.request
    ?? ((url, requestOptions, addresses) => requestWithPinnedAddresses(url, requestOptions, addresses, dependencies));
  let url = new URL(input);
  let redirected = false;

  for (let redirects = 0; redirects <= 5; redirects += 1) {
    const validated = await resolvePublicHttpUrl(url, resolve);
    const response = await request(validated.url, options, validated.addresses);

    if (!addressIsAllowed(response.peerAddress ?? "", validated.addresses)) {
      await response.body?.cancel();
      throw new Error(`Source request connected to an unvalidated address: ${response.peerAddress || "unknown"}`);
    }
    if (!redirectStatuses.has(response.status)) {
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
