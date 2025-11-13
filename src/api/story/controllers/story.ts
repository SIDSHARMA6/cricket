/**
 * story controller - Simplified version
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::story.story', ({ strapi }) => ({
  // Create Story - Auto-set expiration to 24 hours
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in');
    }

    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    ctx.request.body.data.user = ctx.state.user.id;
    ctx.request.body.data.expiresAt = expiresAt;
    ctx.request.body.data.isExpired = false;

    return super.create(ctx);
  },

  // Find - Only return non-expired stories
  async find(ctx) {
    const now = new Date();
    
    // Add filter for non-expired stories
    ctx.query.filters = {
      ...ctx.query.filters,
      isExpired: false,
      expiresAt: { $gt: now.toISOString() }
    };

    return super.find(ctx);
  },

  // Update - Only owner can update
  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { id } = ctx.params;
    const story = await strapi.entityService.findOne('api::story.story', id, {
      populate: { user: { fields: ['id'] } }
    });

    if (!story) {
      return ctx.notFound('Story not found');
    }

    if (story.user.id !== ctx.state.user.id) {
      return ctx.forbidden('You can only update your own stories');
    }

    return super.update(ctx);
  },

  // Delete - Only owner can delete
  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { id } = ctx.params;
    const story = await strapi.entityService.findOne('api::story.story', id, {
      populate: { user: { fields: ['id'] } }
    });

    if (!story) {
      return ctx.notFound('Story not found');
    }

    if (story.user.id !== ctx.state.user.id) {
      return ctx.forbidden('You can only delete your own stories');
    }

    return super.delete(ctx);
  },
}));
