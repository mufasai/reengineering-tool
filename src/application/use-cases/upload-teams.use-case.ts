import type { TeamRepository } from '../../infrastructure/repositories/team.repository.impl';
import type { UploadTeamsRequest, UploadTeamsResponse } from '../../domain/entities/team.entity';

export class UploadTeamsInteractor {
    constructor(private teamRepository: TeamRepository) { }

    async execute(request: UploadTeamsRequest): Promise<UploadTeamsResponse> {
        return await this.teamRepository.uploadTeams(request);
    }
}
