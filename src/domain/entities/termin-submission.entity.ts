export interface TerminSubmission {
    id: string;
    project_id: string;
    site_id: string;
    type_termin: string;
    tgl_terima: string;
    jumlah: number;
    termin_ke: number;
    percentage: number;
    status: string;
    keterangan: string;
    submitted_by: string;
    submitted_at: string;
    reviewed_by: string | null;
    catatan_review: string | null;
    approved_by: string | null;
    catatan_approval: string | null;
    paid_by: string | null;
    jumlah_dibayar: number | null;
    referensi_pembayaran: string | null;
    catatan_pembayaran: string | null;
    bukti_pembayaran: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateTerminRequest {
    project_id: string;
    site_id: string;
    type_termin: string;
    tgl_terima: string;
    jumlah: number;
    termin_ke: number;
    percentage: number;
    keterangan: string;
    submitted_by: string;
}

export interface ReviewTerminRequest {
    reviewer_name: string;
    catatan_review: string;
    approve: boolean;
}

export interface ApproveTerminRequest {
    approver_name: string;
    catatan_approval: string;
    approve: boolean;
}

export interface CreateTerminResponse {
    success: boolean;
    data: TerminSubmission | null;
    message: string;
}
