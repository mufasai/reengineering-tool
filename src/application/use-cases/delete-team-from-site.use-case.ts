import type { SiteRepository } from "../../domain/repositories/interfaces";

export class DeleteTeamFromSiteInteractor {
    constructor(private siteRepository: SiteRepository) { }

    async execute(siteId: string, teamMemberId: string): Promise<void> {
        return await this.siteRepository.deleteTeamFromSite(siteId, teamMemberId);
    }
}
