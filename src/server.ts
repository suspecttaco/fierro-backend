import 'dotenv/config';
import './jobs'
import { env } from './config/env';
import { prisma } from './lib/prisma';
import app from './app';

app.listen(env.PORT, async () => {
  await prisma.$connect();
  console.log(`Server running on port ${env.PORT}`);
});