import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const AdmZip = require('adm-zip');
import { serverDb as db } from './server-db.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // --- MOCK DATA STORE (In-Memory) ---
  // Note: We are now primarily using the 'db' service for data.
  // This local store is kept only for trends if not in db.

  // --- HELPER FUNCTIONS ---
  const getUser = (identifier: string) => {
      const found = db.getUser(identifier);
      if (found) return found;
      
      // Generate mock user if not found
      return {
          id: identifier.startsWith('u_') ? identifier : `u_${identifier}`,
          username: identifier,
          displayName: identifier.charAt(0).toUpperCase() + identifier.slice(1),
          avatarUrl: `https://picsum.photos/200/200?random=${identifier}`,
          isVerified: true,
          followers: Math.floor(Math.random() * 10000),
          role: 'creator',
          isPremium: true,
          contentPreference: 'dating',
          pronunciation: 'User'
      };
  };

  const getUserPosts = (userId: string) => {
      let posts = db.getUserPosts(userId);
      if (posts.length === 0) {
          // Generate mock posts
          posts = Array.from({ length: 10 }).map((_, i) => ({
              id: `post_${userId}_${i}`,
              type: ['PHOTO', 'VIDEO', 'SHORT'][i % 3],
              title: `Post ${i}`,
              content: 'Generated content from backend',
              thumbnailUrl: `https://picsum.photos/400/500?random=${userId}_${i}`,
              userId: userId,
              user: getUser(userId),
              heat: Math.floor(Math.random() * 500),
              comments: 5,
              timestamp: Date.now() - (i * 100000),
              isAdult: false
          }));
      }
      return posts;
  };

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
          middlewareMode: true,
          hmr: false 
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  // --- API routes ---
  // Note: Most data is now handled client-side with Firebase.
  // These routes are kept for legacy or specific server-side needs if any.

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
