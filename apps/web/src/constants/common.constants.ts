export const COMMON = {
  APP_NAME: 'Flowdlee',
  DEFAULT_TIMEZONE: 'UTC',
  POMODORO: {
    DEFAULT_FOCUS_TIME_MINS: 25,
    DEFAULT_BREAK_TIME_MINS: 5,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
  MAX_UPLOAD_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  THEME: {
    DEFAULT: 'system',
    DARK: 'dark',
    LIGHT: 'light',
  },
} as const;
