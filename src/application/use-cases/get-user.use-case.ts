import type { User } from "../../domain/entities/user.entity";

export interface GetUserUseCase {
    execute(userId: string): Promise<User>;
}

export class GetUserInteractor implements GetUserUseCase {
    async execute(userId: string): Promise<User> {
        // In a real application, this would call a repository
        return {
            id: userId,
            name: "Tracking Tool User",
            email: "user@example.com",
            role: "tracking-tool",
            email_verified_at: null,
            remember_token: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
}
