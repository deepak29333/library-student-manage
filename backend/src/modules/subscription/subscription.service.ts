import { SubscriptionRepository } from './subscription.repository';
import { Subscription, SubscriptionStatus } from './subscription.entity';

export class SubscriptionService {
  private subscriptionRepository: SubscriptionRepository;

  constructor() {
    this.subscriptionRepository = new SubscriptionRepository();
  }

  private resolveStatus(subscription: Subscription): Subscription {
    const now = new Date();
    const nextDue = new Date(subscription.nextDueDate);

    if (subscription.status === SubscriptionStatus.ACTIVE && now > nextDue) {
      subscription.status = SubscriptionStatus.EXPIRED;
    }

    return subscription;
  }

  async createSubscription(studentId: string, startDate: Date): Promise<Subscription> {
    const existing = await this.subscriptionRepository.findActiveByStudentId(studentId);
    if (existing) {
      const err = new Error('Student already has an active subscription') as Error & { status: number };
      err.status = 409;
      throw err;
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    const subscription = await this.subscriptionRepository.save({
      studentId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      nextDueDate: endDate.toISOString().split('T')[0],
      status: SubscriptionStatus.ACTIVE,
    });

    return subscription;
  }

  async getSubscriptionByStudentId(studentId: string): Promise<Subscription | null> {
    const subscription = await this.subscriptionRepository.findLatestByStudentId(studentId);
    if (!subscription) return null;
    return this.resolveStatus(subscription);
  }

  async getActiveSubscription(studentId: string): Promise<Subscription | null> {
    const subscription = await this.subscriptionRepository.findActiveByStudentId(studentId);
    if (!subscription) return null;
    return this.resolveStatus(subscription);
  }
}
