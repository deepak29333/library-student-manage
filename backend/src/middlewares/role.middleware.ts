import { Context, Next } from 'koa';
import { UserRole } from '../modules/user/user.entity';

const requireRole = (role: UserRole) => async (ctx: Context, next: Next) => {
  const user = ctx.state.user;

  if (!user) {
    ctx.status = 401;
    ctx.body = { success: false, message: 'Unauthorized', data: null };
    return;
  }

  if (user.role !== role) {
    ctx.status = 403;
    ctx.body = { success: false, message: `Forbidden: requires ${role} role`, data: null };
    return;
  }

  await next();
};

export const isSuperAdmin = requireRole(UserRole.SUPER_ADMIN);
export const isLibraryAdmin = requireRole(UserRole.LIBRARY_ADMIN);
export const isStudent = requireRole(UserRole.STUDENT);
