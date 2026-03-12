import type { SiteRepository } from '../../domain/repositories/interfaces';
import type { Site, UpdateSiteStageRequest } from '../../domain/entities/work-order.entity';

export class UpdateSiteStageInteractor {
    constructor(private siteRepository: SiteRepository) {}

    async execute(siteId: string, request: UpdateSiteStageRequest): Promise<Site> {
        return await this.siteRepository.updateStage(siteId, request);
    }
}
