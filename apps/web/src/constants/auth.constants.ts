export const AUTH = {
  BEARER_PREFIX: 'Bearer ',
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  COOKIES: {
    ACCESS_TOKEN: 'flowdlee_access_token',
    REFRESH_TOKEN: 'flowdlee_refresh_token',
  },
  COOKIE_MAX_AGE: {
    ACCESS_TOKEN: 15 * 60, // 15 minutes in seconds
    REFRESH_TOKEN: 7 * 24 * 60 * 60, // 7 days in seconds
  },
} as const;
