/**
 * Custom story routes for expiration functionality
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/stories/active',
      handler: 'story.findActive',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/stories/where',
      handler: 'story.findWhere',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/stories/:id/like',
      handler: 'story.likeStory',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/stories/bulk-delete',
      handler: 'story.bulkDelete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/stories/cleanup-expired',
      handler: 'story.cleanupExpired',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};