import type { UserRepository } from '../../domain/repositories/interfaces';
import type { User, UpdateUserRoleRequest } from '../../domain/entities/user.entity';

export class UpdateUserRoleInteractor {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId: string, roleData: UpdateUserRoleRequest): Promise<User> {
        return await this.userRepository.updateRole(userId, roleData);
    }
}
