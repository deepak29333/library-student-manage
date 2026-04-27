import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Library } from '../library/library.entity';
import { Student } from '../student/student.entity';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  LIBRARY_ADMIN = 'LIBRARY_ADMIN',
  STUDENT = 'STUDENT',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ nullable: true })
  libraryId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Library, (library) => library.users, { nullable: true })
  @JoinColumn({ name: 'libraryId' })
  library: Library;

  @OneToOne(() => Student, (student) => student.user)
  student: Student;
}
