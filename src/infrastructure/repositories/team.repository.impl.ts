import { apiClient } from '../api/api-client';
import type { Team, UploadTeamsRequest, UploadTeamsResponse } from '../../domain/entities/team.entity';

export interface TeamRepository {
    findAll(): Promise<Team[]>;
    uploadTeams(request: UploadTeamsRequest): Promise<UploadTeamsResponse>;
}

export class TeamRepositoryImpl implements TeamRepository {
    async findAll(): Promise<Team[]> {
        const response = await apiClient.get<{ success: boolean; data: Team[]; message: string | null }>('/api/teams');
        return response.data;
    }

    async uploadTeams(request: UploadTeamsRequest): Promise<UploadTeamsResponse> {
        const formData = new FormData();
        formData.append('file', request.file);

        const response = await apiClient.postFormData<UploadTeamsResponse>('/api/teams/upload', formData);
        return response;
    }
}

export const teamRepository = new TeamRepositoryImpl();
