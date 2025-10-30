/**
 * poll controller
 */

import { factories } from '@strapi/strapi'
import {
  validatePagination,
  createPaginationMeta,
  checkRateLimit,
  ErrorResponses,
  SuccessResponses,
  getEntityServiceOptions,
  checkOwnership,
  USER_POPULATE,
} from '../../../utils/api-helpers';

// Helper function to transform poll data
const transformPollData = (entity: any, currentUserId?: number) => {
  return {
    id: entity.id,
    question: entity.question,
    description: entity.description,
    options: entity.options,
    creator: {
      id: entity.creator?.id,
      username: entity.creator?.username || 'Unknown User',
      email: entity.creator?.email || '',
    },
    isActive: entity.isActive,
    allowMultipleVotes: entity.allowMultipleVotes,
    totalVotes: entity.totalVotes || 0,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
};

export default factories.createCoreController('api::poll.poll', ({ strapi }) => ({
  // Create Poll
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const user = ctx.state.user;
    const { question, description, options, allowMultipleVotes } = ctx.request.body.data;

    try {
      // Validate input
      if (!question || question.trim().length === 0) {
        return ctx.badRequest('Poll question is required');
      }

      if (!options || !Array.isArray(options) || options.length < 2) {
        return ctx.badRequest('Poll must have at least 2 options');
      }

      if (options.length > 10) {
        return ctx.badRequest('Poll cannot have more than 10 options');
      }

      // Validate options format
      const validOptions = options.map((option: any, index: number) => ({
        id: index + 1,
        text: typeof option === 'string' ? option : option.text,
        votes: 0,
      }));

      // Check rate limiting - max 5 polls per day per user
      const isRateLimited = await checkRateLimit(strapi, 'api::poll.poll', user.id, 5, 24);
      if (isRateLimited) {
        return ctx.tooManyRequests(ErrorResponses.RATE_LIMIT(5, 'day'));
      }

      // Create the poll
      const entity = await strapi.entityService.create('api::poll.poll', {
        data: {
          question: question.trim(),
          description: description?.trim(),
          options: validOptions,
          allowMultipleVotes: allowMultipleVotes || false,
          isActive: true,
          totalVotes: 0,
          creator: user.id,
        },
        populate: {
          creator: USER_POPULATE,
        } as any,
      });

      return {
        data: transformPollData(entity),
        meta: {
          message: SuccessResponses.CREATED('Poll')
        }
      };
    } catch (error: any) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('create poll'));
    }
  },

  // Find All Polls with Pagination
  async find(ctx) {
    try {
      const { page, pageSize, start } = validatePagination(ctx.query.page, ctx.query.pageSize);
      const { active } = ctx.query;

      let filters: any = {};
      if (active === 'true') {
        filters.isActive = true;
      }

      const [entities, total] = await Promise.all([
        strapi.entityService.findMany('api::poll.poll', {
          filters,
          populate: {
            creator: USER_POPULATE,
          } as any,
          sort: { createdAt: 'desc' },
          start,
          limit: pageSize,
        }),
        strapi.entityService.count('api::poll.poll', { filters }),
      ]);

      const currentUserId = ctx.state.user?.id;
      return {
        data: entities.map((entity: any) => transformPollData(entity, currentUserId)),
        meta: createPaginationMeta(page, pageSize, total)
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch polls'));
    }
  },

  // Find One Poll
  async findOne(ctx) {
    const { id } = ctx.params;

    try {
      const entity = await strapi.entityService.findOne('api::poll.poll', id, {
        populate: {
          creator: USER_POPULATE,
        } as any,
      });

      if (!entity) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Poll'));
      }

      const currentUserId = ctx.state.user?.id;
      return { data: transformPollData(entity, currentUserId) };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch poll'));
    }
  },

  // Update Poll
  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;
    const { question, description, isActive } = ctx.request.body.data;

    try {
      // Check ownership
      await checkOwnership(strapi, 'api::poll.poll', id, userId);

      // Update the poll (only allow updating question, description, and active status)
      const updatedEntity = await strapi.entityService.update('api::poll.poll', id, {
        data: {
          question: question?.trim(),
          description: description?.trim(),
          isActive,
        },
        populate: {
          creator: USER_POPULATE,
        } as any,
      });

      return {
        data: transformPollData(updatedEntity, userId),
        meta: {
          message: SuccessResponses.UPDATED('Poll')
        }
      };
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Poll'));
      }
      if (error.message.includes('only modify')) {
        return ctx.forbidden(ErrorResponses.FORBIDDEN);
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('update poll'));
    }
  },

  // Delete Poll
  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      // Check ownership
      await checkOwnership(strapi, 'api::poll.poll', id, userId);

      // Delete the poll
      await strapi.entityService.delete('api::poll.poll', id);

      return {
        data: {
          message: SuccessResponses.DELETED('Poll'),
          id: id,
        },
      };
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Poll'));
      }
      if (error.message.includes('only modify')) {
        return ctx.forbidden(ErrorResponses.FORBIDDEN);
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('delete poll'));
    }
  },

  // Vote on Poll
  async vote(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const { optionIds } = ctx.request.body;
    const userId = ctx.state.user.id;

    try {
      const poll: any = await strapi.entityService.findOne('api::poll.poll', id);

      if (!poll) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Poll'));
      }

      if (!poll.isActive) {
        return ctx.badRequest('This poll is no longer active');
      }

      if (!optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
        return ctx.badRequest('Please select at least one option');
      }

      if (!poll.allowMultipleVotes && optionIds.length > 1) {
        return ctx.badRequest('This poll only allows one vote per user');
      }

      // Check if user has already voted
      const existingResponse = await strapi.entityService.findMany('api::poll-response.poll-response', {
        filters: {
          poll: { id: id },
          user: { id: userId },
        },
      });

      if (existingResponse.length > 0) {
        return ctx.badRequest('You have already voted on this poll');
      }

      // Create poll response
      await strapi.entityService.create('api::poll-response.poll-response', {
        data: {
          poll: id,
          user: userId,
          selectedOptions: optionIds,
        },
      });

      // Update poll vote counts
      const updatedOptions = poll.options.map((option: any) => {
        if (optionIds.includes(option.id)) {
          return { ...option, votes: (option.votes || 0) + 1 };
        }
        return option;
      });

      const updatedPoll = await strapi.entityService.update('api::poll.poll', id, {
        data: {
          options: updatedOptions,
          totalVotes: (poll.totalVotes || 0) + 1,
        },
        populate: {
          creator: USER_POPULATE,
        } as any,
      });

      return {
        data: {
          poll: transformPollData(updatedPoll, userId),
          message: 'Vote recorded successfully'
        }
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('record vote'));
    }
  },
}));