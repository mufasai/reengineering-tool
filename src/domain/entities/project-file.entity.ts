export interface ProjectFile {
    id: string;
    project_id: string;
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

export interface ProjectFilesApiResponse {
    success: boolean;
    data: ProjectFile[];
    message: string | null;
}
