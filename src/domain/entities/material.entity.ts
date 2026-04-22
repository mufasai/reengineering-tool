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

export interface CreateMaterialMasterRequest {
    kode_material?: string;
    nama_material: string;
    kategori?: string;
    spesifikasi?: string;
    satuan?: string;
    harga_satuan?: number;
    status_aktif?: boolean;
}

export interface Material {
    id: string;
    skp?: string;
    name: string;
    unit: string;
    qty: number;
    project_id: string;
    site_id: string;
    tgl: string;
    material_master_id?: string | null;
    source_master: boolean;
    harga_satuan?: number | null;
    spesifikasi?: string | null;
    satuan?: string | null;
    material_type?: string | null;
    direction?: string | null;
    delivery_note_no?: string | null;
    po_delivery_date?: string | null;
    vendor?: string | null;
    sender?: string | null;
    receiver?: string | null;
    keterangan?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface MaterialTransaction {
    id: string;
    material_id: string;
    work_order_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    transaction_date: string;
    transaction_type: 'in' | 'out';
    notes?: string;
}

export interface CreateMaterialRequest {
    skp?: string;
    name: string;
    unit: string;
    qty: number;
    project_id: string;
    site_id: string;
    tgl: string;
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