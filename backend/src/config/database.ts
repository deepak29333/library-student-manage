import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { BillingPlan } from '../modules/billing/billing-plan.entity';
import { Library } from '../modules/library/library.entity';
import { User } from '../modules/user/user.entity';
import { Student } from '../modules/student/student.entity';
import { Subscription } from '../modules/subscription/subscription.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.pass,
  database: env.db.name,
  synchronize: true,
  logging: false,
  entities: [BillingPlan, Library, User, Student, Subscription],
  migrations: [],
  subscribers: [],
});
