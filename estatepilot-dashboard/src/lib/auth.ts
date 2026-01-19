import { api, setAuthToken, removeAuthToken } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    role: string;
  };
}

export const auth = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data.data;
    
    if (token) {
      setAuthToken(token);
    }
    
    return response.data.data;
  },
  
  async logout(): Promise<void> {
    removeAuthToken();
  },
  
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },
  
  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  }
};
