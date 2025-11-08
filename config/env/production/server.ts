export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL'),
  proxy: true,
  app: {
    keys: env.array('APP_KEYS'),
  },
  cron: {
    enabled: env.bool('CRON_ENABLED', true),
    tasks: require('../cron-tasks').default,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
