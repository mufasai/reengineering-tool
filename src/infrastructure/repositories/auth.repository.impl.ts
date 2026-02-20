import { apiClient } from '../api/api-client';
import type { AuthRepository } from '../../domain/repositories/interfaces';
import type { LoginRequest, LoginResponse } from '../../domain/entities/auth.entity';

const TOKEN_KEY = 'auth_token';

export class AuthRepositoryImpl implements AuthRepository {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>('/api/auth/login', credentials);
    }

    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
        // Clear cookies if any (but we can't do HttpOnly from JS)
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    saveToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }
}
