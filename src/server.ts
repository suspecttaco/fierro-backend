import 'dotenv/config';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.listen(env.PORT, async () => {
  await prisma.$connect();
  console.log(`Server running on port ${env.PORT}`);
});