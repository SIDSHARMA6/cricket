/**
 * group controller with join/leave functionality
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::group.group', ({ strapi }) => ({
  // Join group
  async join(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in to join a group');
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      // Find group by documentId using db query
      const group: any = await strapi.db.query('api::group.group').findOne({
        where: { documentId: id },
        populate: {
          members: true,
          user: true
        }
      });

      if (!group) {
        return ctx.notFound('Group not found');
      }

      const members = group.members || [];
      const alreadyMember = members.some((m: any) => m.id === userId);

      if (alreadyMember) {
        return ctx.badRequest('You are already a member of this group');
      }

      const updatedGroup = await strapi.entityService.update('api::group.group', group.id, {
        data: {
          members: [...members.map((m: any) => m.id), userId] as any,
          members_count: members.length + 1
        },
        populate: {
          user: { fields: ['id', 'username'] },
          members: { fields: ['id', 'username'] }
        }
      } as any);

      return ctx.send({
        data: updatedGroup,
        message: 'Joined group successfully'
      });
    } catch (error) {
      console.error('Join group error:', error);
      return ctx.internalServerError('Failed to join group');
    }
  },

  // Leave group
  async leave(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      // Find group by documentId using db query
      const group: any = await strapi.db.query('api::group.group').findOne({
        where: { documentId: id },
        populate: {
          members: true,
          user: true
        }
      });

      if (!group) {
        return ctx.notFound('Group not found');
      }

      // Check if user is the creator
      if (group.user?.id === userId) {
        return ctx.badRequest('Group creator cannot leave. Delete the group instead.');
      }

      const members = group.members || [];
      const isMember = members.some((m: any) => m.id === userId);

      if (!isMember) {
        return ctx.badRequest('You are not a member of this group');
      }

      const updatedGroup = await strapi.entityService.update('api::group.group', group.id, {
        data: {
          members: members.filter((m: any) => m.id !== userId).map((m: any) => m.id) as any,
          members_count: Math.max(0, members.length - 1)
        },
        populate: {
          user: { fields: ['id', 'username'] },
          members: { fields: ['id', 'username'] }
        }
      } as any);

      return ctx.send({
        data: updatedGroup,
        message: 'Left group successfully'
      });
    } catch (error) {
      console.error('Leave group error:', error);
      return ctx.internalServerError('Failed to leave group');
    }
  }
}));
