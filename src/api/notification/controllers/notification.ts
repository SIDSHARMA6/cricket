/**
 * notification controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::notification.notification', ({ strapi }) => ({
  // Mark notification as read
  async markAsRead(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      const notification: any = await strapi.entityService.findOne('api::notification.notification', id, {
        populate: { recipient: { fields: ['id'] } }
      });

      if (!notification) {
        return ctx.notFound('Notification not found');
      }

      if (notification.recipient?.id !== userId) {
        return ctx.forbidden('You can only mark your own notifications as read');
      }

      const updated = await strapi.entityService.update('api::notification.notification', id, {
        data: {
          isRead: true,
          readAt: new Date()
        },
        populate: {
          recipient: { fields: ['id', 'username'] },
          sender: { fields: ['id', 'username'] }
        }
      });

      return {
        data: updated,
        meta: { message: 'Notification marked as read' }
      };
    } catch (error) {
      console.error('Mark as read error:', error);
      return ctx.internalServerError('Failed to mark notification as read');
    }
  },

  // Mark all notifications as read
  async markAllAsRead(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const userId = ctx.state.user.id;

    try {
      const notifications = await strapi.entityService.findMany('api::notification.notification', {
        filters: {
          recipient: { id: userId },
          isRead: false
        }
      });

      for (const notification of notifications) {
        await strapi.entityService.update('api::notification.notification', notification.id, {
          data: {
            isRead: true,
            readAt: new Date()
          }
        });
      }

      return {
        data: {
          message: `${notifications.length} notifications marked as read`,
          count: notifications.length
        }
      };
    } catch (error) {
      console.error('Mark all as read error:', error);
      return ctx.internalServerError('Failed to mark all notifications as read');
    }
  },

  // Delete notification
  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      const notification: any = await strapi.entityService.findOne('api::notification.notification', id, {
        populate: { recipient: { fields: ['id'] } }
      });

      if (!notification) {
        return ctx.notFound('Notification not found');
      }

      if (notification.recipient?.id !== userId) {
        return ctx.forbidden('You can only delete your own notifications');
      }

      await strapi.entityService.delete('api::notification.notification', id);

      return {
        data: { message: 'Notification deleted successfully' }
      };
    } catch (error) {
      console.error('Delete notification error:', error);
      return ctx.internalServerError('Failed to delete notification');
    }
  }
}));