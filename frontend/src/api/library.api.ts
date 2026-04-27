import api from './axios';
import type { ApiResponse, BillingPlan, Library } from '../types';

export const getLibraries = async (): Promise<Library[]> => {
  const { data } = await api.get<ApiResponse<Library[]>>('/libraries');
  return data.data;
};

export const createLibrary = async (name: string): Promise<Library> => {
  const { data } = await api.post<ApiResponse<Library>>('/libraries', { name });
  return data.data;
};

export const createLibraryAdmin = async (payload: {
  name: string;
  email: string;
  password: string;
  libraryId: string;
}) => {
  const { data } = await api.post('/library-admins', payload);
  return data.data;
};

export const assignPlan = async (
  libraryId: string,
  billingPlanId: string,
): Promise<Library> => {
  const { data } = await api.post<ApiResponse<Library>>('/assign-plan', {
    libraryId,
    billingPlanId,
  });
  return data.data;
};

export const getBillingPlans = async (): Promise<BillingPlan[]> => {
  const { data } = await api.get<ApiResponse<BillingPlan[]>>('/billing-plans');
  return data.data;
};
