export interface Team {
    id: string;
    nama: string;
    active: boolean;
    nik: string;
    nama_karyawan: string;
    tanggal_lahir: string;
    tempat_lahir: string;
    agama: string;
    jenis_kelamin: string;
    no_ktp: string;
    no_hp: string;
    alamat_email: string;
    jabatan_kerja: string;
    regional: string;
    created_at: string;
    updated_at: string;
}

export interface Personnel {
    id: string;
    name: string;
    ktpNumber: string;
    email: string;
    phoneNumber: string;
    role: string;
    verificationPhotos: {
        ktp: string;
        selfie: string;
        nda: string;
    };
}

// Site Team Member (from team structure API)
export interface SiteTeamMember {
    id: string;
    site_id: string;
    team_master_id: string;
    role: string | null;
    vendor: string | null;
    nik: string;
    nama: string;
    no_hp: string;
    jabatan: string;
    regional: string;
    created_at: string;
    updated_at: string;
}

export interface AddTeamToSiteRequest {
    team_master_id: string;
}

export interface UploadTeamsRequest {
    file: File;
}

export interface UploadTeamsResponse {
    success: boolean;
    data: {
        total_rows: number;
        success_count: number;
        failed_count: number;
        errors: string[];
    };
    message: string;
}
