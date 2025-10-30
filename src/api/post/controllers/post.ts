/**
 * post controller
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

// Helper function to transform post data
const transformPostData = (entity: any, currentUserId?: number) => {
  const mediaUrls = transformMediaUrls(entity.post);
  const likedBy = entity.liked_by || [];

  return {
    id: entity.id,
    caption: entity.caption || '',
    username: entity.user?.username || 'Unknown User',
    email: entity.user?.email || '',
    mediaUrls,
    likesCount: likedBy.length,
    isLiked: isLikedByUser(likedBy, currentUserId),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
};

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  // Create Post
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const user = ctx.state.user;
    const { post, caption } = ctx.request.body.data;

    try {
      // Validate input
      validateMediaInput(post, 10, 'Post');

      // Check rate limiting - max 10 posts per hour per user
      const isRateLimited = await checkRateLimit(strapi, 'api::post.post', user.id, 10, 1);
      if (isRateLimited) {
        return ctx.tooManyRequests(ErrorResponses.RATE_LIMIT(10, 'hour'));
      }

      // Create the post entity
      const entity = await strapi.entityService.create('api::post.post', {
        data: {
          post,
          caption,
          user: user.id,
        },
        populate: {
          post: true,
          user: USER_POPULATE,
        } as any,
      });

      return {
        data: transformPostData(entity),
        meta: {
          message: SuccessResponses.CREATED('Post')
        }
      };
    } catch (error: any) {
      if (error.message.includes('must contain') || error.message.includes('cannot contain')) {
        return ctx.badRequest(ErrorResponses.VALIDATION_ERROR(error.message));
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('create post'));
    }
  },

  // Find All Posts with Pagination
  async find(ctx) {
    try {
      const { page, pageSize, start } = validatePagination(ctx.query.page, ctx.query.pageSize);

      const [entities, total] = await Promise.all([
        strapi.entityService.findMany('api::post.post', {
          ...getEntityServiceOptions({
            post: true,
            user: USER_POPULATE,
            liked_by: LIKED_BY_POPULATE,
          }),
          start,
          limit: pageSize,
        }),
        strapi.entityService.count('api::post.post'),
      ]);

      const currentUserId = ctx.state.user?.id;
      return {
        data: entities.map((entity: any) => transformPostData(entity, currentUserId)),
        meta: createPaginationMeta(page, pageSize, total)
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch posts'));
    }
  },

  // Find Posts with Filters
  async findWhere(ctx) {
    try {
      const { userId, liked, caption, limit = 10, offset = 0 } = ctx.query;
      
      let filters: any = {};
      
      if (userId) {
        filters.user = { id: userId };
      }
      
      if (liked === 'true' && ctx.state.user) {
        filters.liked_by = { id: ctx.state.user.id };
      }

      if (caption) {
        filters.caption = { $containsi: caption };
      }

      const entities = await strapi.entityService.findMany('api::post.post', {
        filters,
        ...getEntityServiceOptions({
          post: true,
          user: USER_POPULATE,
          liked_by: LIKED_BY_POPULATE,
        }),
        start: parseInt(offset as string),
        limit: parseInt(limit as string),
      });

      const currentUserId = ctx.state.user?.id;
      return {
        data: entities.map((entity: any) => transformPostData(entity, currentUserId)),
        meta: {
          filters,
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
          }
        }
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch filtered posts'));
    }
  },

  // Find One Post
  async findOne(ctx) {
    const { id } = ctx.params;

    try {
      const entity = await strapi.entityService.findOne('api::post.post', id, {
        ...getEntityServiceOptions({
          post: true,
          user: USER_POPULATE,
          liked_by: LIKED_BY_POPULATE,
        }),
      });

      if (!entity) return ctx.notFound(ErrorResponses.NOT_FOUND('Post'));

      const currentUserId = ctx.state.user?.id;
      return { data: transformPostData(entity, currentUserId) };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch post'));
    }
  },

  // Update Post
  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;
    const { post, caption } = ctx.request.body.data;

    try {
      // Validate input if post is being updated
      if (post) {
        validateMediaInput(post, 10, 'Post');
      }

      // Check ownership
      await checkOwnership(strapi, 'api::post.post', id, userId);

      // Update the post
      const updatedEntity = await strapi.entityService.update('api::post.post', id, {
        data: { post, caption },
        populate: {
          post: true,
          user: USER_POPULATE,
          liked_by: LIKED_BY_POPULATE,
        } as any,
      });

      return {
        data: transformPostData(updatedEntity, userId),
        meta: {
          message: SuccessResponses.UPDATED('Post')
        }
      };
    } catch (error: any) {
      if (error.message.includes('must contain') || error.message.includes('cannot contain')) {
        return ctx.badRequest(ErrorResponses.VALIDATION_ERROR(error.message));
      }
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Post'));
      }
      if (error.message.includes('only modify')) {
        return ctx.forbidden(ErrorResponses.FORBIDDEN);
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('update post'));
    }
  },

  // Delete Post
  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      // Check ownership
      await checkOwnership(strapi, 'api::post.post', id, userId);

      // Delete the post
      await strapi.entityService.delete('api::post.post', id);

      return {
        data: {
          message: SuccessResponses.DELETED('Post'),
          id: id,
        },
      };
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Post'));
      }
      if (error.message.includes('only modify')) {
        return ctx.forbidden(ErrorResponses.FORBIDDEN);
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('delete post'));
    }
  },

  // Like/Unlike Post
  async likePost(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      const result = await handleLikeToggle(strapi, 'api::post.post', id, userId);
      return { data: result };
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Post'));
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('like/unlike post'));
    }
  },
}));
