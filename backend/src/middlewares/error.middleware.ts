import { Context, Next } from 'koa';
import { ValidationError } from 'class-validator';
import { errorResponse } from '../utils/response.util';

export const errorMiddleware = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: unknown) {
    if (Array.isArray(err) && err[0] instanceof ValidationError) {
      const messages = (err as ValidationError[]).flatMap((e) =>
        Object.values(e.constraints ?? {}),
      );
      ctx.status = 400;
      ctx.body = errorResponse(messages.join(', '));
      return;
    }

    if (err instanceof Error) {
      const status = (err as Error & { status?: number }).status ?? 500;
      ctx.status = status;
      ctx.body = errorResponse(err.message || 'Internal server error');
      return;
    }

    ctx.status = 500;
    ctx.body = errorResponse('Internal server error');
  }
};
