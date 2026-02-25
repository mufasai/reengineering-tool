import type { SiteRepository } from '../../domain/repositories/interfaces';
import type { SiteFile } from '../../domain/entities/site-file.entity';

export class GetSiteFilesInteractor {
    private siteRepository: SiteRepository;

    constructor(siteRepository: SiteRepository) {
        this.siteRepository = siteRepository;
    }

    async execute(siteId: string): Promise<SiteFile[]> {
        return await this.siteRepository.getFiles(siteId);
    }
}
