import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Library } from '../library/library.entity';

@Entity('billing_plans')
export class BillingPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int', nullable: true })
  studentLimit: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Library, (library) => library.billingPlan)
  libraries: Library[];
}
