import type { MaterialRepository } from '../../domain/repositories/interfaces';
import type { Material, CreateMaterialRequest } from '../../domain/entities/material.entity';

export class CreateMaterialInteractor {
    private materialRepository: MaterialRepository;

    constructor(materialRepository: MaterialRepository) {
        this.materialRepository = materialRepository;
    }

    async execute(material: CreateMaterialRequest): Promise<Material> {
        return await this.materialRepository.create(material);
    }
}
