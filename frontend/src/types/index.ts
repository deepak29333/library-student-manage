export type UserRole = 'SUPER_ADMIN' | 'LIBRARY_ADMIN' | 'STUDENT';
export type StudentStatus = 'ACTIVE' | 'EXPIRED';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED';

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
  libraryId: string | null;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    libraryId: string | null;
  };
}

export interface BillingPlan {
  id: string;
  name: string;
  studentLimit: number | null;
  price: number;
  createdAt: string;
}

export interface Library {
  id: string;
  name: string;
  currentStudentCount: number;
  billingPlanId: string | null;
  billingPlan: BillingPlan | null;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  libraryId: string | null;
  createdAt: string;
}

export interface Student {
  id: string;
  userId: string;
  libraryId: string;
  seatNumber: number;
  status: StudentStatus;
  joinDate: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  library?: Library;
  subscriptions?: Subscription[];
}

export interface Subscription {
  id: string;
  studentId: string;
  startDate: string;
  endDate: string;
  nextDueDate: string;
  status: SubscriptionStatus;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
