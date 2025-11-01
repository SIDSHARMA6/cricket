/**
 * Security middleware for production
 */

import { logger } from '../utils/logger';

export default (config, { strapi }) => {
  return async (ctx, next) => {
    const startTime = Date.now();
    
    try {
      // Log incoming request
      logger.debug('Incoming request', {
        method: ctx.method,
        path: ctx.path,
        userId: ctx.state.user?.id,
        ip: ctx.request.ip,
      });

      // Add security headers
      ctx.set('X-Content-Type-Options', 'nosniff');
      ctx.set('X-Frame-Options', 'DENY');
      ctx.set('X-XSS-Protection', '1; mode=block');
      ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      // Remove sensitive headers
      ctx.remove('X-Powered-By');

      await next();

      // Log response
      const duration = Date.now() - startTime;
      logger.info('Request completed', {
        method: ctx.method,
        path: ctx.path,
        status: ctx.status,
        duration: `${duration}ms`,
        userId: ctx.state.user?.id,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error('Request failed', error as Error, {
        method: ctx.method,
        path: ctx.path,
        duration: `${duration}ms`,
        userId: ctx.state.user?.id,
      });
      
      throw error;
    }
  };
};
