export default {
  routes: [
    {
      method: 'GET',
      path: '/match-responses',
      handler: 'match-response.find',
    },
    {
      method: 'GET',
      path: '/match-responses/:id',
      handler: 'match-response.findOne',
    },
    {
      method: 'POST',
      path: '/match-responses',
      handler: 'match-response.create',
    },
    {
      method: 'PUT',
      path: '/match-responses/:id',
      handler: 'match-response.update',
    },
    {
      method: 'DELETE',
      path: '/match-responses/:id',
      handler: 'match-response.delete',
    },
  ],
};