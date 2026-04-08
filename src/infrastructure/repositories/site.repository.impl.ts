import { apiClient } from "../api/api-client";
import type { SiteRepository } from "../../domain/repositories/interfaces";
import type { Site, CreateSiteRequest, UpdateSiteStageRequest } from "../../domain/entities/work-order.entity";
import type { ApiResponse } from "../../domain/entities/project.entity";
import type { SiteFile, UploadSiteFileRequest, SiteFilesApiResponse, UploadSiteFileResponse } from "../../domain/entities/site-file.entity";
import type { SiteEvidence, UploadSiteEvidenceRequest, SiteEvidenceApiResponse, CreateEvidenceApiResponse } from "../../domain/entities/site-evidence.entity";
import type { SiteTeamMember, AddTeamToSiteRequest } from "../../domain/entities/team.entity";

export class SiteRepositoryImpl implements SiteRepository {
    async create(site: CreateSiteRequest): Promise<Site> {
        const response = await apiClient.post<ApiResponse<Site>>('/api/sites', site);
        return response.data;
    }

    async findByProjectId(projectId: string): Promise<Site[]> {
        const response = await apiClient.get<ApiResponse<Site[]>>(`/api/projects/${projectId}/sites`);
        return response.data;
    }

    async findAll(): Promise<Site[]> {
        const response = await apiClient.get<ApiResponse<Site[]>>('/api/sites');
        return response.data;
    }

    async findById(id: string): Promise<Site> {
        const response = await apiClient.get<ApiResponse<Site>>(`/api/sites/${id}`);
        return response.data;
    }

    async getFiles(siteId: string): Promise<SiteFile[]> {
        const response = await apiClient.get<SiteFilesApiResponse>(`/api/sites/${siteId}/files`);
        return response.data;
    }

    async uploadFile(siteId: string, request: UploadSiteFileRequest): Promise<SiteFile> {
        const formData = new FormData();
        formData.append('file', request.file);
        formData.append('title', request.title);

        const response = await apiClient.postFormData<UploadSiteFileResponse>(
            `/api/sites/${siteId}/upload`,
            formData
        );
        return response.data;
    }

    async getEvidence(siteId: string): Promise<SiteEvidence[]> {
        const response = await apiClient.get<SiteEvidenceApiResponse>(`/api/sites/${siteId}/evidence`);
        return response.data;
    }

    async uploadEvidence(siteId: string, request: UploadSiteEvidenceRequest): Promise<SiteEvidence> {
        const formData = new FormData();
        formData.append('file', request.file);
        formData.append('progress_tag', request.progress_tag);
        if (request.stage_context) {
            formData.append('stage_context', request.stage_context);
        }
        formData.append('uploaded_by', request.uploaded_by);

        const response = await apiClient.postFormData<CreateEvidenceApiResponse>(`/api/sites/${siteId}/evidence`, formData);
        return response.data;
    }

    async getTeamStructure(siteId: string): Promise<SiteTeamMember[]> {
        const response = await apiClient.get<ApiResponse<SiteTeamMember[]>>(`/api/sites/${siteId}/teams`);
        return response.data;
    }

    async addTeamToSite(siteId: string, request: AddTeamToSiteRequest): Promise<SiteTeamMember> {
        const response = await apiClient.post<ApiResponse<SiteTeamMember>>(`/api/sites/${siteId}/teams`, request);
        return response.data;
    }

    async deleteTeamFromSite(siteId: string, teamMemberId: string): Promise<void> {
        const rawTeamId = teamMemberId.includes(':') ? teamMemberId.split(':').pop()! : teamMemberId;
        await apiClient.delete(`/api/sites/${siteId}/teams/${rawTeamId}`);
    }

    async updateStage(siteId: string, request: UpdateSiteStageRequest): Promise<Site> {
        const formData = new FormData();

        // Add all fields from request to formData
        Object.keys(request).forEach(key => {
            const value = request[key];

            // Skip files array - will be handled separately
            if (key === 'files') return;

            // Only add if value exists (concentrate on filled values)
            if (value !== null && value !== undefined && value !== '') {
                if (typeof value === 'boolean') {
                    formData.append(key, value.toString());
                } else if (typeof value === 'object' && !(value instanceof File)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        // Handle file uploads if present
        if (request.files && Array.isArray(request.files)) {
            request.files.forEach((file: File) => {
                formData.append('files[]', file);
            });
        }

        const response = await apiClient.putFormData<ApiResponse<Site>>(`/api/sites/${siteId}/stage`, formData);
        return response.data;
    }
}


export const siteRepository = new SiteRepositoryImpl();
