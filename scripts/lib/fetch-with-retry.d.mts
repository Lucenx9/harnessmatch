export type FetchWithRetryOptions = {
  label: string;
  timeoutMs: number;
  retryDelayMs: number;
  maximumAttempts?: number;
  fetchImplementation?: typeof fetch;
  sleep?: (delayMs: number) => Promise<void>;
};

export declare function fetchResponseWithRetry(
  url: string | URL,
  init: RequestInit,
  options: FetchWithRetryOptions,
): Promise<Response>;

export declare function fetchJsonWithRetry(
  url: string | URL,
  init: RequestInit,
  options: FetchWithRetryOptions,
): Promise<unknown>;
