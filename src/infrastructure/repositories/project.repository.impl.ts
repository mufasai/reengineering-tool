import { apiClient } from "../api/api-client";
import type { ProjectRepository } from "../../domain/repositories/interfaces";
import type { Project, ApiResponse, CreateProjectRequest, UpdateProjectRequest, ImportProjectRequest, ImportProjectResponse } from "../../domain/entities/project.entity";
import type { ProjectFile, ProjectFilesApiResponse, UploadProjectFileRequest, UploadProjectFileResponse } from "../../domain/entities/project-file.entity";

export class ProjectRepositoryImpl implements ProjectRepository {
    async findAll(): Promise<Project[]> {
        const response = await apiClient.get<ApiResponse<Project[]>>('/api/projects');
        return response.data;
    }

    async findById(id: string): Promise<Project> {
        const rawId = id.includes(':') ? id.split(':').pop()! : id;
        const response = await apiClient.get<ApiResponse<Project>>(`/api/projects/${rawId}`);
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

    async update(id: string, project: UpdateProjectRequest): Promise<Project> {
        const rawId = id.includes(':') ? id.split(':').pop()! : id;
        const response = await apiClient.put<ApiResponse<Project>>(`/api/projects/${rawId}`, project);
        return response.data;
    }

    async getFiles(projectId: string): Promise<ProjectFile[]> {
        // Extract raw ID from SurrealDB format (e.g., "projects:abc123" → "abc123")
        const rawId = projectId.includes(':') ? projectId.split(':').pop()! : projectId;
        const response = await apiClient.get<ProjectFilesApiResponse>(`/api/projects/${rawId}/files`);
        return response.data;
    }

    async uploadFile(projectId: string, request: UploadProjectFileRequest): Promise<ProjectFile> {
        // Extract raw ID from SurrealDB format
        const rawId = projectId.includes(':') ? projectId.split(':').pop()! : projectId;

        // Create FormData
        const formData = new FormData();
        formData.append('file', request.file);
        formData.append('title', request.title);

        const response = await apiClient.postFormData<UploadProjectFileResponse>(
            `/api/projects/${rawId}/upload`,
            formData
        );
        return response.data;
    }

    async importFromExcel(request: ImportProjectRequest): Promise<ImportProjectResponse> {
        const formData = new FormData();
        formData.append('file', request.file);
        if (request.projectType) {
            formData.append('project_type', request.projectType);
        }

        const response = await apiClient.postFormData<ImportProjectResponse>(
            '/api/projects/import-excel',
            formData
        );
        return response;
    }
}

export const projectRepository = new ProjectRepositoryImpl();
