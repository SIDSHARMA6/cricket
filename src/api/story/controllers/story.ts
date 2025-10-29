/**
 * story controller
 */

import { factories } from '@strapi/strapi'

// Helper function to transform story data to minimal format
const transformStoryData = (entity: any) => {
  const mediaUrls =
    entity.story?.map((media: any) => ({
      url: `https://cricket-d5rd.onrender.com${media.url}`,
      name: media.name,
      mime: media.mime,
    })) || [];

  return {
    id: entity.id,
    username: entity.user?.username || 'Unknown User',
    email: entity.user?.email || '',
    mediaUrls,
    createdAt: entity.createdAt,
  };
};

export default factories.createCoreController('api::story.story', ({ strapi }) => ({
  // Create Story
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in to create a story');
    }

    const user = ctx.state.user;

    const { story } = ctx.request.body.data;

    // Create the story entity directly
    const entity = await strapi.entityService.create('api::story.story', {
      data: {
        story,
        user: user.id,
      },
      populate: {
        story: true,
        user: {
          fields: ['username', 'email'],
        },
      },
    });

    return { data: transformStoryData(entity) };
  },

  // Find All Stories
  async find(ctx) {
    try {
      const entities = await strapi.entityService.findMany('api::story.story', {
        populate: {
          story: true,
          user: {
            fields: ['username', 'email'],
          },
        },
        sort: { createdAt: 'desc' },
      });

      return { data: entities.map(transformStoryData) };
    } catch (error) {
      ctx.throw(500, 'Failed to fetch stories');
    }
  },

  // Find One Story
  async findOne(ctx) {
    const { id } = ctx.params;

    try {
      const entity = await strapi.entityService.findOne('api::story.story', id, {
        populate: {
          story: true,
          user: {
            fields: ['username', 'email'],
          },
        },
      });

      if (!entity) return ctx.notFound('Story not found');

      return { data: transformStoryData(entity) };
    } catch (error) {
      ctx.throw(500, 'Failed to fetch story');
    }
  },
}));
