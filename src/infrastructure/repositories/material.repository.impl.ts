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

    async findAll(): Promise<Material[]> {
        const response = await apiClient.get<{ success: boolean; data: Material[] }>('/api/materials');
        return response.data;
    }

    async create(material: CreateMaterialRequest): Promise<Material> {
        const response = await apiClient.post<{ success: boolean; data: Material; message: string }>('/api/materials', material, { headers: { 'Content-Type': 'application/json' } });
        return response.data;
    }

    async importFromExcel(file: File, projectId: string): Promise<{
        imported_count: number;
        failed_count: number;
        errors?: string[];
    }> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('project_id', projectId);

        const response = await apiClient.postFormData<{
            success: boolean;
            data?: {
                materials_created?: number;
                materials_failed?: number;
                total_rows?: number;
                errors?: string[];
            };
            message: string;
        }>('/api/materials/import-excel', formData);

        // Handle different response structures
        if (response.success && response.data) {
            return {
                imported_count: response.data.materials_created || response.data.total_rows || 0,
                failed_count: response.data.materials_failed || 0,
                errors: response.data.errors
            };
        } else if (response.success && response.message) {
            // Parse message for counts if data structure is different
            const importedMatch = response.message.match(/imported (\d+)/i);
            const failedMatch = response.message.match(/failed (\d+)/i);
            
            return {
                imported_count: importedMatch ? parseInt(importedMatch[1]) : 0,
                failed_count: failedMatch ? parseInt(failedMatch[1]) : 0,
                errors: []
            };
        } else {
            throw new Error(response.message || 'Import failed');
        }
    }
}
