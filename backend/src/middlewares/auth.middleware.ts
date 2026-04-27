import { Context, Next } from 'koa';
import { verifyToken } from '../utils/jwt.util';

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { success: false, message: 'Unauthorized: No token provided', data: null };
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    ctx.state.user = payload;
    await next();
  } catch {
    ctx.status = 401;
    ctx.body = { success: false, message: 'Unauthorized: Invalid or expired token', data: null };
  }
};
