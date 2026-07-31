const retryableHttpStatuses = new Set([408, 429, 500, 502, 503, 504]);

class NonRetryableHttpError extends Error {}

function defaultSleep(delayMs) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, delayMs));
}

async function fetchWithRetry(
  url,
  init,
  readResponse,
  {
    label,
    timeoutMs,
    retryDelayMs,
    maximumAttempts = 3,
    fetchImplementation = fetch,
    sleep = defaultSleep,
  },
) {
  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      const response = await fetchImplementation(url, {
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (response.ok) return await readResponse(response);

      const body = await response.text();
      const message = `${label}: HTTP ${response.status} ${body.slice(0, 300)}`;
      if (!retryableHttpStatuses.has(response.status) || attempt === maximumAttempts) {
        throw new NonRetryableHttpError(message);
      }
    } catch (error) {
      if (error instanceof NonRetryableHttpError) throw error;
      if (attempt === maximumAttempts) {
        throw new Error(`${label}: request failed after ${attempt} attempts`, {
          cause: error,
        });
      }
    }

    await sleep(attempt * retryDelayMs);
  }

  throw new Error(`${label}: retry budget exhausted`);
}

export function fetchResponseWithRetry(url, init, options) {
  return fetchWithRetry(url, init, (response) => response, options);
}

export function fetchJsonWithRetry(url, init, options) {
  return fetchWithRetry(url, init, (response) => response.json(), options);
}
