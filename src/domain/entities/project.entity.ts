export interface Project {
    id: string;
    name: string;
    lokasi: string;
    value: number;
    cost: number;
    keterangan: string;
    tipe: string;
    tgi_start: string;
    tgi_end: string;
    status: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string | null;
}

export interface CreateProjectRequest {
    name: string;
    lokasi: string;
    value: number;
    cost: number;
    tipe: string;
    keterangan: string;
    tgi_start: string;
    tgi_end: string;
    status: string;
}


export interface UpdateProjectRequest {
    name: string;
    lokasi: string;
    value: number;
    cost: number;
    tipe: string;
    keterangan: string;
    tgi_start: string;
    tgi_end: string;
    status: string;
}

export interface ImportProjectRequest {
    file: File;
    projectType?: string;
}

export interface ImportProjectResponse {
    success: boolean;
    data: {
        project: Project;
        total_rows: number;
        sites_created: number;
        sites_failed: number;
        created_sites: any[];
        errors: string[];
        summary: {
            project_id: string;
            project_name: string;
            total_budget: number;
            sites_count: number;
            message: string;
        };
    };
    message: string;
}
