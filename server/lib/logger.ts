/**
 * 服务端日志工具 - 在 Replit 控制台中可查看
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogContext {
  endpoint?: string;
  requestId?: string;
  duration?: number;
  [key: string]: any;
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level}] ${message}${contextStr}`;
}

export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(formatLog('INFO', message, context));
  },

  warn: (message: string, context?: LogContext) => {
    console.warn(formatLog('WARN', message, context));
  },

  error: (message: string, context?: LogContext) => {
    console.error(formatLog('ERROR', message, context));
  },

  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatLog('DEBUG', message, context));
    }
  },

  /**
   * 记录 API 请求开始
   */
  apiStart: (endpoint: string, params: any) => {
    logger.info(`API 请求开始`, {
      endpoint,
      params: process.env.NODE_ENV === 'development' ? params : undefined,
    });
  },

  /**
   * 记录 API 请求成功
   */
  apiSuccess: (endpoint: string, duration: number, resultCount?: number) => {
    logger.info(`API 请求成功`, {
      endpoint,
      duration: `${duration}ms`,
      resultCount,
    });
  },

  /**
   * 记录 API 请求失败
   */
  apiError: (endpoint: string, duration: number, error: any) => {
    logger.error(`API 请求失败`, {
      endpoint,
      duration: `${duration}ms`,
      error: error.message || error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  },
};
