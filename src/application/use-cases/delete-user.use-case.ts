import type { UserRepository } from '../../domain/repositories/interfaces';

export class DeleteUserInteractor {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId: string): Promise<void> {
        return await this.userRepository.delete(userId);
    }
}
