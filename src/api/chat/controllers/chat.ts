/**
 * chat controller
 */

import { factories } from '@strapi/strapi'
import {
  transformMediaUrls,
  validatePagination,
  createPaginationMeta,
  ErrorResponses,
  SuccessResponses,
  USER_POPULATE,
} from '../../../utils/api-helpers';

// Helper function to transform chat data
const transformChatData = (entity: any) => {
  const attachmentUrls = transformMediaUrls(entity.attachments);

  return {
    id: entity.id,
    message: entity.message,
    messageType: entity.messageType,
    sender: {
      id: entity.sender?.id,
      username: entity.sender?.username || 'Unknown User',
      email: entity.sender?.email || '',
    },
    attachmentUrls,
    replyTo: entity.replyTo ? {
      id: entity.replyTo.id,
      message: entity.replyTo.message,
      sender: entity.replyTo.sender?.username || 'Unknown User',
    } : null,
    reactions: entity.reactions || {},
    mentions: entity.mentions?.map((user: any) => ({
      id: user.id,
      username: user.username,
    })) || [],
    isEdited: entity.isEdited,
    editedAt: entity.editedAt,
    isDeleted: entity.isDeleted,
    deletedAt: entity.deletedAt,
    tags: entity.tags || [],
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
};

export default factories.createCoreController('api::chat.chat', ({ strapi }) => ({
  // Create Chat Message
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const user = ctx.state.user;
    const { message, messageType, attachments, replyTo, mentions, tags } = ctx.request.body?.data || {};

    try {
      // Validate message
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return ctx.badRequest('Message cannot be empty');
      }

      if (message.length > 2000) {
        return ctx.badRequest('Message cannot exceed 2000 characters');
      }

      // Validate messageType
      const validMessageTypes = ['text', 'image', 'video', 'audio', 'file', 'match_invite', 'celebration'];
      if (messageType && !validMessageTypes.includes(messageType)) {
        return ctx.badRequest('Invalid message type');
      }

      // Validate attachments array
      if (attachments && !Array.isArray(attachments)) {
        return ctx.badRequest('Attachments must be an array');
      }

      // Validate mentions array
      if (mentions && !Array.isArray(mentions)) {
        return ctx.badRequest('Mentions must be an array');
      }

      // Validate tags array
      if (tags && !Array.isArray(tags)) {
        return ctx.badRequest('Tags must be an array');
      }

      // Check rate limiting - max 50 messages per hour per user
      const timeAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
      const recentMessages = await strapi.entityService.findMany('api::chat.chat', {
        filters: {
          sender: { id: user.id },
          createdAt: { $gte: timeAgo },
        },
      });
      
      if (recentMessages.length >= 50) {
        return ctx.tooManyRequests(ErrorResponses.RATE_LIMIT(50, 'hour'));
      }

      // Create the chat message
      const entity = await strapi.entityService.create('api::chat.chat', {
        data: {
          message: message.trim(),
          messageType: messageType || 'text',
          attachments,
          replyTo,
          mentions,
          tags,
          sender: user.id,
        },
        populate: {
          attachments: true,
          sender: USER_POPULATE,
          replyTo: {
            populate: {
              sender: USER_POPULATE,
            },
          },
          mentions: USER_POPULATE,
        } as any,
      });

      return {
        data: transformChatData(entity),
        meta: {
          message: SuccessResponses.CREATED('Message')
        }
      };
    } catch (error: any) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('send message'));
    }
  },

  // Find All Chat Messages with Pagination
  async find(ctx) {
    try {
      const { page, pageSize, start } = validatePagination(ctx.query.page, ctx.query.pageSize, 100);

      const [entities, total] = await Promise.all([
        strapi.entityService.findMany('api::chat.chat', {
          filters: {
            isDeleted: { $ne: true },
          },
          populate: {
            attachments: true,
            sender: USER_POPULATE,
            replyTo: {
              populate: {
                sender: USER_POPULATE,
              },
            },
            mentions: USER_POPULATE,
          } as any,
          sort: { createdAt: 'desc' },
          start,
          limit: pageSize,
        }),
        strapi.entityService.count('api::chat.chat', {
          filters: {
            isDeleted: { $ne: true },
          },
        }),
      ]);

      return {
        data: entities.map((entity: any) => transformChatData(entity)),
        meta: createPaginationMeta(page, pageSize, total)
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch messages'));
    }
  },

  // Find One Chat Message
  async findOne(ctx) {
    const { id } = ctx.params;

    try {
      const entity = await strapi.entityService.findOne('api::chat.chat', id, {
        populate: {
          attachments: true,
          sender: USER_POPULATE,
          replyTo: {
            populate: {
              sender: USER_POPULATE,
            },
          },
          mentions: USER_POPULATE,
        } as any,
      });

      if (!entity || entity.isDeleted) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Message'));
      }

      return { data: transformChatData(entity) };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch message'));
    }
  },

  // Update Chat Message (Edit)
  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;
    const { message } = ctx.request.body.data;

    try {
      // Validate message
      if (!message || message.trim().length === 0) {
        return ctx.badRequest('Message cannot be empty');
      }

      if (message.length > 2000) {
        return ctx.badRequest('Message cannot exceed 2000 characters');
      }

      // Check ownership
      const existingMessage: any = await strapi.entityService.findOne('api::chat.chat', id, {
        populate: {
          sender: { fields: ['id'] },
        },
      });

      if (!existingMessage) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Message'));
      }

      if (existingMessage.sender.id !== userId) {
        return ctx.forbidden(ErrorResponses.FORBIDDEN);
      }

      // Check if message was sent within last 15 minutes (edit window)
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      if (new Date(existingMessage.createdAt) < fifteenMinutesAgo) {
        return ctx.forbidden('Messages can only be edited within 15 minutes of sending');
      }

      // Update the message
      const updatedEntity = await strapi.entityService.update('api::chat.chat', id, {
        data: {
          message: message.trim(),
          isEdited: true,
          editedAt: new Date(),
        },
        populate: {
          attachments: true,
          sender: USER_POPULATE,
          replyTo: {
            populate: {
              sender: USER_POPULATE,
            },
          },
          mentions: USER_POPULATE,
        } as any,
      });

      return {
        data: transformChatData(updatedEntity),
        meta: {
          message: SuccessResponses.UPDATED('Message')
        }
      };
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Message'));
      }
      if (error.message.includes('only modify')) {
        return ctx.forbidden(ErrorResponses.FORBIDDEN);
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('update message'));
    }
  },

  // Delete Chat Message (Soft Delete)
  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      // Check ownership
      const existingMessage: any = await strapi.entityService.findOne('api::chat.chat', id, {
        populate: {
          sender: { fields: ['id'] },
        },
      });

      if (!existingMessage) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Message'));
      }

      if (existingMessage.sender.id !== userId) {
        return ctx.forbidden(ErrorResponses.FORBIDDEN);
      }

      // Soft delete the message
      await strapi.entityService.update('api::chat.chat', id, {
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      return {
        data: {
          message: SuccessResponses.DELETED('Message'),
          id: id,
        },
      };
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Message'));
      }
      if (error.message.includes('only modify')) {
        return ctx.forbidden(ErrorResponses.FORBIDDEN);
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('delete message'));
    }
  },

  // Add Reaction to Message
  async addReaction(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const { emoji } = ctx.request.body;
    const userId = ctx.state.user.id;

    try {
      // Validate emoji
      if (!emoji || typeof emoji !== 'string' || emoji.trim().length === 0) {
        return ctx.badRequest('Emoji is required');
      }

      // Basic emoji validation (1-4 characters for most emojis)
      if (emoji.length > 10) {
        return ctx.badRequest('Invalid emoji');
      }
      const message: any = await strapi.entityService.findOne('api::chat.chat', id, {
        populate: {
          sender: USER_POPULATE,
        } as any,
      });

      if (!message || message.isDeleted) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Message'));
      }

      const reactions = message.reactions || {};
      if (!reactions[emoji]) {
        reactions[emoji] = [];
      }

      // Toggle reaction
      const userIndex = reactions[emoji].indexOf(userId);
      if (userIndex > -1) {
        reactions[emoji].splice(userIndex, 1);
        if (reactions[emoji].length === 0) {
          delete reactions[emoji];
        }
      } else {
        reactions[emoji].push(userId);
      }

      await strapi.entityService.update('api::chat.chat', id, {
        data: { reactions },
      });

      return {
        data: {
          reactions,
          message: 'Reaction updated successfully'
        }
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('update reaction'));
    }
  },
}));
