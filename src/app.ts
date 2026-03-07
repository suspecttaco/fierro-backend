import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { traceId } from "./middleware/traceId";


import healthRouter from './modules/health/health.router';
import authRouter from './modules/auth/auth.router';
import catalogRouter from './modules/catalog/catalog.router'

const app = express();

// Seguridad
app.use(helmet());
app.use(traceId);
app.use(cors({
    origin: env.ALLOWED_ORIGINS.split(','),
    credentials: true,
}));

// Parseo
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Health check
app.use('/health', healthRouter);
// Auth
app.use('/auth', authRouter);
// Catalog
app.use('/catalog', catalogRouter);

// Manejador de Errores
app.use(errorHandler);

export default app;