export interface SiteEvidence {
    id: string;
    site_id: string;
    progress_tag: 'survei' | 'implementasi' | 'commissioning' | 'serah_terima';
    stage_context: string | null;
    url: string;
    filename: string;
    mime_type: string;
    size: number;
    uploaded_at: string;
    uploaded_by: string;
}

export interface UploadSiteEvidenceRequest {
    file: File;
    progress_tag: string;
    stage_context?: string;
    uploaded_by: string;
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
