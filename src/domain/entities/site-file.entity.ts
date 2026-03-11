export interface SiteFile {
    id: string;
    site_id: string;
    title: string;
    filename: string;
    original_name: string;
    bucket: string;
    key: string;
    mime_type: string;
    size: number;
    disk: string;
    visibility: string;
    uploaded_at: string;
    uploaded_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface SiteFilesApiResponse {
    success: boolean;
    data: SiteFile[];
    message: string | null;
}

export interface UploadSiteFileRequest {
    file: File;
    title: string;
}

export interface UploadSiteFileResponse {
    success: boolean;
    data: SiteFile;
    message: string;
}
