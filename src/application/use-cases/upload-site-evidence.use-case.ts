import type { SiteEvidence, UploadSiteEvidenceRequest } from "../../domain/entities/site-evidence.entity";
import type { SiteRepository } from "../../domain/repositories/interfaces";

export class UploadSiteEvidenceInteractor {
    constructor(private repository: SiteRepository) { }

    async execute(siteId: string, request: UploadSiteEvidenceRequest): Promise<SiteEvidence> {
        return this.repository.uploadEvidence(siteId, request);
    }
}
