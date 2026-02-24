import { apiClient } from "../api/api-client";
import type { SiteRepository } from "../../domain/repositories/interfaces";
import type { Site, CreateSiteRequest, SiteApiResponse, SitesListApiResponse } from "../../domain/entities/work-order.entity";

export class SiteRepositoryImpl implements SiteRepository {
    async create(site: CreateSiteRequest): Promise<Site> {
        const response = await apiClient.post<SiteApiResponse>('/api/sites', site);
        return response.data;
    }

    async findByProjectId(projectId: string): Promise<Site[]> {
        const response = await apiClient.get<SitesListApiResponse>(`/api/sites/project/${projectId}`);
        return response.data;
    }
}

export const siteRepository = new SiteRepositoryImpl();
