/**
 * Lifecycles for like: prevent duplicate and update post.like_count
 */
export default {
  async beforeCreate(event) {
    const { params } = event;
    // params.data contains user and post
    const user = params.data.user?.id ?? params.data.user;
    const post = params.data.post?.id ?? params.data.post;
    if (!user || !post) return;
    // check existing
    const existing = await strapi.entityService.findMany('api::like.like', {
      filters: { user: user, post: post },
      fields: ['id']
    });
    if (existing?.length) {
      // cancel creation by throwing
      throw new Error('User has already liked this post');
    }
  },

  async afterCreate(event) {
    const { result } = event;
    try {
      const postRef = result.post?.id ?? result.post;
      if (!postRef) return;
      const post = await strapi.entityService.findOne('api::post.post', postRef, { fields: ['id', 'like_count'] });
      const current = (post?.like_count ?? 0) + 1;
      await strapi.entityService.update('api::post.post', postRef, { data: { like_count: current } });
    } catch (err) {
      strapi.log.error('Error updating post like_count in like.afterCreate', err);
    }
  },

  async afterDelete(event) {
    const { result } = event;
    try {
      const postRef = result.post?.id ?? result.post;
      if (!postRef) return;
      const post = await strapi.entityService.findOne('api::post.post', postRef, { fields: ['id', 'like_count'] });
      const current = Math.max(0, (post?.like_count ?? 1) - 1);
      await strapi.entityService.update('api::post.post', postRef, { data: { like_count: current } });
    } catch (err) {
      strapi.log.error('Error updating post like_count in like.afterDelete', err);
    }
  }
};
