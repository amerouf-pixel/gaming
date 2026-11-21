import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { createServer as createViteServer } from 'vite';
import { handleStripeWebhookRaw, registerPaymentRoutes } from './server/payments';
import { registerIntegrationRoutes } from './server/integrations';

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Baseline security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // Stripe webhook MUST receive raw Buffer body before express.json()
  app.post('/api/stripe/webhook', express.raw({ type: 'application/json', limit: '256kb' }), handleStripeWebhookRaw);

  // Body parsers for Gumroad form-urlencoded and standard JSON API routes
  app.use(express.urlencoded({ extended: true, limit: '256kb' }));
  app.use(express.json({ limit: '256kb' }));

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, app: 'JITALX', publisher: '10JITAL PROD' });
  });

  // Register real Payment (Gumroad + Stripe) and Creator Integration (Twitch + YouTube OAuth) routes
  registerPaymentRoutes(app);
  registerIntegrationRoutes(app);

  // Catch unknown /api/* routes cleanly as JSON 404
  app.use('/api', (_req, res) => {
    res.status(404).json({ ok: false, error: 'API route not found.' });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    const indexHtml = path.join(distDir, 'index.html');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found. Run npm run build.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JITALX server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start JITALX server:', err);
  process.exit(1);
});
