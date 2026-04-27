import { AppDataSource } from '../../config/database';
import { User, UserRole } from './user.entity';
import { hashPassword } from '../../utils/hash.util';

const SUPER_ADMIN = {
  name: 'Super Admin',
  email: 'superadmin@libraryos.com',
  password: 'superadmin123',
  role: UserRole.SUPER_ADMIN,
};

export const seedSuperAdmin = async (): Promise<void> => {
  const repo = AppDataSource.getRepository(User);

  const existing = await repo.findOneBy({ email: SUPER_ADMIN.email });
  if (!existing) {
    const hashed = await hashPassword(SUPER_ADMIN.password);
    await repo.save({ ...SUPER_ADMIN, password: hashed });
    console.log(`  Seeded super admin: ${SUPER_ADMIN.email} / ${SUPER_ADMIN.password}`);
  }
};
