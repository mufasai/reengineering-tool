import type { UserRepository } from '../../domain/repositories/interfaces';
import type { User, UpdateUserRoleRequest, GetUsersResponse, UpdateUserRoleResponse, DeleteUserResponse } from '../../domain/entities/user.entity';
import { apiClient } from '../api/api-client';

export class UserRepositoryImpl implements UserRepository {
    async findAll(): Promise<User[]> {
        try {
            const response = await apiClient.get<GetUsersResponse>('/api/users');

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch users');
            }

            return response.data;
        } catch (error: any) {
            console.error('Failed to fetch users:', error);
            throw new Error(error.message || 'Failed to fetch users');
        }
    }

    async updateRole(userId: string, roleData: UpdateUserRoleRequest): Promise<User> {
        try {
            // Extract ID without prefix if it has one
            const idOnly = userId.includes(':') ? userId.split(':')[1] : userId;

            const response = await apiClient.put<UpdateUserRoleResponse>(
                `/api/users/${idOnly}`,
                roleData
            );

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to update user role');
            }

            return response.data;
        } catch (error: any) {
            console.error('Failed to update user role:', error);
            throw new Error(error.message || 'Failed to update user role');
        }
    }

    async delete(userId: string): Promise<void> {
        try {
            // Extract ID without prefix if it has one
            const idOnly = userId.includes(':') ? userId.split(':')[1] : userId;

            const response = await apiClient.delete<DeleteUserResponse>(
                `/api/users/${idOnly}`
            );

            if (!response.success) {
                throw new Error(response.message || 'Failed to delete user');
            }
        } catch (error: any) {
            console.error('Failed to delete user:', error);
            throw new Error(error.message || 'Failed to delete user');
        }
    }
}
