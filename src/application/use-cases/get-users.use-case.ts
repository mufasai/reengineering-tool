import type { UserRepository } from '../../domain/repositories/interfaces';
import type { User } from '../../domain/entities/user.entity';

export class GetUsersInteractor {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(): Promise<User[]> {
        return await this.userRepository.findAll();
    }
}
