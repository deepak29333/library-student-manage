import Router from 'koa-router';
import { LibraryController } from './library.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isSuperAdmin } from '../../middlewares/role.middleware';

const router = new Router({ prefix: '/api' });
const controller = new LibraryController();

router.get('/billing-plans', authMiddleware, controller.getAllBillingPlans);

router.post('/libraries', authMiddleware, isSuperAdmin, controller.createLibrary);
router.get('/libraries', authMiddleware, isSuperAdmin, controller.getAllLibraries);
router.post('/library-admins', authMiddleware, isSuperAdmin, controller.createLibraryAdmin);
router.post('/assign-plan', authMiddleware, isSuperAdmin, controller.assignPlan);

export default router;
