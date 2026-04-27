import Router from 'koa-router';
import { AuthController } from './auth.controller';

const router = new Router({ prefix: '/api/auth' });
const controller = new AuthController();

router.post('/login', controller.login);

export default router;
