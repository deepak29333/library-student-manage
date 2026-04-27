import { AppDataSource } from '../../config/database';
import { Subscription, SubscriptionStatus } from './subscription.entity';

export class SubscriptionRepository {
  private repo = AppDataSource.getRepository(Subscription);

  findByStudentId(studentId: string): Promise<Subscription[]> {
    return this.repo.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }

  findActiveByStudentId(studentId: string): Promise<Subscription | null> {
    return this.repo.findOne({
      where: { studentId, status: SubscriptionStatus.ACTIVE },
    });
  }

  findLatestByStudentId(studentId: string): Promise<Subscription | null> {
    return this.repo.findOne({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }

  save(subscription: Partial<Subscription>): Promise<Subscription> {
    return this.repo.save(subscription);
  }
}
