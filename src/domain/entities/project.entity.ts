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
