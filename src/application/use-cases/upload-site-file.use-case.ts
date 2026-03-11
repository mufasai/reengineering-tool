import type { SiteFile, UploadSiteFileRequest } from "../../domain/entities/site-file.entity";
import type { SiteRepository } from "../../domain/repositories/interfaces";

export interface UploadSiteFileUseCase {
    execute(siteId: string, request: UploadSiteFileRequest): Promise<SiteFile>;
}

export class UploadSiteFileInteractor implements UploadSiteFileUseCase {
    constructor(private siteRepository: SiteRepository) { }

    async execute(siteId: string, request: UploadSiteFileRequest): Promise<SiteFile> {
        return this.siteRepository.uploadFile(siteId, request);
    }
}
