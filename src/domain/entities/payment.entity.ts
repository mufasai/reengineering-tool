export type PaymentStatus = 'PENDING' | 'APPROVAL_PARE' | 'FINANCE_TRANSFER' | 'COMPLETED';

export interface SubTermin {
    id: string;
    title: string;
    targetAmount?: number;
    amount?: number;
    status: PaymentStatus;
    evidencePath?: string;
    transferProofPath?: string;
}

export interface Termin {
    id: string;
    workOrderId: string;
    stage: number;
    title: string;
    amount: number;
    maxAmount?: number; // Caps for COMBAT stages
    percentage?: number; // For standard 4-stage
    status: PaymentStatus;
    subTermins?: SubTermin[];
    evidencePath?: string;
    bastPath?: string;
    approvalBy?: string;
    transferProofPath?: string;
}

export interface PaymentWorkflow {
    id: string;
    workOrderId: string;
    termins: Termin[];
}
