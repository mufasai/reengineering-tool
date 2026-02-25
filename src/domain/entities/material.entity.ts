export interface MaterialTransaction {
    id: string;
    workOrderId: string;
    materialName: string;
    quantity: number;
    type: 'COLLECTION' | 'HANDOVER';
    skpDocumentUrl?: string; // Document for collection
    handoverDocumentUrl?: string; // Document for receipt
    transactionDate: Date;
}

export interface Material {
    id: string;
    skp: string;
    name: string;
    unit: string;
    qty: number;
    project_id: string;
    site_id: string;
    tgl: string;
    created_at: string;
    updated_at: string;
}

export interface CreateMaterialRequest {
    skp: string;
    name: string;
    unit: string;
    qty: number;
    project_id: string;
    site_id: string;
    tgl: string;
}
