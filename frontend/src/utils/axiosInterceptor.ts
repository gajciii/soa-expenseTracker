import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getCookie, setCookie, deleteCookie } from './cookies';
import { authService } from '../services/authApi';

// Helper funkcija za dodajanje interceptorjev na axios instanco
export const addInterceptors = (axiosInstance: AxiosInstance) => {
  // Request interceptor - dodaj Bearer token
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const isPublicEndpoint =
        config.url?.includes('/users/login') ||
        config.url?.includes('/users/register') ||
        config.url?.includes('/users/refresh');

      if (!isPublicEndpoint) {
        const accessToken = getCookie('access_token');
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - refresh token če je potreben
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = getCookie('refresh_token');
        if (refreshToken) {
          try {
            const response = await authService.refreshToken(refreshToken);
            setCookie('access_token', response.access_token, 1);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
            }

            return axiosInstance(originalRequest);
          } catch (refreshError) {
            deleteCookie('access_token');
            deleteCookie('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
          deleteCookie('access_token');
          deleteCookie('refresh_token');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

const setupAxiosInterceptor = () => {
  // Dodaj interceptorje na globalno axios instanco
  addInterceptors(axios);
};

export default setupAxiosInterceptor;
