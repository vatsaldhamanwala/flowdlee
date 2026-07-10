type logLevel = 'info' | 'warn' | 'error' | 'debug';

const formatLog = (level: logLevel, message: string, context?: unknown) => {
  const timpstamp = new Date().toISOString();

  const contextString = context ? `| Context: ${JSON.stringify(context)}` : '';

  return `[${timpstamp}] [${level.toUpperCase()}]: ${message}${contextString}`;
};

export const logger = {
  info: (message: string, context?: unknown) => {
    console.log(`\x1b[32m${formatLog('info', message, context)}\x1b[0m`); // Green text
  },

  warn: (message: string, context?: unknown) => {
    console.warn(`\x1b[33m${formatLog('warn', message, context)}\x1b[0m`); // Yellow text
  },

  error: (message: string, error?: unknown) => {
    console.error(`\x1b[31m${formatLog('error', message, error)}\x1b[0m`); // Red text
  },

  debug: (message: string, context?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\x1b[36m${formatLog('debug', message, context)}\x1b[0m`); // Cyan text
    }
  },
};
