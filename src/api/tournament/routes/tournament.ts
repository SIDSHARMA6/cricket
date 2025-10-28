export default {
  routes: [
    {
      method: 'GET',
      path: '/tournaments',
      handler: 'tournament.find',
    },
    {
      method: 'GET',
      path: '/tournaments/:id',
      handler: 'tournament.findOne',
    },
    {
      method: 'POST',
      path: '/tournaments',
      handler: 'tournament.create',
    },
    {
      method: 'PUT',
      path: '/tournaments/:id',
      handler: 'tournament.update',
    },
    {
      method: 'DELETE',
      path: '/tournaments/:id',
      handler: 'tournament.delete',
    },
  ],
};