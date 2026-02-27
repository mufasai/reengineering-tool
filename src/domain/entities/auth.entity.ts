import type { User } from './user.entity';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: {
        id?: string;
        email: string;
        name: string; // Changed from nama to name
        role: string;
    };
    message: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role: string; // Required field for role selection
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}
