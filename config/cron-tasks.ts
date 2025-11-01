/**
 * Cron configuration for automated tasks
 */

export default {
  /**
   * Clean up expired stories every hour
   * Runs at minute 0 of every hour
   */
  'cleanup-expired-stories': {
    task: async ({ strapi }) => {
      try {
        console.log('🕐 Starting automated cleanup of expired stories...');
        
        const now = new Date();
        
        // Find expired stories
        const expiredStories = await strapi.entityService.findMany('api::story.story', {
          filters: {
            $or: [
              { expiresAt: { $lt: now } },
              { isExpired: true }
            ]
          },
          fields: ['id', 'expiresAt'],
          populate: {
            user: {
              fields: ['username']
            }
          }
        });

        if (expiredStories.length === 0) {
          console.log('✅ No expired stories found');
          return;
        }

        // Delete expired stories
        const deletedIds = [];
        for (const story of expiredStories) {
          try {
            await strapi.entityService.delete('api::story.story', story.id);
            deletedIds.push(story.id);
            console.log(`🗑️ Deleted expired story ${story.id} (expired: ${story.expiresAt})`);
          } catch (error) {
            console.error(`❌ Failed to delete expired story ${story.id}:`, error);
          }
        }

        console.log(`🧹 Cleanup completed: ${deletedIds.length}/${expiredStories.length} expired stories deleted`);
        
        // Log cleanup activity
        await strapi.log.info(`Story cleanup: ${deletedIds.length} expired stories deleted`, {
          deletedIds,
          totalFound: expiredStories.length,
          cleanupTime: now.toISOString()
        });

      } catch (error) {
        console.error('❌ Error during story cleanup:', error);
        await strapi.log.error('Story cleanup failed', { error: error.message });
      }
    },
    options: {
      rule: '0 * * * *', // Every hour at minute 0
      tz: 'UTC',
    },
  },

  /**
   * Mark stories as expired (without deleting) every 15 minutes
   * This helps with filtering without immediate deletion
   */
  'mark-expired-stories': {
    task: async ({ strapi }) => {
      try {
        const now = new Date();
        
        // Find stories that should be marked as expired
        const storiesToExpire = await strapi.entityService.findMany('api::story.story', {
          filters: {
            expiresAt: { $lt: now },
            isExpired: { $ne: true }
          },
          fields: ['id', 'expiresAt']
        });

        if (storiesToExpire.length === 0) {
          return;
        }

        // Mark stories as expired
        const updatedIds = [];
        for (const story of storiesToExpire) {
          try {
            await strapi.entityService.update('api::story.story', story.id, {
              data: { isExpired: true }
            });
            updatedIds.push(story.id);
          } catch (error) {
            console.error(`Failed to mark story ${story.id} as expired:`, error);
          }
        }

        console.log(`⏰ Marked ${updatedIds.length} stories as expired`);

      } catch (error) {
        console.error('Error marking stories as expired:', error);
      }
    },
    options: {
      rule: '*/15 * * * *', // Every 15 minutes
      tz: 'UTC',
    },
  },
};