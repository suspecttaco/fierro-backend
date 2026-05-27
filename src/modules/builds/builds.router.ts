import { Router } from 'express';
import { buildsController } from './builds.controller';
import { authenticate } from '../../middleware/auth';
import { optionalAuth } from '../../middleware/optionalAuth';

const router = Router();

router.get('/groups',              buildsController.getGroups);
router.get('/public',              buildsController.getPublicBuilds);
router.get('/share/:token',        buildsController.getBuildByShareToken);

router.post('/',                   authenticate, buildsController.createBuild);
router.get('/',                    authenticate, buildsController.getBuildsByUser);
router.get('/my',                  authenticate, buildsController.getBuildsByUser);
router.get('/:id',                 optionalAuth,  buildsController.getBuildById);
router.put('/:id',                 authenticate, buildsController.updateBuild);
router.delete('/:id',              authenticate, buildsController.deleteBuild);
router.post('/:id/items',          authenticate, buildsController.addItem);
router.delete('/:id/items/:itemId',          authenticate, buildsController.removeItem);
router.delete('/:id/components/:roleSlug',   authenticate, buildsController.removeItemByRoleSlug);
router.post('/:id/share',          authenticate, buildsController.generateShareToken);
router.post('/:id/compatibility',  authenticate, buildsController.checkCompatibility);

// ── IA ────────────────────────────────────────────────────────────────────
router.get( '/:id/ai/sessions',                          authenticate, buildsController.getAiSessions);
router.post('/:id/ai/sessions',                          authenticate, buildsController.createAiSession);
router.get( '/:id/ai/sessions/:sessionId/messages',      authenticate, buildsController.getAiMessages);
router.delete('/:id/ai/sessions/:sessionId',             authenticate, buildsController.deleteAiSession);
router.post('/:id/ai/sessions/:sessionId/chat',          authenticate, buildsController.aiChat);
router.get( '/:id/ai/suggest',                           authenticate, buildsController.aiSuggest);

export default router;