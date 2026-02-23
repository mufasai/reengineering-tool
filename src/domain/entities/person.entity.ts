import type { ApiResponse } from './project.entity';

export interface Person {
    id: string;
    name: string;
    tanggal_lahir: string | null;
    tempat_lahir: string | null;
    agama: string | null;
    jenis_kelamin: string | null;
    no_ktp: string | null;
    no_hp: string | null;
    email: string | null;
    jabatan_kerja: string | null;
    regional: string | null;
    lokasi_kerja: string | null;
    pekerjaan: string | null;
    nama_kontak_darurat: string | null;
    nomor_kontak_darurat: string | null;
    alamat_kontak_darurat: string | null;
    status_pernikahan: string | null;
    nama_ibu_kandung: string | null;
    pendidikan_terakhir: string | null;
    nama_kampus_sekolah: string | null;
    jurusan_sekolah: string | null;
    tahun_lulus: string | null;
    foto_ktp: string | null;
    foto_diri: string | null;
    thumbnail_path: string | null;
}

export interface CreatePersonRequest {
    name: string;
    tanggal_lahir?: string;
    tempat_lahir?: string;
    agama?: string;
    jenis_kelamin?: string;
    no_ktp?: string;
    no_hp?: string;
    email?: string;
    jabatan_kerja?: string;
    regional?: string;
    lokasi_kerja?: string;
    pekerjaan?: string;
}

export type { ApiResponse };
