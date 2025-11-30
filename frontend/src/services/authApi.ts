import axios, { AxiosInstance } from 'axios';
import { LOGIN_API_BASE_URL } from '../config/api';
import type { User, LoginRequest, RegisterRequest } from '../types';

const authApi: AxiosInstance = axios.create({
  baseURL: LOGIN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (credentials: LoginRequest): Promise<User> => {
    const response = await authApi.post<User>('/users/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<{ message: string; user_id: string }> => {
    const response = await authApi.post<{ message: string; user_id: string }>('/users/register', userData);
    return response.data;
  },

  getUser: async (userId: string): Promise<User> => {
    const response = await authApi.get<User>(`/users/${userId}`);
    return response.data;
  },
};

export default authService;





