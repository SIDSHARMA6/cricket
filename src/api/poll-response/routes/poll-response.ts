export default {
  routes: [
    {
      method: 'GET',
      path: '/poll-responses',
      handler: 'poll-response.find',
    },
    {
      method: 'GET',
      path: '/poll-responses/:id',
      handler: 'poll-response.findOne',
    },
    {
      method: 'POST',
      path: '/poll-responses',
      handler: 'poll-response.create',
    },
    {
      method: 'PUT',
      path: '/poll-responses/:id',
      handler: 'poll-response.update',
    },
    {
      method: 'DELETE',
      path: '/poll-responses/:id',
      handler: 'poll-response.delete',
    },
  ],
};