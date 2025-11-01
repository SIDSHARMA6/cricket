/**
 * post controller - Instagram-like functionality
 */

import { factories } from '@strapi/strapi'

// Helper function to calculate counts and transform post data
const transformPostData = async (strapi: any, entity: any, currentUserId?: number) => {
  // Get comment count
  const commentCount = await strapi.entityService.count('api::comment.comment', {
    filters: { post: { id: entity.id } }
  } as any);

  // Get like info from the entity
  const likedBy = entity.liked_by || [];
  const likeCount = likedBy.length;
  
  // Check if current user liked this post
  const isLiked = currentUserId ? likedBy.some((user: any) => user.id === currentUserId) : false;

  // Transform media field to mediaUrls array
  let mediaUrls = [];
  if (entity.post && Array.isArray(entity.post)) {
    mediaUrls = entity.post.map((media: any) => {
      if (typeof media === 'object' && media.url) {
        // Media is already populated with full data
        return {
          id: media.id,
          url: media.url,
          name: media.name,
          mime: media.mime,
          size: media.size
        };
      } else if (typeof media === 'number' || typeof media === 'string') {
        // Media is just an ID, we need to construct URL
        return {
          id: media,
          url: `/uploads/${media}`, // Basic URL construction
          name: `media_${media}`,
          mime: 'unknown'
        };
      }
      return media;
    });
  }

  return {
    id: entity.id,
    caption: entity.caption || '',
    user: {
      id: entity.user?.id,
      username: entity.user?.username || 'Unknown User',
      email: entity.user?.email || ''
    },
    mediaUrls,
    likeCount: entity.likeCount || 0,
    commentCount: entity.commentCount || 0,
    isLiked,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
};

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  // Create Post
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const { caption, post } = ctx.request.body?.data || {};

    try {
      // Validate caption
      if (caption && typeof caption !== 'string') {
        return ctx.badRequest('Caption must be a string');
      }

      if (caption && caption.length > 2200) {
        return ctx.badRequest('Caption cannot exceed 2200 characters');
      }

      // Validate post media array
      if (post && !Array.isArray(post)) {
        return ctx.badRequest('Post media must be an array');
      }

      if (post && post.length > 10) {
        return ctx.badRequest('Cannot upload more than 10 media files');
      }

      // Create the post
      const entity = await strapi.entityService.create('api::post.post', {
        data: {
          caption: caption?.trim() || '',
          post,
          user: ctx.state.user.id,
          likeCount: 0,
          commentCount: 0
        },
        populate: ['user', 'liked_by', 'post']
      } as any);

      const transformedData = await transformPostData(strapi, entity, ctx.state.user.id);

      return {
        data: transformedData,
        meta: {
          message: 'Post created successfully'
        }
      };
    } catch (error) {
      console.error('Post creation error:', error);
      return ctx.internalServerError('Failed to create post');
    }
  },

  // Get All Posts
  async find(ctx) {
    try {
      const currentUserId = ctx.state.user?.id;

      const posts = await strapi.entityService.findMany('api::post.post', {
        populate: ['user', 'liked_by', 'post'],
        sort: { createdAt: 'desc' }
      } as any);

      const transformedPosts = await Promise.all(
        posts.map((post: any) => transformPostData(strapi, post, currentUserId))
      );

      return { data: transformedPosts };
    } catch (error) {
      console.error('Posts fetch error:', error);
      return ctx.internalServerError('Failed to fetch posts');
    }
  },

  // Get Single Post
  async findOne(ctx) {
    const { id } = ctx.params;
    const currentUserId = ctx.state.user?.id;

    try {
      const post = await strapi.entityService.findOne('api::post.post', id, {
        populate: ['user', 'liked_by', 'post']
      } as any);

      if (!post) {
        return ctx.notFound('Post not found');
      }

      const transformedData = await transformPostData(strapi, post, currentUserId);

      return { data: transformedData };
    } catch (error) {
      console.error('Post findOne error:', error);
      return ctx.internalServerError('Failed to fetch post');
    }
  },

  // Like/Unlike Post (Instagram style)
  async likePost(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const { id } = ctx.params;
    const userId = ctx.state.user.id;

    try {
      // Get the post
      const post: any = await strapi.entityService.findOne('api::post.post', id, {
        populate: ['liked_by']
      });

      if (!post) {
        return ctx.notFound('Post not found');
      }

      const likedBy = post.liked_by || [];
      const isCurrentlyLiked = likedBy.some((user: any) => user.id === userId);

      let updatedLikedBy;
      let message;

      if (isCurrentlyLiked) {
        // Unlike - remove user from liked_by
        updatedLikedBy = likedBy.filter((user: any) => user.id !== userId);
        message = 'Post unliked successfully';
      } else {
        // Like - add user to liked_by
        updatedLikedBy = [...likedBy, { id: userId }];
        message = 'Post liked successfully';
      }

      // Update the post
      const updatedPost = await strapi.entityService.update('api::post.post', id, {
        data: {
          liked_by: updatedLikedBy.map((user: any) => user.id),
          likeCount: updatedLikedBy.length
        },
        populate: ['user', 'liked_by']
      } as any);

      const transformedData = await transformPostData(strapi, updatedPost, userId);

      return {
        data: {
          ...transformedData,
          message
        }
      };
    } catch (error) {
      console.error('Like toggle error:', error);
      return ctx.internalServerError('Failed to toggle like');
    }
  },

  // Update Post
  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const { id } = ctx.params;
    const { caption } = ctx.request.body.data;

    try {
      // Check if post exists and user owns it
      const existingPost: any = await strapi.entityService.findOne('api::post.post', id, {
        populate: ['user']
      });

      if (!existingPost) {
        return ctx.notFound('Post not found');
      }

      if (existingPost.user?.id !== ctx.state.user.id) {
        return ctx.forbidden('You can only update your own posts');
      }

      const updatedPost = await strapi.entityService.update('api::post.post', id, {
        data: { caption },
        populate: ['user']
      } as any);

      const transformedData = await transformPostData(strapi, updatedPost, ctx.state.user.id);

      return { data: transformedData };
    } catch (error) {
      console.error('Post update error:', error);
      return ctx.internalServerError('Failed to update post');
    }
  },

  // Delete Post
  async delete(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized('Authentication required');
    }

    const { id } = ctx.params;

    try {
      // Check if post exists and user owns it
      const existingPost: any = await strapi.entityService.findOne('api::post.post', id, {
        populate: ['user']
      });

      if (!existingPost) {
        return ctx.notFound('Post not found');
      }

      if (existingPost.user?.id !== ctx.state.user.id) {
        return ctx.forbidden('You can only delete your own posts');
      }

      // Delete all comments for this post first
      const comments = await strapi.entityService.findMany('api::comment.comment', {
        filters: { post: { id: id } }
      } as any);
      
      for (const comment of comments) {
        await strapi.entityService.delete('api::comment.comment', comment.id);
      }

      // Delete the post
      await strapi.entityService.delete('api::post.post', id);

      return { data: { message: 'Post deleted successfully' } };
    } catch (error) {
      console.error('Post delete error:', error);
      return ctx.internalServerError('Failed to delete post');
    }
  }
}));