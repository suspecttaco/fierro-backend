import { Router } from 'express';
import { buildsController } from './builds.controller';
import { authenticate } from '../../middleware/auth';
import { optionalAuth } from '../../middleware/optionalAuth';

const router = Router();

router.get('/groups',              buildsController.getGroups);
router.get('/public',              buildsController.getPublicBuilds);
router.get('/share/:token',        buildsController.getBuildByShareToken);

router.post('/',                   authenticate, buildsController.createBuild);
router.get('/my',                  authenticate, buildsController.getBuildsByUser);
router.get('/:id',                 optionalAuth,  buildsController.getBuildById);
router.put('/:id',                 authenticate, buildsController.updateBuild);
router.delete('/:id',              authenticate, buildsController.deleteBuild);
router.post('/:id/items',          authenticate, buildsController.addItem);
router.delete('/:id/items/:itemId',authenticate, buildsController.removeItem);
router.post('/:id/share',          authenticate, buildsController.generateShareToken);
router.post('/:id/compatibility',  authenticate, buildsController.checkCompatibility);

export default router;