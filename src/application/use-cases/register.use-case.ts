import type { AuthRepository } from '../../domain/repositories/interfaces';
import type { RegisterRequest, RegisterResponse } from '../../domain/entities/auth.entity';

export interface RegisterUseCase {
    execute(data: RegisterRequest): Promise<RegisterResponse>;
}

export class RegisterInteractor implements RegisterUseCase {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async execute(data: RegisterRequest): Promise<RegisterResponse> {
        return await this.authRepository.register(data);
    }
}
