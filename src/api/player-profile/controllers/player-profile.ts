/**
 * player-profile controller
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

// Helper function to transform player profile data
const transformPlayerProfileData = (entity: any) => {
  const profileImageUrls = transformMediaUrls(entity.profileImage ? [entity.profileImage] : []);
  const achievementBadges = entity.achievements?.map((achievement: any) => ({
    ...achievement,
    badgeUrl: achievement.badge ? transformMediaUrls([achievement.badge])[0] : null
  })) || [];

  return {
    id: entity.id,
    documentId: entity.documentId,
    displayName: entity.displayName,
    age: entity.age,
    birthday: entity.birthday,
    role: entity.role,
    battingStyle: entity.battingStyle,
    bowlingStyle: entity.bowlingStyle,
    skillLevel: entity.skillLevel,
    location: entity.location,
    bio: entity.bio,
    profileImageUrl: profileImageUrls[0] || null,
    isAvailable: entity.isAvailable,
    rating: entity.rating,
    totalMatches: entity.totalMatches,
    phoneNumber: entity.phoneNumber,
    emergencyContact: entity.emergencyContact,
    user: entity.user ? {
      id: entity.user.id,
      username: entity.user.username,
      email: entity.user.email,
    } : null,
    stats: entity.stats ? {
      matchesPlayed: entity.stats.matchesPlayed || 0,
      runsScored: entity.stats.runsScored || 0,
      highestScore: entity.stats.highestScore || 0,
      average: entity.stats.average || 0,
      strikeRate: entity.stats.strikeRate || 0,
      centuries: entity.stats.centuries || 0,
      halfCenturies: entity.stats.halfCenturies || 0,
      wicketsTaken: entity.stats.wicketsTaken || 0,
      bowlingAverage: entity.stats.bowlingAverage || 0,
      economyRate: entity.stats.economyRate || 0,
      bestBowling: entity.stats.bestBowling || null,
      catches: entity.stats.catches || 0,
      stumpings: entity.stats.stumpings || 0,
      runOuts: entity.stats.runOuts || 0,
    } : null,
    achievements: achievementBadges,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    publishedAt: entity.publishedAt,
  };
};

export default factories.createCoreController('api::player-profile.player-profile', ({ strapi }) => ({
  // Get All Player Profiles with Complete Data
  async find(ctx) {
    try {
      const { page, pageSize, start } = validatePagination(ctx.query.page, ctx.query.pageSize, 50);

      const [entities, total] = await Promise.all([
        strapi.entityService.findMany('api::player-profile.player-profile', {
          populate: {
            user: USER_POPULATE,
            profileImage: true,
            stats: true,
            achievements: {
              populate: {
                badge: true,
              },
            },
          } as any,
          sort: { createdAt: 'desc' },
          start,
          limit: pageSize,
        }),
        strapi.entityService.count('api::player-profile.player-profile'),
      ]);

      return {
        data: entities.map((entity: any) => transformPlayerProfileData(entity)),
        meta: createPaginationMeta(page, pageSize, total)
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch player profiles'));
    }
  },

  // Get Single Player Profile with Complete Data
  async findOne(ctx) {
    const { id } = ctx.params;

    try {
      const entity = await strapi.entityService.findOne('api::player-profile.player-profile', id, {
        populate: {
          user: USER_POPULATE,
          profileImage: true,
          stats: true,
          achievements: {
            populate: {
              badge: true,
            },
          },
        } as any,
      });

      if (!entity) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Player profile'));
      }

      return { 
        data: transformPlayerProfileData(entity),
        meta: {
          message: 'Player profile retrieved successfully'
        }
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch player profile'));
    }
  },

  // Create Player Profile with Complete Data
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { 
      displayName, age, birthday, role, battingStyle, bowlingStyle, 
      skillLevel, location, bio, profileImage, isAvailable, rating, 
      totalMatches, phoneNumber, emergencyContact, user, stats, achievements 
    } = ctx.request.body?.data || {};

    try {
      // Validate required fields
      if (!displayName || !role) {
        return ctx.badRequest('Display name and role are required');
      }

      // Create the player profile
      const entity = await strapi.entityService.create('api::player-profile.player-profile', {
        data: {
          displayName,
          age,
          birthday,
          role,
          battingStyle,
          bowlingStyle,
          skillLevel: skillLevel || 'Beginner',
          location,
          bio,
          profileImage,
          isAvailable: isAvailable !== undefined ? isAvailable : true,
          rating: rating || 0,
          totalMatches: totalMatches || 0,
          phoneNumber,
          emergencyContact,
          user: user || ctx.state.user.id,
          stats,
          achievements,
        },
        populate: {
          user: USER_POPULATE,
          profileImage: true,
          stats: true,
          achievements: {
            populate: {
              badge: true,
            },
          },
        } as any,
      });

      return {
        data: transformPlayerProfileData(entity),
        meta: {
          message: SuccessResponses.CREATED('Player profile')
        }
      };
    } catch (error: any) {
      console.error('Player profile creation error:', error);
      ctx.throw(500, ErrorResponses.SERVER_ERROR('create player profile'));
    }
  },

  // Update Player Profile with Complete Data
  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;
    const updateData = ctx.request.body?.data || {};

    try {
      // Update the player profile
      const updatedEntity = await strapi.entityService.update('api::player-profile.player-profile', id, {
        data: updateData,
        populate: {
          user: USER_POPULATE,
          profileImage: true,
          stats: true,
          achievements: {
            populate: {
              badge: true,
            },
          },
        } as any,
      });

      if (!updatedEntity) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Player profile'));
      }

      return {
        data: transformPlayerProfileData(updatedEntity),
        meta: {
          message: SuccessResponses.UPDATED('Player profile')
        }
      };
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Player profile'));
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('update player profile'));
    }
  },

  // Delete Player Profile
  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
    }

    const { id } = ctx.params;

    try {
      const deletedEntity = await strapi.entityService.delete('api::player-profile.player-profile', id);

      if (!deletedEntity) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Player profile'));
      }

      return {
        data: {
          message: SuccessResponses.DELETED('Player profile'),
          id: id,
        },
      };
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Player profile'));
      }
      ctx.throw(500, ErrorResponses.SERVER_ERROR('delete player profile'));
    }
  },

  // Get Player Profile by User ID
  async findByUser(ctx) {
    const { userId } = ctx.params;

    try {
      const entities = await strapi.entityService.findMany('api::player-profile.player-profile', {
        filters: {
          user: { id: userId },
        },
        populate: {
          user: USER_POPULATE,
          profileImage: true,
          stats: true,
          achievements: {
            populate: {
              badge: true,
            },
          },
        } as any,
      });

      if (!entities || entities.length === 0) {
        return ctx.notFound(ErrorResponses.NOT_FOUND('Player profile for this user'));
      }

      return { 
        data: transformPlayerProfileData(entities[0]),
        meta: {
          message: 'Player profile retrieved successfully'
        }
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch player profile by user'));
    }
  },

  // Search Player Profiles
  async search(ctx) {
    const { query, role, skillLevel, location } = ctx.query;

    try {
      const filters: any = {};

      if (query) {
        filters.$or = [
          { displayName: { $containsi: query } },
          { bio: { $containsi: query } },
          { location: { $containsi: query } },
        ];
      }

      if (role) {
        filters.role = { $eq: role };
      }

      if (skillLevel) {
        filters.skillLevel = { $eq: skillLevel };
      }

      if (location) {
        filters.location = { $containsi: location };
      }

      const entities = await strapi.entityService.findMany('api::player-profile.player-profile', {
        filters,
        populate: {
          user: USER_POPULATE,
          profileImage: true,
          stats: true,
          achievements: {
            populate: {
              badge: true,
            },
          },
        } as any,
        sort: { rating: 'desc' },
      });

      return {
        data: entities.map((entity: any) => transformPlayerProfileData(entity)),
        meta: {
          total: entities.length,
          message: 'Search completed successfully'
        }
      };
    } catch (error) {
      ctx.throw(500, ErrorResponses.SERVER_ERROR('search player profiles'));
    }
  },
}));
