export default {
  routes: [
    {
      method: 'POST',
      path: '/groups/:id/join',
      handler: 'group.join',
      config: {
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/groups/:id/leave',
      handler: 'group.leave',
      config: {
        policies: [],
        middlewares: []
      }
    }
  ]
};
