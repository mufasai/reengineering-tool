import type { TerminRepository } from '../../domain/repositories/interfaces';
import type { TerminSubmission, CreateTerminRequest, CreateTerminResponse, ReviewTerminRequest, ApproveTerminRequest, PayTerminRequest } from '../../domain/entities/termin-submission.entity';
import { apiClient } from '../api/api-client';

export class TerminRepositoryImpl implements TerminRepository {
    async create(termin: CreateTerminRequest): Promise<TerminSubmission> {
        const response = await apiClient.post<CreateTerminResponse>('/api/termins', termin);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Failed to create termin');
        }

        return response.data;
    }

    async findById(terminId: string): Promise<TerminSubmission | null> {
        try {
            // Extract ID without prefix if it has one
            const idOnly = terminId.includes(':') ? terminId.split(':')[1] : terminId;
            const response = await apiClient.get<{ success: boolean; data: TerminSubmission; message: string | null }>(`/api/termins/${idOnly}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch termin:', error);
            return null;
        }
    }

    async findBySiteAndNumber(siteId: string, terminNumber: number): Promise<TerminSubmission | null> {
        try {
            // Since there's no direct endpoint to get termins by site,
            // we'll need to construct or store the termin ID
            // For now, return null and let the UI handle it
            console.warn('findBySiteAndNumber: No direct API endpoint available');
            return null;
        } catch (error) {
            console.error('Failed to fetch termin by site and number:', error);
            return null;
        }
    }

    async review(terminId: string, review: ReviewTerminRequest): Promise<TerminSubmission> {
        try {
            // Extract ID without prefix if it has one
            const idOnly = terminId.includes(':') ? terminId.split(':')[1] : terminId;
            const response = await apiClient.post<{ success: boolean; data: TerminSubmission; message: string | null }>(
                `/api/termins/${idOnly}/review`,
                review
            );

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to review termin');
            }

            return response.data;
        } catch (error: any) {
            console.error('Failed to review termin:', error);
            throw new Error(error.message || 'Failed to review termin');
        }
    }

    async approve(terminId: string, approval: ApproveTerminRequest): Promise<TerminSubmission> {
        try {
            // Extract ID without prefix if it has one
            const idOnly = terminId.includes(':') ? terminId.split(':')[1] : terminId;
            const response = await apiClient.post<{ success: boolean; data: TerminSubmission; message: string | null }>(
                `/api/termins/${idOnly}/approve`,
                approval
            );

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to approve termin');
            }

            return response.data;
        } catch (error: any) {
            console.error('Failed to approve termin:', error);
            throw new Error(error.message || 'Failed to approve termin');
        }
    }

    async pay(terminId: string, payment: PayTerminRequest): Promise<TerminSubmission> {
        try {
            // Extract ID without prefix if it has one
            const idOnly = terminId.includes(':') ? terminId.split(':')[1] : terminId;

            // Create FormData for multipart/form-data request
            const formData = new FormData();
            formData.append('approved_by', payment.approved_by);
            formData.append('jumlah_dibayar', payment.jumlah_dibayar.toString());
            formData.append('referensi_pembayaran', payment.referensi_pembayaran);
            formData.append('catatan_pembayaran', payment.catatan_pembayaran);
            formData.append('bukti_pembayaran', payment.bukti_pembayaran);

            const response = await apiClient.postFormData<{ success: boolean; data: TerminSubmission; message: string | null }>(
                `/api/termins/${idOnly}/pay`,
                formData
            );

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to pay termin');
            }

            return response.data;
        } catch (error: any) {
            console.error('Failed to pay termin:', error);
            throw new Error(error.message || 'Failed to pay termin');
        }
    }

    async findAll(): Promise<TerminSubmission[]> {
        try {
            const response = await apiClient.get<{ success: boolean; data: TerminSubmission[]; message: string | null }>('/api/termins');
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch termins:', error);
            return [];
        }
    }
}
