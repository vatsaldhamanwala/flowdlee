export const API = {
  BASE_PREFIX: '/api/v1',
  TIMEOUT_MS: 10000, // 10 seconds
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
} as const;
