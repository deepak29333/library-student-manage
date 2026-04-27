import api from './axios';
import type { ApiResponse, LoginResponse } from '../types';

export const loginApi = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
    email,
    password,
  });
  return data.data;
};
