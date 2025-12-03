import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authApi';
import { setCookie, getCookie, deleteCookie } from '../utils/cookies';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshAccessToken = async (refreshToken: string): Promise<void> => {
    try {
      const response = await authService.refreshToken(refreshToken);
      setCookie('access_token', response.access_token, 1);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setUser(null);
      localStorage.removeItem('user');
      deleteCookie('access_token');
      deleteCookie('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    deleteCookie('access_token');
    deleteCookie('refresh_token');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = getCookie('access_token');
    const refreshToken = getCookie('refresh_token');
    
    if (storedUser && accessToken) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        deleteCookie('access_token');
        deleteCookie('refresh_token');
        setLoading(false);
      }
    } else if (refreshToken && !accessToken) {
      refreshAccessToken(refreshToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      
      if (!response || !response.access_token || !response.refresh_token) {
        console.error('Invalid response:', response);
        throw new Error('Invalid response: missing tokens');
      }
      
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      setCookie('access_token', response.access_token, 1);
      setCookie('refresh_token', response.refresh_token, 7);
      
      console.log('Tokens set in cookies');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      await authService.register(userData);
      await login({ username: userData.username, password: userData.password });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};





