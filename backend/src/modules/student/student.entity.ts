import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Library } from '../library/library.entity';
import { Subscription } from '../subscription/subscription.entity';

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

@Entity('students')
@Unique(['libraryId', 'seatNumber'])
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  libraryId: string;

  @Column({ type: 'int' })
  seatNumber: number;

  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  status: StudentStatus;

  @Column({ type: 'date' })
  joinDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.student)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Library, (library) => library.students)
  @JoinColumn({ name: 'libraryId' })
  library: Library;

  @OneToMany(() => Subscription, (subscription) => subscription.student)
  subscriptions: Subscription[];
}
