import { apiClient } from "../api/api-client";
import type { ProjectRepository } from "../../domain/repositories/interfaces";
import type { Project, ApiResponse, CreateProjectRequest } from "../../domain/entities/project.entity";

export class ProjectRepositoryImpl implements ProjectRepository {
    async findAll(): Promise<Project[]> {
        const response = await apiClient.get<ApiResponse<Project[]>>('/api/projects');
        return response.data;
    }

    async create(project: CreateProjectRequest): Promise<Project> {
        const response = await apiClient.post<ApiResponse<Project>>('/api/projects', project);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        // Strip SurrealDB table prefix (e.g. "projects:abc123" → "abc123")
        const rawId = id.includes(':') ? id.split(':').pop()! : id;
        await apiClient.delete<ApiResponse<string>>(`/api/projects/${rawId}`);
    }
}

export const projectRepository = new ProjectRepositoryImpl();
