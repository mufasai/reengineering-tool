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
