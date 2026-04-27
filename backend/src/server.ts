import 'reflect-metadata';
import 'dotenv/config';
import { AppDataSource } from './config/database';
import { seedBillingPlans } from './modules/billing/billing-plan.seed';
import { seedSuperAdmin } from './modules/user/user.seed';
import { env } from './config/env';
import app from './app';

const bootstrap = async () => {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    console.log('Database connected and schema synchronized.');

    console.log('Seeding billing plans...');
    await seedBillingPlans();
    console.log('Seeding super admin...');
    await seedSuperAdmin();
    console.log('Seeding complete.');

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();
