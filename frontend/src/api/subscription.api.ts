import api from './axios';
import type { ApiResponse, Subscription } from '../types';

export const getMySubscription = async (): Promise<Subscription> => {
  const { data } = await api.get<ApiResponse<Subscription>>('/my-subscription');
  return data.data;
};
