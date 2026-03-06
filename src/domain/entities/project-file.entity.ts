export interface ProjectFile {
    id: string;
    project_id: string;
    title: string;
    filename: string;
    original_name: string;
    bucket: string | null;
    key: string;
    mime_type: string;
    size: number;
    disk: string | null;
    visibility: string | null;
    uploaded_at: string;
    uploaded_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectFilesApiResponse {
    success: boolean;
    data: ProjectFile[];
    message: string | null;
}

export interface UploadProjectFileRequest {
    file: File;
    title: string;
}

export interface UploadProjectFileResponse {
    success: boolean;
    data: ProjectFile;
    message: string;
}
