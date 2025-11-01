/**
 * story router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::story.story', {
  config: {
    find: {
      middlewares: [],
    },
    findOne: {
      middlewares: [],
    },
    create: {
      middlewares: [],
    },
    update: {
      middlewares: [],
    },
    delete: {
      middlewares: [],
    },
  },
});
