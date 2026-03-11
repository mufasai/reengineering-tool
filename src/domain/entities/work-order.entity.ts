import type { Personnel } from './team.entity';

export type WOStatus = 'TECHNICAL_PROCESS' | 'TERMIN_1' | 'TERMIN_2' | 'TERMIN_3' | 'TERMIN_4' | 'COMPLETED';

export type ProjectType = 'COMBAT' | 'L2H' | 'BLACK SITE' | 'REFINEN' | 'FILTER' | 'BEBAN OPERASIONAL';

export interface Site {
    id: string;
    project_id?: string;
    site_name: string;
    site_info: string;
    pekerjaan: string;
    lokasi: string;
    latitude: number | null;
    longitude: number | null;
    nomor_kontrak: string;
    start: string | Date;
    end: string | Date;
    maximal_budget: number;
    cost_estimated: number;
    pemberi_tugas: string;
    penerima_tugas: string;
    site_document: string | null;
    stage: string;
    stage_updated_at: string;
    stage_notes: string | null;
    impl_cico_done: boolean;
    impl_rfs_done: boolean;
    impl_dokumen_done: boolean;
    ineom_registered: boolean;
    team?: Personnel[]; // Using Personnel from team.entity.ts
    created_at?: string;
    updated_at?: string;
}

export interface CreateSiteRequest {
    project_id: string;
    site_name: string;
    site_info: string;
    pekerjaan: string;
    lokasi: string;
    nomor_kontrak: string;
    start: string;
    end: string;
    maximal_budget: number;
    cost_estimated: number;
    pemberi_tugas: string;
    penerima_tugas: string;
    site_document: null;
    team_members: any[];
}

export interface SiteApiResponse {
    success: boolean;
    data: Site;
    message: string;
}

export interface SitesListApiResponse {
    success: boolean;
    data: Site[];
    message: string | null;
}

export interface ProjectFile {
    id: string;
    name: string;
    url: string;
    type: 'CONTRACT' | 'BOQ' | 'OTHER';
    createdAt: Date;
}

export interface SiteProject {
    id: string;
    siteId: string;
    projectId: string;
    technicalStatus: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    notes?: string;
}

export interface WorkOrder {
    id: string;
    woNumber: string;
    projectName: string;
    lokasi: string;
    budget: number;
    keterangan: string;
    contractNumber: string;
    projectType: ProjectType;
    poValue: number; // 100% value from TI
    budgetTotal: number; // 70% of poValue
    status: WOStatus;
    periodStart: Date;
    periodEnd: Date;
    siteList: Site[];
    files: ProjectFile[];
    siteProjects: SiteProject[];
    assignedTeamId?: string;
    poNumber?: string; // Updated in Term-4
    createdAt: Date;
}
