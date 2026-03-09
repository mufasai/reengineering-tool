import type { SiteRepository } from "../../domain/repositories/interfaces";
import type { SiteTeamMember, AddTeamToSiteRequest } from "../../domain/entities/team.entity";

export class AddTeamToSiteInteractor {
    constructor(private siteRepository: SiteRepository) { }

    async execute(siteId: string, request: AddTeamToSiteRequest): Promise<SiteTeamMember> {
        return await this.siteRepository.addTeamToSite(siteId, request);
    }
}
