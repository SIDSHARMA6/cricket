/**
 * Production-ready logging utility
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogContext {
  userId?: number;
  action?: string;
  resource?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const formattedMessage = this.formatMessage(LogLevel.ERROR, message, context);
    console.error(formattedMessage);
    if (error) {
      console.error('Error stack:', error.stack);
    }
  }

  warn(message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(LogLevel.WARN, message, context);
    console.warn(formattedMessage);
  }

  info(message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(LogLevel.INFO, message, context);
    console.info(formattedMessage);
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, context);
      console.debug(formattedMessage);
    }
  }
}

export const logger = new Logger();
