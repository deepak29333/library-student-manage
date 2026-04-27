import { LibraryRepository } from './library.repository';
import { BillingPlanRepository } from '../billing/billing-plan.repository';
import { UserRepository } from '../user/user.repository';
import { hashPassword } from '../../utils/hash.util';
import { UserRole } from '../user/user.entity';

export class LibraryService {
  private libraryRepository: LibraryRepository;
  private billingPlanRepository: BillingPlanRepository;
  private userRepository: UserRepository;

  constructor() {
    this.libraryRepository = new LibraryRepository();
    this.billingPlanRepository = new BillingPlanRepository();
    this.userRepository = new UserRepository();
  }

  async createLibrary(name: string) {
    const library = await this.libraryRepository.save({ name });
    return library;
  }

  async getAllLibraries() {
    return this.libraryRepository.findAll();
  }

  async createLibraryAdmin(
    name: string,
    email: string,
    password: string,
    libraryId: string,
  ) {
    const library = await this.libraryRepository.findById(libraryId);
    if (!library) {
      const err = new Error('Library not found') as Error & { status: number };
      err.status = 404;
      throw err;
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('Email already in use') as Error & { status: number };
      err.status = 409;
      throw err;
    }

    const hashed = await hashPassword(password);
    const admin = await this.userRepository.save({
      name,
      email,
      password: hashed,
      role: UserRole.LIBRARY_ADMIN,
      libraryId,
    });

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      libraryId: admin.libraryId,
      createdAt: admin.createdAt,
    };
  }

  async assignPlan(libraryId: string, billingPlanId: string) {
    const library = await this.libraryRepository.findById(libraryId);
    if (!library) {
      const err = new Error('Library not found') as Error & { status: number };
      err.status = 404;
      throw err;
    }

    const plan = await this.billingPlanRepository.findById(billingPlanId);
    if (!plan) {
      const err = new Error('Billing plan not found') as Error & { status: number };
      err.status = 404;
      throw err;
    }

    const updated = await this.libraryRepository.save({
      ...library,
      billingPlanId,
    });

    return updated;
  }

  async getAllBillingPlans() {
    return this.billingPlanRepository.findAll();
  }
}
