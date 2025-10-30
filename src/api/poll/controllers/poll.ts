/**
 * poll controller - WhatsApp-like poll system
 */

import { factories } from '@strapi/strapi'

// Helper function to calculate vote counts and percentages
const calculatePollStats = (poll: any, currentUserId?: number) => {
  const votes = poll.votes || [];
  const totalVotes = votes.length;

  const optionStats = poll.options.map((option: any, index: number) => {
    const optionVotes = votes.filter((vote: any) => vote.optionIndex === index).length;
    const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;

    return {
      ...option,
      votes: optionVotes,
      percentage
    };
  });

  const userVote = currentUserId ? votes.find((vote: any) => vote.userId === currentUserId) : null;

  return {
    ...poll,
    options: optionStats,
    totalVotes,
    hasVoted: !!userVote,
    userVote: userVote?.optionIndex
  };
};

export default factories.createCoreController('api::poll.poll', ({ strapi }) => ({
  // Create Poll (WhatsApp style)
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const { question, options } = ctx.request.body.data;

    try {
      // Validation
      if (!question || question.trim().length === 0) {
        return ctx.badRequest('Poll question is required');
      }

      if (!options || !Array.isArray(options) || options.length < 2) {
        return ctx.badRequest('Poll must have at least 2 options');
      }

      if (options.length > 12) {
        return ctx.badRequest('Poll cannot have more than 12 options');
      }

      // Format options as simple JSON array
      const formattedOptions = options.map((option: any, index: number) => ({
        id: index,
        text: typeof option === 'string' ? option.trim() : option.text?.trim(),
        voteCount: 0
      }));

      // Create the poll
      const entity = await strapi.entityService.create('api::poll.poll', {
        data: {
          question: question.trim(),
          options: formattedOptions,
          allowMultipleVotes: false, // WhatsApp polls don't allow multiple votes
          isActive: true,
          votes: []
        },
        populate: ['createdBy']
      } as any);

      return {
        data: calculatePollStats(entity, ctx.state.user.id)
      };
    } catch (error) {
      console.error('Poll creation error:', error);
      return ctx.internalServerError('Failed to create poll');
    }
  },

  // Get All Polls with vote stats
  async find(ctx) {
    try {
      const currentUserId = ctx.state.user?.id;

      const polls = await strapi.entityService.findMany('api::poll.poll', {
        populate: ['createdBy'],
        sort: { createdAt: 'desc' }
      } as any);

      // Calculate stats for each poll
      const pollsWithStats = polls.map((poll: any) => calculatePollStats(poll, currentUserId));

      return { data: pollsWithStats };
    } catch (error) {
      console.error('Poll fetch error:', error);
      return ctx.internalServerError('Failed to fetch polls');
    }
  },

  // Get Single Poll with detailed stats
  async findOne(ctx) {
    const { id } = ctx.params;
    const currentUserId = ctx.state.user?.id;

    try {
      const poll = await strapi.entityService.findOne('api::poll.poll', id, {
        populate: ['createdBy']
      } as any);

      if (!poll) {
        return ctx.notFound('Poll not found');
      }

      const pollWithStats = calculatePollStats(poll, currentUserId);

      return {
        data: {
          ...pollWithStats,
          voters: ((poll as any).votes || []).map((vote: any) => ({
            userId: vote.userId,
            username: vote.username,
            selectedOption: vote.optionIndex
          }))
        }
      };
    } catch (error) {
      console.error('Poll findOne error:', error);
      return ctx.internalServerError('Failed to fetch poll');
    }
  },

  // Vote on Poll (WhatsApp style)
  async vote(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const { id } = ctx.params;
    const { optionIndex } = ctx.request.body;
    const userId = ctx.state.user.id;
    const username = ctx.state.user.username;

    try {
      // Get poll
      const poll: any = await strapi.entityService.findOne('api::poll.poll', id, {
        populate: ['createdBy']
      });

      if (!poll) {
        return ctx.notFound('Poll not found');
      }

      if (!poll.isActive) {
        return ctx.badRequest('This poll is no longer active');
      }

      // Validate option index
      if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= poll.options.length) {
        return ctx.badRequest('Invalid option selected');
      }

      const votes = poll.votes || [];
      const existingVoteIndex = votes.findIndex((vote: any) => vote.userId === userId);

      let updatedVotes;
      let message;

      if (existingVoteIndex !== -1) {
        // Update existing vote (WhatsApp allows changing vote)
        updatedVotes = [...votes];
        updatedVotes[existingVoteIndex] = {
          userId,
          username,
          optionIndex,
          votedAt: new Date().toISOString()
        };
        message = 'Vote updated successfully';
      } else {
        // Add new vote
        updatedVotes = [...votes, {
          userId,
          username,
          optionIndex,
          votedAt: new Date().toISOString()
        }];
        message = 'Vote recorded successfully';
      }

      // Update the poll with new votes
      const updatedPoll = await strapi.entityService.update('api::poll.poll', id, {
        data: {
          votes: updatedVotes
        },
        populate: ['createdBy']
      } as any);

      const pollWithStats = calculatePollStats(updatedPoll, userId);

      return {
        data: {
          ...pollWithStats,
          message
        }
      };
    } catch (error) {
      console.error('Vote error:', error);
      return ctx.internalServerError('Failed to record vote');
    }
  },

  // Update Poll (only question and active status)
  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const { id } = ctx.params;
    const { question, isActive } = ctx.request.body.data;

    try {
      const existingPoll: any = await strapi.entityService.findOne('api::poll.poll', id, {
        populate: ['createdBy']
      });

      if (!existingPoll) {
        return ctx.notFound('Poll not found');
      }

      if (existingPoll.createdBy?.id !== ctx.state.user.id) {
        return ctx.forbidden('You can only update your own polls');
      }

      const updatedEntity = await strapi.entityService.update('api::poll.poll', id, {
        data: {
          question: question?.trim(),
          isActive,
        },
        populate: ['createdBy']
      } as any);

      return { data: calculatePollStats(updatedEntity, ctx.state.user.id) };
    } catch (error) {
      console.error('Poll update error:', error);
      return ctx.internalServerError('Failed to update poll');
    }
  },

  // Delete Poll
  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const { id } = ctx.params;

    try {
      const existingPoll: any = await strapi.entityService.findOne('api::poll.poll', id, {
        populate: ['createdBy']
      });

      if (!existingPoll) {
        return ctx.notFound('Poll not found');
      }

      if (existingPoll.createdBy?.id !== ctx.state.user.id) {
        return ctx.forbidden('You can only delete your own polls');
      }

      // Delete the poll
      await strapi.entityService.delete('api::poll.poll', id);

      return { data: { message: 'Poll deleted successfully' } };
    } catch (error) {
      console.error('Poll delete error:', error);
      return ctx.internalServerError('Failed to delete poll');
    }
  }
}));