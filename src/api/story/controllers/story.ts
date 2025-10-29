/**
 * story controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::story.story', ({ strapi }) => ({
  // Override the default create method to automatically set the user
  async create(ctx) {
    // Ensure user is authenticated
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in to create a story');
    }

    // Set the user from the authenticated user
    ctx.request.body.data.user = ctx.state.user.id;

    // Call the default create method
    const response = await super.create(ctx);
    return response;
  },

  // Override find method to populate user data
  async find(ctx) {
    // Add populate parameter for user
    ctx.query = {
      ...ctx.query,
      populate: {
        story: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      }
    };

    const response = await super.find(ctx);
    return response;
  },

  // Override findOne method to populate user data
  async findOne(ctx) {
    // Add populate parameter for user
    ctx.query = {
      ...ctx.query,
      populate: {
        story: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      }
    };

    const response = await super.findOne(ctx);
    return response;
  }
}));
