export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}