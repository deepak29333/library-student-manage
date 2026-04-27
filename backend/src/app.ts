import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import { errorMiddleware } from './middlewares/error.middleware';
import authRouter from './modules/auth/auth.router';
import libraryRouter from './modules/library/library.router';
import studentRouter from './modules/student/student.router';

const app = new Koa();

app.use(helmet());
app.use(errorMiddleware);
app.use(bodyParser());

app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(libraryRouter.routes()).use(libraryRouter.allowedMethods());
app.use(studentRouter.routes()).use(studentRouter.allowedMethods());

app.use(async (ctx) => {
  if (ctx.status === 404) {
    ctx.body = { success: false, message: 'Route not found', data: null };
  }
});

export default app;
