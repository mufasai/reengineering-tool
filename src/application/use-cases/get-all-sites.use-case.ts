import type { SiteRepository } from '../../domain/repositories/interfaces';
import type { Site } from '../../domain/entities/work-order.entity';

export interface GetAllSitesUseCase {
    execute(): Promise<Site[]>;
}

export class GetAllSitesInteractor implements GetAllSitesUseCase {
    private siteRepository: SiteRepository;

    constructor(siteRepository: SiteRepository) {
        this.siteRepository = siteRepository;
    }

    async execute(): Promise<Site[]> {
        return await this.siteRepository.findAll();
    }
}
