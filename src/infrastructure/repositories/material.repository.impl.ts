import type { MaterialRepository } from '../../domain/repositories/interfaces';
import type { Material, MaterialTransaction, CreateMaterialRequest } from '../../domain/entities/material.entity';
import { apiClient } from '../api/api-client';

export class MaterialRepositoryImpl implements MaterialRepository {
    async findByWorkOrder(workOrderId: string): Promise<MaterialTransaction[]> {
        throw new Error('Not implemented');
    }

    async saveTransaction(transaction: MaterialTransaction): Promise<void> {
        throw new Error('Not implemented');
    }

    async findBySiteId(siteId: string): Promise<Material[]> {
        const response = await apiClient.get<{ success: boolean; data: Material[] }>(`/api/materials/site/${siteId}`);
        return response.data;
    }

    async create(material: CreateMaterialRequest): Promise<Material> {
        const response = await apiClient.post<{ success: boolean; data: Material; message: string }>('/api/materials', material);
        return response.data;
    }
}
