import type { SiteRepository } from '../../domain/repositories/interfaces';
import type { Site } from '../../domain/entities/work-order.entity';

export interface GetSitesByProjectUseCase {
    execute(projectId: string): Promise<Site[]>;
}

export class GetSitesByProjectInteractor implements GetSitesByProjectUseCase {
    private siteRepository: SiteRepository;

    constructor(siteRepository: SiteRepository) {
        this.siteRepository = siteRepository;
    }

    async execute(projectId: string): Promise<Site[]> {
        return await this.siteRepository.findByProjectId(projectId);
    }
}
