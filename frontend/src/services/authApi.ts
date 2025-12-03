import axios, { AxiosInstance } from 'axios';
import { LOGIN_API_BASE_URL } from '../config/api';
import type { User, LoginRequest, RegisterRequest } from '../types';

const authApi: AxiosInstance = axios.create({
  baseURL: LOGIN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.post<LoginResponse>('/users/login', credentials);
    console.log('Auth API response:', response.data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await authApi.post<RefreshTokenResponse>('/users/refresh', {
      refresh_token: refreshToken,
    });
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

  getAllUsers: async (skip: number = 0, limit: number = 100): Promise<User[]> => {
    const response = await authApi.get<User[]>('/users/', {
      params: { skip, limit },
    });
    return response.data;
  },
};

export default authService;





