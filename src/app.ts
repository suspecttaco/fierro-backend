import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from "./config/env";

const app = express();

// Seguridad
app.use(helmet());
app.use(cors({
    origin: env.ALLOWED_ORIGINS.split(','),
    credentials: true,
}));

// Parseo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

export default app;