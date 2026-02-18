export type WOStatus = 'TECHNICAL_PROCESS' | 'TERMIN_1' | 'TERMIN_2' | 'TERMIN_3' | 'TERMIN_4' | 'COMPLETED';

export type ProjectType = 'COMBAT' | 'L2H' | 'BLACK SITE' | 'REFINEN' | 'FILTER' | 'BEBAN OPERASIONAL';

export interface Site {
    id: string;
    name: string;
    location: string;
}

export interface WorkOrder {
    id: string;
    contractNumber: string;
    projectType: ProjectType;
    poValue: number; // 100% value from TI
    budgetTotal: number; // 70% of poValue
    status: WOStatus;
    siteList: Site[];
    assignedTeamId?: string;
    poNumber?: string; // Updated in Term-4
    createdAt: Date;
}
