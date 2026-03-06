import type { TeamRepository } from '../../infrastructure/repositories/team.repository.impl';
import type { Team } from '../../domain/entities/team.entity';

export class GetTeamsInteractor {
    constructor(private teamRepository: TeamRepository) { }

    async execute(): Promise<Team[]> {
        return await this.teamRepository.findAll();
    }
}
