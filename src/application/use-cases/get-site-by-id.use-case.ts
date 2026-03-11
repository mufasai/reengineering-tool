import type { SiteRepository } from '../../domain/repositories/interfaces';
import type { Site } from '../../domain/entities/work-order.entity';

export interface GetSiteByIdUseCase {
    execute(id: string): Promise<Site>;
}

export class GetSiteByIdInteractor implements GetSiteByIdUseCase {
    private siteRepository: SiteRepository;

    constructor(siteRepository: SiteRepository) {
        this.siteRepository = siteRepository;
    }

    async execute(id: string): Promise<Site> {
        return await this.siteRepository.findById(id);
    }
}
