// import type { Core } from '@strapi/strapi';

import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export default {
  register() {},

  async bootstrap({ strapi }) {
    try {
      const httpServer = (strapi.server && (strapi.server as any).httpServer) || (strapi.server as any);
      if (!httpServer) {
        strapi.log.info('Socket.IO: httpServer not found on strapi.server');
        return;
      }

      const io = new Server(httpServer, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });

      // attach io instance to strapi for access in controllers/services if needed
      (strapi as any).io = io;

      // If REDIS_URL provided, try to enable Redis adapter for socket.io so scaling across instances works
      const redisUrl = process.env.REDIS_URL || process.env.REDIS;
      if (redisUrl) {
        try {
          // require at runtime to keep optional
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { createAdapter } = require('@socket.io/redis-adapter');
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { createClient } = require('redis');

          const pubClient = createClient({ url: redisUrl });
          const subClient = pubClient.duplicate();

          Promise.all([pubClient.connect(), subClient.connect()])
            .then(() => {
              io.adapter(createAdapter(pubClient, subClient));
              strapi.log.info('Socket.IO: Redis adapter connected');
            })
            .catch((e) => {
              strapi.log.error('Socket.IO: failed to connect Redis adapter', e);
            });
        } catch (err) {
          strapi.log.warn('Socket.IO: redis adapter packages not installed; skipping Redis adapter. Install @socket.io/redis-adapter and redis to enable it.');
        }
      }

      // JWT verification middleware for socket connections
      io.use(async (socket, next) => {
        try {
          const token = socket.handshake.auth?.token || (socket.handshake.headers?.authorization ? socket.handshake.headers.authorization.split(' ')[1] : null);
          if (!token) {
            return next(new Error('Authentication error: token missing'));
          }

          const secret = process.env.JWT_SECRET;
          if (!secret) {
            strapi.log.warn('Socket.IO: JWT_SECRET not set in env, proceeding without verification (insecure)');
            socket.data.user = null;
            return next();
          }

          const decoded = jwt.verify(token, secret) as any;
          // Strapi's JWT usually contains the user id as 'id' or 'sub'
          const userId = decoded?.id ?? decoded?.sub ?? decoded?.user?.id;
          if (!userId) {
            return next(new Error('Authentication error: invalid token'));
          }

          // fetch user to attach minimal data
          const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, { fields: ['id', 'username', 'email'] });
          socket.data.user = user;
          return next();
        } catch (err) {
          strapi.log.warn('Socket.IO auth error', err);
          return next(new Error('Authentication error'));
        }
      });

      io.on('connection', (socket) => {
        const user = socket.data.user;
        const userId = user?.id ?? null;
        strapi.log.info(`Socket.IO: user connected ${userId ?? 'anonymous'} (id=${socket.id})`);

        // Join global room by default
        socket.join('global');

        // handle incoming chat messages
        socket.on('message', async (payload) => {
          try {
            const channel = payload?.channel || 'global';
            const content = payload?.content || '';
            if (!content) return;

            const data: any = {
              content,
              channel
            };
            if (userId) data.sender = userId;

            // persist message to Strapi chat collection
            const created = await strapi.entityService.create('api::chat.chat', { data });

            // emit message to the channel room
            io.to(channel).emit('message', created);
          } catch (err) {
            strapi.log.error('Socket.IO message handling error', err);
            socket.emit('error', { message: 'Message failed to send' });
          }
        });

        socket.on('join', (channel) => {
          if (!channel) return;
          socket.join(channel);
        });

        socket.on('leave', (channel) => {
          if (!channel) return;
          socket.leave(channel);
        });

        socket.on('disconnect', (reason) => {
          strapi.log.info(`Socket.IO: socket ${socket.id} disconnected (${reason})`);
        });
      });

      strapi.log.info('Socket.IO initialized');
    } catch (err) {
      strapi.log.error('Failed to initialize Socket.IO', err);
    }
  }
};
