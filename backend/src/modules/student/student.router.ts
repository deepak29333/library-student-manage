import Router from 'koa-router';
import { StudentController } from './student.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isLibraryAdmin, isStudent } from '../../middlewares/role.middleware';

const router = new Router({ prefix: '/api' });
const controller = new StudentController();

// Library Admin routes
router.post('/students', authMiddleware, isLibraryAdmin, controller.createStudent);
router.get('/students', authMiddleware, isLibraryAdmin, controller.getStudents);
router.get('/students/:id', authMiddleware, isLibraryAdmin, controller.getStudentById);

// Student routes
router.get('/me', authMiddleware, isStudent, controller.getMyProfile);
router.get('/my-subscription', authMiddleware, isStudent, controller.getMySubscription);

export default router;
