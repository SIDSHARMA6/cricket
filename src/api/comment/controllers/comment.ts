/**
 * comment controller
 */

import { factories } from '@strapi/strapi'
import {
    validatePagination,
    createPaginationMeta,
    checkRateLimit,
    ErrorResponses,
    SuccessResponses,
    checkOwnership,
    USER_POPULATE,
} from '../../../utils/api-helpers';

// Helper function to transform comment data
const transformCommentData = (entity: any) => {
    return {
        id: entity.id,
        text: entity.text,
        user: {
            id: entity.user?.id,
            username: entity.user?.username || 'Unknown User',
            email: entity.user?.email || '',
        },
        post: entity.post ? {
            id: entity.post.id,
            caption: entity.post.caption,
        } : null,
        story: entity.story ? {
            id: entity.story.id,
        } : null,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
    };
};

export default factories.createCoreController('api::comment.comment' as any, ({ strapi }) => ({
    // Create Comment
    async create(ctx) {
        if (!ctx.state.user) {
            return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
        }

        const user = ctx.state.user;
        const { text, post, story } = ctx.request.body.data;

        try {
            // Validate input
            if (!text || text.trim().length === 0) {
                return ctx.badRequest('Comment text is required');
            }

            if (text.length > 1000) {
                return ctx.badRequest('Comment cannot exceed 1000 characters');
            }

            if (!post && !story) {
                return ctx.badRequest('Comment must be associated with either a post or story');
            }

            if (post && story) {
                return ctx.badRequest('Comment cannot be associated with both post and story');
            }

            // Check rate limiting - max 30 comments per hour per user
            const isRateLimited = await checkRateLimit(strapi, 'api::comment.comment' as any, user.id, 30, 1);
            if (isRateLimited) {
                return ctx.tooManyRequests(ErrorResponses.RATE_LIMIT(30, 'hour'));
            }

            // Verify post or story exists
            if (post) {
                const postExists = await strapi.entityService.findOne('api::post.post', post);
                if (!postExists) {
                    return ctx.badRequest('Post not found');
                }
            }

            if (story) {
                const storyExists = await strapi.entityService.findOne('api::story.story', story);
                if (!storyExists) {
                    return ctx.badRequest('Story not found');
                }
            }

            // Create the comment
            const entity = await strapi.entityService.create('api::comment.comment' as any, {
                data: {
                    text: text.trim(),
                    post,
                    story,
                    user: user.id,
                },
                populate: {
                    user: USER_POPULATE,
                    post: {
                        fields: ['id', 'caption'],
                    },
                    story: {
                        fields: ['id'],
                    },
                },
            });

            return {
                data: transformCommentData(entity),
                meta: {
                    message: SuccessResponses.CREATED('Comment')
                }
            };
        } catch (error: any) {
            ctx.throw(500, ErrorResponses.SERVER_ERROR('create comment'));
        }
    },

    // Find All Comments with Pagination
    async find(ctx) {
        try {
            const { page, pageSize, start } = validatePagination(ctx.query.page, ctx.query.pageSize);
            const { post, story } = ctx.query;

            let filters: any = {};
            if (post) {
                filters.post = { id: post };
            }
            if (story) {
                filters.story = { id: story };
            }

            const [entities, total] = await Promise.all([
                strapi.entityService.findMany('api::comment.comment' as any, {
                    filters,
                    populate: {
                        user: USER_POPULATE,
                        post: {
                            fields: ['id', 'caption'],
                        },
                        story: {
                            fields: ['id'],
                        },
                    },
                    sort: { createdAt: 'desc' },
                    start,
                    limit: pageSize,
                }),
                strapi.entityService.count('api::comment.comment' as any, { filters }),
            ]);

            return {
                data: entities.map((entity: any) => transformCommentData(entity)),
                meta: createPaginationMeta(page, pageSize, total)
            };
        } catch (error) {
            ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch comments'));
        }
    },

    // Find One Comment
    async findOne(ctx) {
        const { id } = ctx.params;

        try {
            const entity = await strapi.entityService.findOne('api::comment.comment' as any, id, {
                populate: {
                    user: USER_POPULATE,
                    post: {
                        fields: ['id', 'caption'],
                    },
                    story: {
                        fields: ['id'],
                    },
                },
            });

            if (!entity) {
                return ctx.notFound(ErrorResponses.NOT_FOUND('Comment'));
            }

            return { data: transformCommentData(entity) };
        } catch (error) {
            ctx.throw(500, ErrorResponses.SERVER_ERROR('fetch comment'));
        }
    },

    // Update Comment
    async update(ctx) {
        if (!ctx.state.user) {
            return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
        }

        const { id } = ctx.params;
        const userId = ctx.state.user.id;
        const { text } = ctx.request.body.data;

        try {
            // Validate input
            if (!text || text.trim().length === 0) {
                return ctx.badRequest('Comment text is required');
            }

            if (text.length > 1000) {
                return ctx.badRequest('Comment cannot exceed 1000 characters');
            }

            // Check ownership
            await checkOwnership(strapi, 'api::comment.comment' as any, id, userId);

            // Update the comment
            const updatedEntity = await strapi.entityService.update('api::comment.comment' as any, id, {
                data: {
                    text: text.trim(),
                },
                populate: {
                    user: USER_POPULATE,
                    post: {
                        fields: ['id', 'caption'],
                    },
                    story: {
                        fields: ['id'],
                    },
                },
            });

            return {
                data: transformCommentData(updatedEntity),
                meta: {
                    message: SuccessResponses.UPDATED('Comment')
                }
            };
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return ctx.notFound(ErrorResponses.NOT_FOUND('Comment'));
            }
            if (error.message.includes('only modify')) {
                return ctx.forbidden(ErrorResponses.FORBIDDEN);
            }
            ctx.throw(500, ErrorResponses.SERVER_ERROR('update comment'));
        }
    },

    // Delete Comment
    async delete(ctx) {
        if (!ctx.state.user) {
            return ctx.unauthorized(ErrorResponses.UNAUTHORIZED);
        }

        const { id } = ctx.params;
        const userId = ctx.state.user.id;

        try {
            // Check ownership
            await checkOwnership(strapi, 'api::comment.comment' as any, id, userId);

            // Delete the comment
            await strapi.entityService.delete('api::comment.comment' as any, id);

            return {
                data: {
                    message: SuccessResponses.DELETED('Comment'),
                    id: id,
                },
            };
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return ctx.notFound(ErrorResponses.NOT_FOUND('Comment'));
            }
            if (error.message.includes('only modify')) {
                return ctx.forbidden(ErrorResponses.FORBIDDEN);
            }
            ctx.throw(500, ErrorResponses.SERVER_ERROR('delete comment'));
        }
    },
}));