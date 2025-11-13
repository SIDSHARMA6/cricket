/**
 * Custom user controller with location functionality
 */

export default (plugin) => {
  // Extend the default user controller
  plugin.controllers.user.updateLocation = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in');
    }

    const userId = ctx.state.user.id;
    const { latitude, longitude, city, state, district, country } = ctx.request.body;

    if (!latitude || !longitude) {
      return ctx.badRequest('Latitude and longitude are required');
    }

    try {
      const updatedUser = await strapi.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: {
          latitude,
          longitude,
          city,
          state,
          district,
          country
        }
      });

      return ctx.send({
        data: {
          id: updatedUser.id,
          latitude: updatedUser.latitude,
          longitude: updatedUser.longitude,
          city: updatedUser.city,
          state: updatedUser.state,
          district: updatedUser.district,
          country: updatedUser.country
        },
        message: 'Location updated successfully'
      });
    } catch (error) {
      console.error('Update location error:', error);
      return ctx.internalServerError('Failed to update location');
    }
  };

  // Find nearby users
  plugin.controllers.user.findNearby = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized('You must be logged in');
    }

    const { latitude, longitude, radius = 10 } = ctx.query;

    if (!latitude || !longitude) {
      return ctx.badRequest('Latitude and longitude are required');
    }

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const radiusKm = parseFloat(radius as string);

    try {
      // Get all users with location data
      const users = await strapi.query('plugin::users-permissions.user').findMany({
        where: {
          latitude: { $notNull: true },
          longitude: { $notNull: true },
          id: { $ne: ctx.state.user.id } // Exclude current user
        },
        select: ['id', 'username', 'latitude', 'longitude', 'city', 'state']
      });

      // Calculate distance using Haversine formula
      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      // Filter users within radius and add distance
      const nearbyUsers = users
        .map(user => ({
          id: user.id,
          username: user.username,
          city: user.city,
          state: user.state,
          distance: calculateDistance(lat, lng, parseFloat(user.latitude), parseFloat(user.longitude))
        }))
        .filter(user => user.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

      return ctx.send({
        data: nearbyUsers.map(user => ({
          ...user,
          distance: Math.round(user.distance * 100) / 100 // Round to 2 decimals
        })),
        meta: {
          total: nearbyUsers.length,
          radius: radiusKm,
          center: { latitude: lat, longitude: lng }
        }
      });
    } catch (error) {
      console.error('Find nearby users error:', error);
      return ctx.internalServerError('Failed to find nearby users');
    }
  };

  return plugin;
};
