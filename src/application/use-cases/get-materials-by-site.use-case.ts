import type { MaterialRepository } from '../../domain/repositories/interfaces';
import type { Material } from '../../domain/entities/material.entity';

export class GetMaterialsBySiteInteractor {
    private materialRepository: MaterialRepository;

    constructor(materialRepository: MaterialRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(siteId: string): Promise<Material[]> {
        return await this.materialRepository.findBySiteId(siteId);
    }
}
