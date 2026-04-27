import { AppDataSource } from '../../config/database';
import { User } from './user.entity';

export class UserRepository {
  private repo = AppDataSource.getRepository(User);

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id }, relations: ['library'] });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  save(user: Partial<User>): Promise<User> {
    return this.repo.save(user);
  }
}
