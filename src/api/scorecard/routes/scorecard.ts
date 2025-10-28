export default {
  routes: [
    {
      method: 'GET',
      path: '/scorecards',
      handler: 'scorecard.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/scorecards/:id',
      handler: 'scorecard.findOne',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/scorecards',
      handler: 'scorecard.create',
    },
    {
      method: 'PUT',
      path: '/scorecards/:id',
      handler: 'scorecard.update',
    },
    {
      method: 'DELETE',
      path: '/scorecards/:id',
      handler: 'scorecard.delete',
    },
  ],
};