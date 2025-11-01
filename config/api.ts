export default ({ env }) => ({
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
  // Rate limiting configuration
  rateLimit: {
    enabled: env.bool('RATE_LIMIT_ENABLED', true),
    interval: env.int('RATE_LIMIT_INTERVAL', 60000), // 1 minute
    max: env.int('RATE_LIMIT_MAX', 100), // 100 requests per minute
  },
});
