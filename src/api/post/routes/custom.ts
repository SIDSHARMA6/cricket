/**
 * Custom post routes
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/posts/:id/like',
      handler: 'post.likePost',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
};