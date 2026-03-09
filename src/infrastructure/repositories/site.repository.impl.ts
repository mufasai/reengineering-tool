import { apiClient } from "../api/api-client";
import type { SiteRepository } from "../../domain/repositories/interfaces";
import type { Site, CreateSiteRequest, SiteApiResponse, SitesListApiResponse } from "../../domain/entities/work-order.entity";
import type { SiteFile } from "../../domain/entities/site-file.entity";
import type { SiteTeamMember, AddTeamToSiteRequest } from "../../domain/entities/team.entity";

export class SiteRepositoryImpl implements SiteRepository {
    async create(site: CreateSiteRequest): Promise<Site> {
        const response = await apiClient.post<SiteApiResponse>('/api/sites', site);
        return response.data;
    }

    async findByProjectId(projectId: string): Promise<Site[]> {
        const response = await apiClient.get<SitesListApiResponse>(`/api/sites/project/${projectId}`);
        return response.data;
    }

    async findAll(): Promise<Site[]> {
        const response = await apiClient.get<SitesListApiResponse>('/api/sites');
        return response.data;
    }

    async getFiles(siteId: string): Promise<SiteFile[]> {
        const response = await apiClient.get<{ success: boolean; data: SiteFile[] }>(`/api/sites/${siteId}/files`);
        return response.data;
    }

    async getTeamStructure(siteId: string): Promise<SiteTeamMember[]> {
        const response = await apiClient.get<{ success: boolean; data: SiteTeamMember[] }>(`/api/sites/${siteId}/team-structure`);
        return response.data;
    }

    async addTeamToSite(siteId: string, request: AddTeamToSiteRequest): Promise<SiteTeamMember> {
        const response = await apiClient.post<{ success: boolean; data: SiteTeamMember; message: string }>(
            `/api/sites/${siteId}/team-structure`,
            request
        );
        return response.data;
    }

    async deleteTeamFromSite(siteId: string, teamMemberId: string): Promise<void> {
        await apiClient.delete(`/api/sites/${siteId}/team-structure/${teamMemberId}`);
    }
}

export const siteRepository = new SiteRepositoryImpl();
