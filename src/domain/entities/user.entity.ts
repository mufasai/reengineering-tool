export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    remember_token: string | null;
    created_at: string;
    updated_at: string;
}

export interface UpdateUserRoleRequest {
    name?: string;
    role: string;
}

export interface GetUsersResponse {
    success: boolean;
    data: User[];
    message: string | null;
}

export interface UpdateUserRoleResponse {
    success: boolean;
    data: User;
    message: string | null;
}

export interface DeleteUserResponse {
    success: boolean;
    message: string | null;
}
