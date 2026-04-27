import api from './axios';
import type { ApiResponse, Student } from '../types';

export const getStudents = async (): Promise<Student[]> => {
  const { data } = await api.get<ApiResponse<Student[]>>('/students');
  return data.data;
};

export const getStudentById = async (id: string): Promise<Student> => {
  const { data } = await api.get<ApiResponse<Student>>(`/students/${id}`);
  return data.data;
};

export const createStudent = async (payload: {
  name: string;
  email: string;
  password: string;
  seatNumber: number;
  joinDate: string;
}): Promise<Student> => {
  const { data } = await api.post<ApiResponse<Student>>('/students', payload);
  return data.data;
};

export const getMyProfile = async (): Promise<Student> => {
  const { data } = await api.get<ApiResponse<Student>>('/me');
  return data.data;
};
