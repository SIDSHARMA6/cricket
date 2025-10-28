export default {
  routes: [
    {
      method: 'GET',
      path: '/polls',
      handler: 'poll.find',
    },
    {
      method: 'GET',
      path: '/polls/:id',
      handler: 'poll.findOne',
    },
    {
      method: 'POST',
      path: '/polls',
      handler: 'poll.create',
    },
    {
      method: 'PUT',
      path: '/polls/:id',
      handler: 'poll.update',
    },
    {
      method: 'DELETE',
      path: '/polls/:id',
      handler: 'poll.delete',
    },
  ],
};