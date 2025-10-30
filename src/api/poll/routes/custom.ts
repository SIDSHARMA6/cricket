/**
 * Custom poll routes
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/polls/:id/vote',
      handler: 'poll.vote',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
};