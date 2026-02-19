import type { Personnel } from './team.entity';

export type WOStatus = 'TECHNICAL_PROCESS' | 'TERMIN_1' | 'TERMIN_2' | 'TERMIN_3' | 'TERMIN_4' | 'COMPLETED';

export type ProjectType = 'COMBAT' | 'L2H' | 'BLACK SITE' | 'REFINEN' | 'FILTER' | 'BEBAN OPERASIONAL';

export interface Site {
    id: string;
    siteName: string;
    siteInfo: string;
    pekerjaan: string;
    lokasi: string;
    nomorKontrak: string;
    start: Date;
    end: Date;
    maximalBudget: number;
    costEstimated: number;
    pemberiTugas: string;
    penerimaTugas: string;
    team: Personnel[]; // Using Personnel from team.entity.ts
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
