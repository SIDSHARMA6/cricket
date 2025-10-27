/**
 * Lifecycles for comment: increment/decrement post.comment_count
 */
export default {
  async afterCreate(event) {
    const { result } = event;
    try {
      const postRef = result.post?.id ?? result.post;
      if (!postRef) return;
      // fetch current post
      const post = await strapi.entityService.findOne('api::post.post', postRef, { fields: ['id', 'comment_count'] });
      const current = (post?.comment_count ?? 0) + 1;
      await strapi.entityService.update('api::post.post', postRef, { data: { comment_count: current } });
    } catch (err) {
      strapi.log.error('Error updating post comment_count in comment.afterCreate', err);
    }
  },

  async afterDelete(event) {
    const { result } = event;
    try {
      const postRef = result.post?.id ?? result.post;
      if (!postRef) return;
      const post = await strapi.entityService.findOne('api::post.post', postRef, { fields: ['id', 'comment_count'] });
      const current = Math.max(0, (post?.comment_count ?? 1) - 1);
      await strapi.entityService.update('api::post.post', postRef, { data: { comment_count: current } });
    } catch (err) {
      strapi.log.error('Error updating post comment_count in comment.afterDelete', err);
    }
  }
};
