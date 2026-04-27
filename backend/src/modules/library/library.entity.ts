import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BillingPlan } from '../billing/billing-plan.entity';
import { User } from '../user/user.entity';
import { Student } from '../student/student.entity';

@Entity('libraries')
export class Library {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int', default: 0 })
  currentStudentCount: number;

  @Column({ nullable: true })
  billingPlanId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => BillingPlan, (plan) => plan.libraries, { nullable: true, eager: false })
  @JoinColumn({ name: 'billingPlanId' })
  billingPlan: BillingPlan;

  @OneToMany(() => User, (user) => user.library)
  users: User[];

  @OneToMany(() => Student, (student) => student.library)
  students: Student[];
}
