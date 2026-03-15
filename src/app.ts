import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { traceId } from "./middleware/traceId";

// Routers
import healthRouter from './modules/health/health.router';
import authRouter from './modules/auth/auth.router';
import catalogRouter from './modules/catalog/catalog.router';
import buildsRouter from './modules/builds/builds.router';
import cartRouter from './modules/cart/cart.router';
import ordersRouter from './modules/orders/orders.router';
import billingRouter from './modules/billing/billing.router';
import returnsRouter from './modules/returns/returns.router';
import reviewsRouter from './modules/reviews/reviews.router';
import adminRouter from './modules/admin/admin.router';
import notificationsRouter from './modules/notifications/notifications.router';
import addressesRouter from './modules/addresses/addresses.router';
import wishlistRouter from './modules/wishlist/wishlist.router';
import productImagesRouter from './modules/catalog/images/product-images.router';
import productTagsRouter from './modules/catalog/tags/product-tags.router';
import productAttributesRouter from './modules/catalog/attributes/product-attributes.router';
import couponsRouter from './modules/coupons/coupons.router';
import promotionsRouter from './modules/promotions/promotions.router';
import compatRouter from './modules/compat/compat.router';
import auditRouter from './modules/audit/audit.router';
import rolesRouter from './modules/roles/roles.router';

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
app.use('/catalog',  productImagesRouter);
app.use('/catalog',  productTagsRouter);
app.use('/catalog',  productAttributesRouter);
// Coupons
app.use('/coupons',  couponsRouter);
// Promotions
app.use('/promotions', promotionsRouter);
// Builds
app.use('/builds', buildsRouter);
app.use('/compat', compatRouter);
// Cart
app.use('/cart', cartRouter);
// Orders
app.use('/orders', ordersRouter);
// Billing
app.use('/billing', billingRouter);
// Returns
app.use('/returns', returnsRouter);
// Reviews
app.use('/reviews', reviewsRouter);
// Admin
app.use('/admin', adminRouter);
// Notifications
app.use('/notifications', notificationsRouter);
// Addresses
app.use('/users/me/addresses', addressesRouter);
// Wishlist
app.use('/wishlist', wishlistRouter);
// Audit
app.use('/audit', auditRouter);
// Roles
app.use('/roles', rolesRouter);

// Manejador de Errores
app.use(errorHandler);

export default app;