import type { SiteEvidence } from "../../domain/entities/site-evidence.entity";
import type { SiteRepository } from "../../domain/repositories/interfaces";

export class GetSiteEvidenceInteractor {
    constructor(private repository: SiteRepository) { }

    async execute(siteId: string): Promise<SiteEvidence[]> {
        return this.repository.getEvidence(siteId);
    }
}
