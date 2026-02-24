import type { SiteRepository } from '../../domain/repositories/interfaces';
import type { Site, CreateSiteRequest } from '../../domain/entities/work-order.entity';

export interface CreateSiteUseCase {
    execute(site: CreateSiteRequest): Promise<Site>;
}

export class CreateSiteInteractor implements CreateSiteUseCase {
    private siteRepository: SiteRepository;

    constructor(siteRepository: SiteRepository) {
        this.siteRepository = siteRepository;
    }

    async execute(site: CreateSiteRequest): Promise<Site> {
        return await this.siteRepository.create(site);
    }
}
