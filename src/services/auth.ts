// services/auth.ts
import Cookies from 'js-cookie';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

let updateUserCallback: (() => void) | null = null;

export const setUpdateUserCallback = (callback: () => void) => {
  updateUserCallback = callback;
};

export class AuthService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  static async login(credentials: LoginData): Promise<LoginResponse> {
    console.log('Login request:', credentials);
    const response = await fetch(`${this.baseUrl}/api/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('Login response status:', response.status);
    if (!response.ok) {
      const error = await response.json();
      console.error('Login error:', error);
      throw new Error(error.detail || 'Error al iniciar sesión');
    }

    const data = await response.json();
    console.log('Login response data:', data);
    // Guardar tokens en cookies
    Cookies.set('auth-token', data.access, { path: '/' });
    Cookies.set('refresh-token', data.refresh, { path: '/' });
    
    // Actualizar el usuario inmediatamente
    if (updateUserCallback) {
      updateUserCallback();
    }
    return data;
  }

  static async register(data: RegisterData): Promise<void> {
    console.log('Register request:', data);
    const response = await fetch(`${this.baseUrl}/api/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Register response status:', response.status);
    if (!response.ok) {
      const error = await response.json();
      console.error('Register error:', error);
      throw new Error(Object.values(error).join(', ') || 'Error en el registro');
    }

    const responseData = await response.json();
    console.log('Register response data:', responseData);
    return responseData;
  }

  static async refreshToken(): Promise<string | null> {
    const refresh = Cookies.get('refresh-token');
    if (!refresh) return null;

    console.log('Refresh token request');
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      });

      console.log('Refresh token response status:', response.status);
      if (!response.ok) throw new Error('Failed to refresh token');

      const data = await response.json();
      console.log('Refresh token response data:', data);
      Cookies.set('auth-token', data.access, { path: '/' });
      return data.access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    console.log('Logout request');
    Cookies.remove('auth-token', { path: '/' });
    Cookies.remove('refresh-token', { path: '/' });
    console.log('Logout successful');
  }

  static getAuthHeaders(): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    
    const token = Cookies.get('auth-token');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    
    console.log('Auth headers:', headers);
    return headers;
  }
}