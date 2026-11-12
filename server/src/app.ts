import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { prisma } from './config/db';
import apiRouter from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { describeJwtSecretProblem } from './config/jwt';

// Ensure environmental variables are loaded
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Behind Render/Fly/nginx the TLS terminator is a proxy hop away.
app.set('trust proxy', 1);

// Explicit CORS allowlist. Unlisted origins receive no CORS headers at all, so
// a browser on another site cannot read authenticated responses. '*' is only
// honoured outside production, where it is useful for local devices.
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowAnyOrigin = allowedOrigins.includes('*') && process.env.NODE_ENV !== 'production';

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin: same-origin server-side render, curl, or health probe.
      if (!origin) return callback(null, true);
      if (allowAnyOrigin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    maxAge: 600
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

interface ReadinessResult {
  ready: boolean;
  checks: {
    database: 'connected' | 'disconnected' | 'unconfigured';
    migrations: 'applied' | 'pending' | 'unknown';
    configuration: 'ok' | 'incomplete';
  };
  problems: string[];
}

/**
 * Readiness means: the process can reach its database, the schema migrations
 * are applied, and the required secrets are configured. A process that cannot
 * persist patient records must not be reported as healthy.
 */
async function checkReadiness(): Promise<ReadinessResult> {
  const problems: string[] = [];
  const checks: ReadinessResult['checks'] = {
    database: 'unconfigured',
    migrations: 'unknown',
    configuration: 'ok',
  };

  if (!process.env.DATABASE_URL) {
    problems.push('DATABASE_URL is not configured');
  } else {
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = 'connected';
    } catch {
      checks.database = 'disconnected';
      problems.push('Database is unreachable');
    }
  }

  if (checks.database === 'connected') {
    try {
      const pending = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::bigint AS count FROM "_prisma_migrations" WHERE finished_at IS NULL
      `;
      const count = Number(pending?.[0]?.count ?? 0);
      checks.migrations = count === 0 ? 'applied' : 'pending';
      if (count > 0) problems.push(`${count} database migration(s) not applied`);
    } catch {
      checks.migrations = 'unknown';
      problems.push('Could not read migration state');
    }
  }

  const jwtProblem = describeJwtSecretProblem();
  if (jwtProblem) {
    checks.configuration = 'incomplete';
    problems.push(jwtProblem);
  }

  return {
    ready: problems.length === 0,
    checks,
    problems,
  };
}

function readinessPayload(result: ReadinessResult) {
  return {
    status: result.ready ? 'ok' : 'unavailable',
    service: 'Neulens Hospital Platform',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    environment: process.env.NODE_ENV || 'production',
    ...result.checks,
    problems: result.problems,
  };
}

// Liveness: the process is up. Used by orchestrators to decide on restarts.
app.get('/livez', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Readiness: 503 unless the service can actually serve clinical traffic.
async function sendReadiness(_req: express.Request, res: express.Response) {
  try {
    const result = await checkReadiness();
    res.status(result.ready ? 200 : 503).json(readinessPayload(result));
  } catch {
    res.status(503).json({ status: 'unavailable', problems: ['Readiness check failed'] });
  }
}

app.get('/readyz', sendReadiness);
app.get('/health', sendReadiness);

// Main V1 API Routes entry
app.use('/api/v1', apiRouter);

// Serve static frontend build if present (Unified single-service deployment)
const possibleDistPaths = [
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist'),
  path.resolve(__dirname, './client/dist')
];
const resolvedDistPath = possibleDistPaths.find((p) => fs.existsSync(p));

if (resolvedDistPath) {
  console.log(`[Neulens]: Serving static frontend bundle from ${resolvedDistPath}`);
  app.use(express.static(resolvedDistPath));

  // SPA fallback for client-side navigation
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(resolvedDistPath, 'index.html'));
  });
}

// Centralized error routing
app.use(errorHandler);

// Global route catch-all for unhandled endpoints
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint path not found' });
});

// Start listening if not in test suite environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, HOST, async () => {
    console.log(`[Neulens Server]: Running on http://${HOST}:${PORT}`);
    if (process.env.DATABASE_URL) {
      try {
        await prisma.$connect();
        console.log('[Neulens Database]: PostgreSQL connection established successfully.');
      } catch (dbErr) {
        console.error(
          '[Neulens Database Warning]: Could not connect to PostgreSQL database.',
          dbErr instanceof Error ? dbErr.message : dbErr
        );
      }
    } else if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[Neulens Security Warning]: DATABASE_URL is not set in production. Persistent patient records will not be saved.'
      );
    }
  });
}

export default app;
