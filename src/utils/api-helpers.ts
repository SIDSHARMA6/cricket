/**
 * Shared API utilities and helpers
 */

// Get base URL from environment or use default
export const getBaseUrl = () => {
  return process.env.BASE_URL || 'https://cricket-d5rd.onrender.com';
};

// Common populate configuration for user fields
export const USER_POPULATE = {
  fields: ['username', 'email', 'id'],
};

// Common populate configuration for liked_by fields
export const LIKED_BY_POPULATE = {
  fields: ['id'],
};

// Transform media URLs with base URL
export const transformMediaUrls = (mediaArray: any[]) => {
  if (!mediaArray || !Array.isArray(mediaArray)) return [];
  
  return mediaArray.map((media: any) => ({
    url: `${getBaseUrl()}${media.url}`,
    name: media.name,
    mime: media.mime,
    size: media.size,
  }));
};

// Check if user is liked by current user
export const isLikedByUser = (likedBy: any[], currentUserId?: number) => {
  if (!currentUserId || !likedBy) return false;
  return likedBy.some((user: any) => user.id === currentUserId);
};

// Validate pagination parameters
export const validatePagination = (page: any, pageSize: any, maxPageSize = 50) => {
  const validPage = Math.max(1, parseInt(page as string) || 1);
  const validPageSize = Math.min(maxPageSize, Math.max(1, parseInt(pageSize as string) || 10));
  const start = (validPage - 1) * validPageSize;
  
  return { page: validPage, pageSize: validPageSize, start };
};

// Create pagination metadata
export const createPaginationMeta = (page: number, pageSize: number, total: number) => ({
  pagination: {
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
    total,
  }
});

// Validate media input
export const validateMediaInput = (media: any, maxCount = 10, fieldName = 'media') => {
  if (!media || !Array.isArray(media) || media.length === 0) {
    throw new Error(`${fieldName} must contain at least one file`);
  }
  
  if (media.length > maxCount) {
    throw new Error(`${fieldName} cannot contain more than ${maxCount} files`);
  }
  
  return true;
};

// Rate limiting check
export const checkRateLimit = async (
  strapi: any, 
  contentType: any, 
  userId: number, 
  maxCount: number, 
  timeWindowHours: number
) => {
  const timeAgo = new Date(Date.now() - timeWindowHours * 60 * 60 * 1000);
  const recentItems = await strapi.entityService.findMany(contentType, {
    filters: {
      user: { id: userId },
      createdAt: { $gte: timeAgo },
    },
  });
  
  return recentItems.length >= maxCount;
};

// Standard error responses
export const ErrorResponses = {
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You can only modify your own content',
  NOT_FOUND: (resource: string) => `${resource} not found`,
  RATE_LIMIT: (count: number, time: string) => `You can only create ${count} items per ${time}`,
  VALIDATION_ERROR: (message: string) => message,
  SERVER_ERROR: (action: string) => `Failed to ${action}`,
};

// Standard success responses
export const SuccessResponses = {
  CREATED: (resource: string) => `${resource} created successfully`,
  UPDATED: (resource: string) => `${resource} updated successfully`,
  DELETED: (resource: string) => `${resource} deleted successfully`,
  BULK_DELETED: (count: number, resource: string) => `${count} ${resource}s deleted successfully`,
};

// Common entity service options
export const getEntityServiceOptions = (populate?: any, sort?: any) => ({
  populate: populate || {
    user: USER_POPULATE,
    liked_by: LIKED_BY_POPULATE,
  },
  sort: sort || { createdAt: 'desc' },
});

// Handle like/unlike functionality
export const handleLikeToggle = async (
  strapi: any,
  contentType: any,
  entityId: string,
  userId: number
) => {
  const entity: any = await strapi.entityService.findOne(contentType, entityId, {
    populate: { liked_by: LIKED_BY_POPULATE },
  });

  if (!entity) {
    throw new Error('Entity not found');
  }

  const likedBy = entity.liked_by || [];
  const isAlreadyLiked = likedBy.some((user: any) => user.id === userId);

  let updatedLikedBy: any[];
  if (isAlreadyLiked) {
    // Unlike
    updatedLikedBy = likedBy.filter((user: any) => user.id !== userId);
  } else {
    // Like
    updatedLikedBy = [...likedBy, { id: userId }];
  }

  await strapi.entityService.update(contentType, entityId, {
    data: {
      liked_by: updatedLikedBy.map((user: any) => user.id) as any,
    },
  });

  return {
    isLiked: !isAlreadyLiked,
    likesCount: updatedLikedBy.length,
  };
};

// Check ownership of entity
export const checkOwnership = async (
  strapi: any,
  contentType: any,
  entityId: string,
  userId: number
) => {
  const entity: any = await strapi.entityService.findOne(contentType, entityId, {
    populate: {
      user: { fields: ['id'] },
    },
  });

  if (!entity) {
    throw new Error('Entity not found');
  }

  if (entity.user.id !== userId) {
    throw new Error('You can only modify your own content');
  }

  return entity;
};