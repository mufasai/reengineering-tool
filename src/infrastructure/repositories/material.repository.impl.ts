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
        const response = await apiClient.post<{ success: boolean; data: Material; message: string }>('/api/materials', material);
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
                imported_count?: number;
                failed_count?: number;
            };
            message: string | null;
            imported_count?: number;
            failed_count?: number;
        }>('/api/materials/import-excel', formData);

        console.log('Import API Response:', response);

        // Handle different response structures
        if (response.success) {
            // Try to get counts from different possible locations in response
            let importedCount = 0;
            let failedCount = 0;
            let errors: string[] = [];

            // Check data object first
            if (response.data) {
                importedCount = response.data.materials_created || 
                              response.data.total_rows || 
                              response.data.imported_count || 0;
                failedCount = response.data.materials_failed || 
                             response.data.failed_count || 0;
                errors = response.data.errors || [];
            }

            // Check root level properties
            if (importedCount === 0 && response.imported_count !== undefined) {
                importedCount = response.imported_count;
            }
            if (failedCount === 0 && response.failed_count !== undefined) {
                failedCount = response.failed_count;
            }

            // If still no counts, try parsing message
            if (importedCount === 0 && response.message) {
                const importedMatch = response.message.match(/imported (\d+)/i);
                const failedMatch = response.message.match(/failed (\d+)/i);
                const createdMatch = response.message.match(/created (\d+)/i);
                
                importedCount = importedMatch ? parseInt(importedMatch[1]) : 
                               createdMatch ? parseInt(createdMatch[1]) : 0;
                failedCount = failedMatch ? parseInt(failedMatch[1]) : 0;
            }

            return {
                imported_count: importedCount,
                failed_count: failedCount,
                errors: errors
            };
        } else {
            throw new Error(response.message || 'Import failed');
        }
    }
}
