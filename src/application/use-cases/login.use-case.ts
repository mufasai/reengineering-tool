import type { AuthRepository } from '../../domain/repositories/interfaces';
import type { LoginRequest, LoginResponse } from '../../domain/entities/auth.entity';

export interface LoginUseCase {
    execute(credentials: LoginRequest): Promise<LoginResponse>;
}

export class LoginInteractor implements LoginUseCase {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async execute(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await this.authRepository.login(credentials);
        if (response.success && response.token) {
            this.authRepository.saveToken(response.token);
        }
        return response;
    }
}
