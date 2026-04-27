import { LibraryRepository } from '../library/library.repository';
import { UserRepository } from '../user/user.repository';
import { StudentRepository } from './student.repository';
import { SubscriptionService } from '../subscription/subscription.service';
import { hashPassword } from '../../utils/hash.util';
import { UserRole } from '../user/user.entity';
import { StudentStatus } from './student.entity';

export class StudentService {
  private libraryRepository: LibraryRepository;
  private userRepository: UserRepository;
  private studentRepository: StudentRepository;
  private subscriptionService: SubscriptionService;

  constructor() {
    this.libraryRepository = new LibraryRepository();
    this.userRepository = new UserRepository();
    this.studentRepository = new StudentRepository();
    this.subscriptionService = new SubscriptionService();
  }

  async createStudent(
    libraryId: string,
    name: string,
    email: string,
    password: string,
    seatNumber: number,
    joinDate: string,
  ) {
    // Step 1: Check billing plan student limit
    const library = await this.libraryRepository.findByIdWithPlan(libraryId);
    if (!library) {
      const err = new Error('Library not found') as Error & { status: number };
      err.status = 404;
      throw err;
    }

    if (library.billingPlan) {
      const { studentLimit } = library.billingPlan;
      if (studentLimit !== null && library.currentStudentCount >= studentLimit) {
        const err = new Error(
          `Student limit reached for the current billing plan (${library.billingPlan.name}). Limit: ${studentLimit}`,
        ) as Error & { status: number };
        err.status = 403;
        throw err;
      }
    }

    // Check email uniqueness
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      const err = new Error('Email already in use') as Error & { status: number };
      err.status = 409;
      throw err;
    }

    // Check seat uniqueness
    const existingSeat = await this.studentRepository.findBySeatAndLibrary(
      libraryId,
      seatNumber,
    );
    if (existingSeat) {
      const err = new Error(
        `Seat number ${seatNumber} is already taken in this library`,
      ) as Error & { status: number };
      err.status = 409;
      throw err;
    }

    // Step 2: Create User with role STUDENT
    const hashed = await hashPassword(password);
    const user = await this.userRepository.save({
      name,
      email,
      password: hashed,
      role: UserRole.STUDENT,
      libraryId,
    });

    // Step 3: Create Student record
    const student = await this.studentRepository.save({
      userId: user.id,
      libraryId,
      seatNumber,
      status: StudentStatus.ACTIVE,
      joinDate,
    });

    // Step 4: Create Subscription
    const subscription = await this.subscriptionService.createSubscription(
      student.id,
      new Date(joinDate),
    );

    // Step 5: Increment library student count
    await this.libraryRepository.incrementStudentCount(libraryId);

    return {
      student: {
        id: student.id,
        seatNumber: student.seatNumber,
        status: student.status,
        joinDate: student.joinDate,
        libraryId: student.libraryId,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      subscription: {
        id: subscription.id,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        nextDueDate: subscription.nextDueDate,
        status: subscription.status,
      },
    };
  }

  async getStudentsByLibrary(libraryId: string) {
    const students = await this.studentRepository.findAllByLibrary(libraryId);
    return students.map((s) => ({
      id: s.id,
      seatNumber: s.seatNumber,
      status: s.status,
      joinDate: s.joinDate,
      createdAt: s.createdAt,
      user: s.user
        ? { id: s.user.id, name: s.user.name, email: s.user.email }
        : null,
    }));
  }

  async getStudentById(id: string, libraryId: string) {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      const err = new Error('Student not found') as Error & { status: number };
      err.status = 404;
      throw err;
    }

    if (student.libraryId !== libraryId) {
      const err = new Error('Access denied') as Error & { status: number };
      err.status = 403;
      throw err;
    }

    return student;
  }

  async getMyProfile(userId: string) {
    const student = await this.studentRepository.findByUserId(userId);
    if (!student) {
      const err = new Error('Student profile not found') as Error & { status: number };
      err.status = 404;
      throw err;
    }
    return student;
  }
}
