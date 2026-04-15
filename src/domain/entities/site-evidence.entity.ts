export interface SiteEvidence {
    id: string;
    site_id: string;
    title: string;
    filename: string;
    keterangan: string;
    progress_tag?: string | null;
    url?: string;
    mime_type?: string;
    size?: number;
    uploaded_at: string;
    uploaded_by: string;
}

export interface UploadSiteEvidenceRequest {
    file: File;
    title: string;
    keterangan: string;
    uploaded_by: string;
    progress_tag?: string;
}

export interface SiteEvidenceApiResponse {
    success: boolean;
    data: SiteEvidence[];
    message: string | null;
}

export interface CreateEvidenceApiResponse {
    success: boolean;
    data: SiteEvidence;
    message: string | null;
}
