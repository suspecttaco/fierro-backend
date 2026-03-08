import cron from 'node-cron';
import { prisma } from '../lib/prisma';

// Limpieza de carritos expirados — cada hora
cron.schedule('0 * * * *', async () => {
  try {
    await prisma.$executeRaw`CALL app.sp_cleanup_expired_carts()`;
    console.log('[job] sp_cleanup_expired_carts OK');
  } catch (err) {
    console.error('[job] sp_cleanup_expired_carts ERROR:', err);
  }
});

// Refresh de vistas materializadas — diario a las 3AM
cron.schedule('0 3 * * *', async () => {
  try {
    await prisma.$executeRaw`SELECT app.fn_refresh_materialized_views()`;
    console.log('[job] fn_refresh_materialized_views OK');
  } catch (err) {
    console.error('[job] fn_refresh_materialized_views ERROR:', err);
  }
});

console.log('[jobs] Scheduled jobs initialized');