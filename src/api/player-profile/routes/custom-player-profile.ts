/**
 * Custom player-profile routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/player-profiles/user/:userId',
      handler: 'player-profile.findByUser',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/player-profiles/search',
      handler: 'player-profile.search',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};