/**
 * story service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::story.story', ({ strapi }) => ({
  // Override find method to always populate user
  async find(params: any = {}) {
    const populateParams = {
      ...params,
      populate: {
        story: true,
        user: {
          fields: ['id', 'username', 'email']
        },
        ...(params.populate || {})
      }
    };

    const results = await super.find(populateParams);
    return results;
  },

  // Override findOne method to always populate user
  async findOne(entityId: any, params: any = {}) {
    const populateParams = {
      ...params,
      populate: {
        story: true,
        user: {
          fields: ['id', 'username', 'email']
        },
        ...(params.populate || {})
      }
    };

    const result = await super.findOne(entityId, populateParams);
    return result;
  }
}));
