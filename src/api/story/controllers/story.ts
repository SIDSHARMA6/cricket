/**
 * story controller
 */

import { factories } from '@strapi/strapi'
import {
  transformMediaUrls,
  isLikedByUser,
  validatePagination,
  createPaginationMeta,
  validateMediaInput,
  checkRateLimit,
  ErrorResponses,
  SuccessResponses,
  getEntityServiceOptions,
  handleLikeToggle,
  checkOwnership,
  USER_POPULATE,
  LIKED_BY_POPULATE,
} from '../../../utils/api-helpers';

// Helper function to transform story data to minimal format
const transformStoryData = (entity: any, currentUserId?: number) => {
  const mediaUrls = transformMediaUrls(entity.story);
  const likedBy = entity.liked_by || [];

  // Calculate time remaining until expiration
  const now = new Date();
  const expiresAt = new Date(entity.expiresAt);
  const timeRemaining = Math.max(0, expiresAt.getTime() - now.getTime());
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return {
    id: entity.id,
    username: entity.user?.username || 'Unknown User',
    email: entity.user?.email || '',
    mediaUrls,
    likesCount: likedBy.length,
    isLiked: isLikedByUser(likedBy, currentUserId),
    expiresAt: entity.expiresAt,
    isExpired: entity.isExpired || now > expiresAt,
    timeRemaining: {
      hours: hoursRemaining,
      minutes: minutesRemaining,
      totalMs: timeRemaining
    },
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
};

export default factories.createCoreController('api::story.story', ({ strapi }) => ({
  // Create Story
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const user = ctx.state.user;
    const { story } = ctx.request.body.data;

    try {
      // Validate input
      validateMediaInput(story, 10, 'Story');

      // Check rate limiting - max 5 stories per hour per user
      const isRateLimited = await checkRateLimit(strapi, 'api::story.story' as any, user.id, 5, 1);
      if (isRateLimited) {
        return ctx.tooManyRequests(ErrorResponses.RATE_LIMIT(5, 'hour'));
      }

      // Set expiration time to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Create the story entity
      const entity = await strapi.entityService.create('api::story.story', {
        data: {
          story,
          user: user.id,
          expiresAt,
          isExpired: false,
        },
        populate: {
          story: true,
          user: USER_POPULATE,
        } as any,
      });

      return {
        data: transformStoryData(entity),
        meta: {
          message: SuccessResponses.CREATED('Story')
        }
      };
    } catch (error: any) {
      if (error.message.includes('must contain') || error.message.includes('cannot contain')) {
        return ctx.badRequest(ErrorResponses.VALIDATION_ERROR(error.message));
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('create story'));
    }
  },

  // Find All Stories with Pagination (only non-expired)
  async find(ctx) {
    try {
      const { page, pageSize, start } = validatePagination(ctx.query.page, ctx.query.pageSize);
      const { includeExpired = 'false' } = ctx.query;

      // Filter to exclude expired stories unless explicitly requested
      const filters: any = {};
      if (includeExpired !== 'true') {
        const now = new Date();
        filters.$and = [
          {
            $or: [
              { isExpired: { $ne: true } },
              { isExpired: { $null: true } }
            ]
          },
          {
            expiresAt: { $gt: now }
          }
        ];
      }

      const [entities, total] = await Promise.all([
        strapi.entityService.findMany('api::story.story', {
          filters,
          ...getEntityServiceOptions({
            story: true,
            user: USER_POPULATE,
            liked_by: LIKED_BY_POPULATE,
          }),
          start,
          limit: pageSize,
          sort: { createdAt: 'desc' },
        }),
        strapi.entityService.count('api::story.story', { filters }),
      ]);

      const currentUserId = ctx.state.user?.id;
      return {
        data: entities.map((entity: any) => transformStoryData(entity, currentUserId)),
        meta: createPaginationMeta(page, pageSize, total)
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch stories'));
    }
  },

  // Find Stories with Filters (WHERE conditions)
  async findWhere(ctx) {
    try {
      const { userId, liked, limit = 10, offset = 0 } = ctx.query;

      let filters: any = {};

      // Filter by user ID
      if (userId) {
        filters.user = { id: userId };
      }

      // Filter by liked stories (stories liked by current user)
      if (liked === 'true' && ctx.state.user) {
        filters.liked_by = { id: ctx.state.user.id };
      }

      const entities = await strapi.entityService.findMany('api::story.story', {
        filters,
        populate: {
          story: true,
          user: {
            fields: ['username', 'email'],
          },
          liked_by: {
            fields: ['id'],
          },
        },
        sort: { createdAt: 'desc' },
        start: parseInt(offset as string),
        limit: parseInt(limit as string),
      });

      const currentUserId = ctx.state.user?.id;
      return {
        data: entities.map((entity: any) => transformStoryData(entity, currentUserId)),
        meta: {
          filters: filters,
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
          }
        }
      };
    } catch (error) {
      ctx.throw(500, 'Failed to fetch filtered stories');
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
          liked_by: {
            fields: ['id'],
          },
        },
      });

      if (!entity) return ctx.notFound('Story not found');

      const currentUserId = ctx.state.user?.id;
      return { data: transformStoryData(entity, currentUserId) };
    } catch (error) {
      ctx.throw(500, 'Failed to fetch story');
    }
  },

  // Like/Unlike Story
  async likeStory(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      const result = await handleLikeToggle(strapi, 'api::story.story' as any, id, userId);
      return { data: result };
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Story'));
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('like/unlike story'));
    }
  },

  // Update Story (Edit)
  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;
    const { story } = ctx.request.body.data;

    try {
      // Validate input if story is being updated
      if (story) {
        validateMediaInput(story, 10, 'Story');
      }

      // Check ownership
      await checkOwnership(strapi, 'api::story.story' as any, id, userId);

      // Update the story
      const updatedEntity = await strapi.entityService.update('api::story.story', id, {
        data: { story },
        populate: {
          story: true,
          user: USER_POPULATE,
          liked_by: LIKED_BY_POPULATE,
        } as any,
      });

      return {
        data: transformStoryData(updatedEntity, userId),
        meta: {
          message: SuccessResponses.UPDATED('Story')
        }
      };
    } catch (error: any) {
      if (error.message.includes('must contain') || error.message.includes('cannot contain')) {
        return ctx.badRequest(ErrorResponses.VALIDATION_ERROR(error.message));
      }
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Story'));
      }
      if (error.message.includes('only modify')) {
        return ctx.forbidden(ErrorResponses.FORBIDDEN);
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('update story'));
    }
  },

  // Delete Story
  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      console.log('🧹 Delete request received for ID:', id);

      // Check ownership
      await checkOwnership(strapi, 'api::story.story' as any, id, userId);

      // Delete the story
      await strapi.entityService.delete('api::story.story', id);

      console.log('✅ Story deleted successfully:', id);

      return {
        data: {
          message: SuccessResponses.DELETED('Story'),
          id: id,
        },
      };
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Story'));
      }
      if (error.message.includes('only modify')) {
        return ctx.forbidden(ErrorResponses.FORBIDDEN);
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('delete story'));
    }
  },

  // Get Active Stories (non-expired only)
  async findActive(ctx) {
    try {
      const { page, pageSize, start } = validatePagination(ctx.query.page, ctx.query.pageSize);
      const now = new Date();

      const filters = {
        $and: [
          {
            $or: [
              { isExpired: { $ne: true } },
              { isExpired: { $null: true } }
            ]
          },
          {
            expiresAt: { $gt: now }
          }
        ]
      };

      const [entities, total] = await Promise.all([
        strapi.entityService.findMany('api::story.story', {
          filters,
          ...getEntityServiceOptions({
            story: true,
            user: USER_POPULATE,
            liked_by: LIKED_BY_POPULATE,
          }),
          start,
          limit: pageSize,
          sort: { createdAt: 'desc' },
        }),
        strapi.entityService.count('api::story.story', { filters }),
      ]);

      const currentUserId = ctx.state.user?.id;
      return {
        data: entities.map((entity: any) => transformStoryData(entity, currentUserId)),
        meta: {
          ...createPaginationMeta(page, pageSize, total),
          message: 'Active stories only (expires within 24 hours)'
        }
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch active stories'));
    }
  },

  // Clean up expired stories (admin only or cron job)
  async cleanupExpired(ctx) {
    try {
      const now = new Date();
      
      // Find expired stories
      const expiredStories = await strapi.entityService.findMany('api::story.story', {
        filters: {
          $or: [
            { expiresAt: { $lt: now } },
            { isExpired: true }
          ]
        },
        fields: ['id'],
      });

      // Delete expired stories
      const deletedIds = [];
      for (const story of expiredStories) {
        try {
          await strapi.entityService.delete('api::story.story', story.id);
          deletedIds.push(story.id);
        } catch (error) {
          console.error(`Failed to delete expired story ${story.id}:`, error);
        }
      }

      console.log(`🧹 Cleaned up ${deletedIds.length} expired stories`);

      return {
        data: {
          message: `${deletedIds.length} expired stories cleaned up`,
          deletedIds,
          cleanupTime: now.toISOString(),
        },
      };
    } catch (error) {
      console.error('❌ Cleanup error:', error);
      ctx.throw(500, 'Failed to cleanup expired stories');
    }
  },

  // Bulk Delete Stories
  async bulkDelete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in to delete stories');
    }

    const { ids } = ctx.request.body;
    const userId = ctx.state.user.id;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return ctx.badRequest('Please provide an array of story IDs to delete');
    }

    if (ids.length > 20) {
      return ctx.badRequest('Cannot delete more than 20 stories at once');
    }

    try {
      console.log('🧹 Bulk delete request received for IDs:', ids);

      // Find all stories to check ownership
      const stories = await strapi.entityService.findMany('api::story.story', {
        filters: {
          id: { $in: ids },
        },
        populate: {
          user: {
            fields: ['id'],
          },
        },
      });

      // Check if all stories belong to the current user
      const unauthorizedStories = stories.filter((story: any) => story.user.id !== userId);
      if (unauthorizedStories.length > 0) {
        return ctx.forbidden('You can only delete your own stories');
      }

      // Delete all stories
      const deletedIds = [];
      for (const id of ids) {
        try {
          await strapi.entityService.delete('api::story.story', id);
          deletedIds.push(id);
        } catch (error) {
          console.error(`Failed to delete story ${id}:`, error);
        }
      }

      console.log('✅ Stories deleted successfully:', deletedIds);

      return {
        data: {
          message: `${deletedIds.length} stories deleted successfully`,
          deletedIds,
          failedIds: ids.filter((id: any) => !deletedIds.includes(id)),
        },
      };
    } catch (error) {
      console.error('❌ Bulk delete error:', error);
      ctx.throw(500, 'Failed to delete stories');
    }
  },
}));
