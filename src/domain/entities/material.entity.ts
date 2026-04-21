export interface MaterialMaster {
    id: string;
    kode_material?: string;
    nama_material: string;
    kategori?: string;
    spesifikasi?: string;
    satuan?: string;
    harga_satuan?: number;
    status_aktif: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateMaterialRequest {
    kode_material?: string;
    nama_material: string;
    kategori?: string;
    spesifikasi?: string;
    satuan?: string;
    harga_satuan?: number;
    status_aktif?: boolean;
}

export interface MaterialUsage {
    material_master_id: string;
    siteId: string;
    quantity: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}