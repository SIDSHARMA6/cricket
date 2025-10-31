export default {
  routes: [
    {
      method: 'POST',
      path: '/polls/:id/vote',
      handler: 'api::poll.poll.vote',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
};