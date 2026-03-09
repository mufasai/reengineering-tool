import type { SiteRepository } from "../../domain/repositories/interfaces";
import type { SiteTeamMember } from "../../domain/entities/team.entity";

export class GetSiteTeamStructureInteractor {
    constructor(private siteRepository: SiteRepository) { }

    async execute(siteId: string): Promise<SiteTeamMember[]> {
        return await this.siteRepository.getTeamStructure(siteId);
    }
}
