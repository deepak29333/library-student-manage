import { AppDataSource } from '../../config/database';
import { BillingPlan } from './billing-plan.entity';

const plans = [
  { name: 'Starter', studentLimit: 100, price: 9.99 },
  { name: 'Growth', studentLimit: 500, price: 29.99 },
  { name: 'Enterprise', studentLimit: null, price: 99.99 },
];

export const seedBillingPlans = async (): Promise<void> => {
  const repo = AppDataSource.getRepository(BillingPlan);

  for (const plan of plans) {
    const existing = await repo.findOneBy({ name: plan.name });
    if (!existing) {
      await repo.save(plan);
      console.log(`  Seeded billing plan: ${plan.name}`);
    }
  }
};
