/**
 * Custom chat routes
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/chats/:id/reaction',
      handler: 'chat.addReaction',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
