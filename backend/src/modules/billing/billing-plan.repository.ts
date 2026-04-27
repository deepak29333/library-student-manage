import { AppDataSource } from '../../config/database';
import { BillingPlan } from './billing-plan.entity';

export class BillingPlanRepository {
  private repo = AppDataSource.getRepository(BillingPlan);

  findAll(): Promise<BillingPlan[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<BillingPlan | null> {
    return this.repo.findOneBy({ id });
  }

  findByName(name: string): Promise<BillingPlan | null> {
    return this.repo.findOneBy({ name });
  }

  save(plan: Partial<BillingPlan>): Promise<BillingPlan> {
    return this.repo.save(plan);
  }

  upsert(plan: Partial<BillingPlan>): Promise<BillingPlan> {
    return this.repo.save(plan);
  }
}
