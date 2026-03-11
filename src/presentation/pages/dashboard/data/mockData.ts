export type ProjectType = 'COMBAT' | 'L2H' | 'BLACKSITE' | 'REFINEN' | 'FILTER' | 'BEBAN_OPERASIONAL';
export type SiteStage = 'imported' | 'assigned' | 'permit_process' | 'permit_ready' | 'akses_process' | 'akses_ready' | 'implementasi' | 'rfi_done' | 'rfs_done' | 'dokumen_done' | 'bast' | 'invoice' | 'completed' | 'issue_hold';

export interface Project {
    id: string;
    name: string;
    type: ProjectType;
    status: 'active' | 'completed';
    budget: number;
    client?: string;
    region?: string;
    unassignedPos?: number;
}

export interface Site {
    id: string;
    projectId: string;
    name: string;
    teamId?: string;
    budget: number;
    status: 'in_progress' | 'completed';
    startDate?: string;
    endDate?: string;
    jobName?: string;
    contractNumber?: string;
    workOrderId?: string;
    import_source?: string;
}

export interface Team {
    id: string;
    name: string;
    members: { personId: string; role?: string }[];
}

export interface SiteMaterial {
    id: string;
    siteId: string;
    skp: string;
    skpId: string;
    date: string;
    items: string[];
}

export interface SiteEvidence {
    id: string;
    siteId: string;
    filename: string;
    originalName: string;
    url?: string;
    progressTag: string;
    uploadedAt: string;
    uploadedBy: string;
}

export interface SiteCost {
    id: string;
    siteId: string;
    typeTermin: string;
    status: 'pengajuan' | 'approved' | 'paid' | 'rejected';
    jumlahPengajuan: number;
    jumlahPembayaran: number;
}

export interface SKP {
    id: string;
    siteId: string;
    skpNumber: string;
    tanggal: string;
    keterangan: string;
    status: 'Draft' | 'Submitted' | 'Received';
    documentUrl?: string;
    receivedEvidenceUrl?: string;
}

export interface SiteBoQ {
    id: string;
    siteId: string;
    siteType: string;
    itemCode: string;
    description: string;
    quantity: number;
    unit: string;
    type: 'material' | 'service';
}

export interface SiteStageLog {
    id: string;
    site_master_id: string;
    from_stage: SiteStage;
    to_stage: SiteStage;
    notes?: string;
    created_by: string;
    created_at: string;
    source?: 'bulk_import' | 'manual';
    evidence_files?: string[];
}

export interface SiteFile {
    id: string;
    site_id: string;
    filename: string;
    original_name: string;
    file_url: string;
    mime_type: string;
    file_size: number;
    source: string;
    stage_context?: string;
    stage_log_id?: string;
    uploaded_at: string;
    uploaded_by: string;
}

export interface TerminPengajuan {
    id: string;
    site_id: string;
    termin_key: string;
    nominal: number;
    catatan?: string;
    status: 'submitted' | 'approved' | 'paid' | 'rejected';
    submitted_by: string;
    submitted_at: string;
    approved_by?: string;
    approved_at?: string;
    documents: string[];
}

export const projects: Project[] = [
    { id: '1', name: 'Project Alpha', type: 'COMBAT', status: 'active', budget: 50000000, client: 'Telkomsel', region: 'Region 1' },
    { id: '2', name: 'Project Beta', type: 'FILTER', status: 'active', budget: 30000000, client: 'Telkomsel', region: 'Region 2' },
    { id: '3', name: 'Project Gamma', type: 'BLACKSITE', status: 'active', budget: 100000000, client: 'Indosat', region: 'Region 3' },
];

export const sites: Site[] = [
    { id: 's1', projectId: '1', name: 'Site JKT-1', teamId: 't1', budget: 20000000, status: 'in_progress', startDate: '2024-01-01', jobName: 'Pemasangan BTS', contractNumber: 'CTR-001' },
    { id: 's2', projectId: '1', name: 'Site BDO-1', teamId: 't2', budget: 30000000, status: 'in_progress', startDate: '2024-01-05', jobName: 'Retrofit Filter' },
    { id: 's3', projectId: '2', name: 'Site SUB-1', teamId: 't1', budget: 30000000, status: 'in_progress', startDate: '2024-02-01', jobName: 'Optimization' },
];

export const teams: Team[] = [
    { id: 't1', name: 'Team Alpha', members: [{ personId: 'p1', role: 'team_leader' }, { personId: 'p2', role: 'engineer' }] },
    { id: 't2', name: 'Team Beta', members: [{ personId: 'p3', role: 'engineer' }] },
];

export const people = [
    { id: 'p1', name: 'Budi Santoso' },
    { id: 'p2', name: 'Siti Aminah' },
    { id: 'p3', name: 'Joko Widodo' },
];

export const siteMaterials: SiteMaterial[] = [
    { id: 'm1', siteId: 's3', skp: 'SKP-001', skpId: 'skp1', date: '2024-03-01', items: ['Antenna', 'Cable 10m'] },
];

export const siteEvidence: SiteEvidence[] = [
    { id: 'e1', siteId: 's3', filename: 'preview.jpg', originalName: 'site_photo.jpg', url: 'https://images.unsplash.com/photo-1541888941257-e8bc2ae273bb?q=80&w=2070&auto=format&fit=crop', progressTag: 'Akses Entry', uploadedAt: '2024-03-05', uploadedBy: 'Budi Santoso' },
];

export const siteCosts: SiteCost[] = [
    { id: 'sc1', siteId: 's3', typeTermin: 'Termin 1 (DP)', status: 'paid', jumlahPengajuan: 5000000, jumlahPembayaran: 5000000 },
    { id: 'sc2', siteId: 's3', typeTermin: 'Termin 2', status: 'pengajuan', jumlahPengajuan: 10000000, jumlahPembayaran: 0 },
];

export const skpRecords: SKP[] = [
    { id: 'skp1', siteId: 's3', skpNumber: 'SKP-2024-001', tanggal: '2024-02-25', keterangan: 'Pengambilan material antena', status: 'Received', documentUrl: '#' },
];

export const siteBoQRecords: SiteBoQ[] = [
    { id: 'boq1', siteId: 's3', siteType: 'FILTER', itemCode: 'M-001', description: 'Ericsson Filter 900MHz', quantity: 3, unit: 'pcs', type: 'material' },
    { id: 'boq2', siteId: 's3', siteType: 'FILTER', itemCode: 'S-001', description: 'Installation Fee', quantity: 1, unit: 'lot', type: 'service' },
];

export const siteStageLogs: SiteStageLog[] = [
    { id: 'sl1', site_master_id: 's3', from_stage: 'assigned', to_stage: 'permit_process', notes: 'Mulai pengurusan izin warga', created_by: 'Budi Santoso', created_at: '2024-02-15T09:00:00Z' },
    { id: 'sl2', site_master_id: 's3', from_stage: 'permit_process', to_stage: 'permit_ready', notes: 'Izin warga beres', created_by: 'Siti Aminah', created_at: '2024-03-01T14:00:00Z' },
];

export const mockSiteFiles: SiteFile[] = [
    { id: 'f1', site_id: 's3', filename: 'permit_letter.pdf', original_name: 'permit.pdf', file_url: '#', mime_type: 'application/pdf', file_size: 1024000, source: 'manual', stage_context: 'permit_ready', uploaded_at: '2024-03-01T15:00:00Z', uploaded_by: 'Siti Aminah' },
];

export const terminPengajuanRecords: TerminPengajuan[] = [
    { id: 'tp1', site_id: 's3', termin_key: 'T1', nominal: 5000000, status: 'paid', submitted_by: 'p1', submitted_at: '2024-02-20T10:00:00Z', documents: ['f1'] },
];

export const filterTerms = [
    { id: 'ft1', siteId: 's3', status: 'paid', amountPaid: 15000000, percentage: 50, amountRequest: 0, step: 1, name: 'DP 50%' },
    { id: 'ft2', siteId: 's3', status: 'pengajuan', amountPaid: 0, percentage: 50, amountRequest: 15000000, step: 2, name: 'Termin 2' },
];

export const combatTerms = [
    {
        id: 'ct1', siteId: 's1', totalMaxAmount: 20000000, subSteps: [
            { id: 'ss1', status: 'paid', amountPaid: 10000000, amountRequest: 0 },
            { id: 'ss2', status: 'pengajuan', amountPaid: 0, amountRequest: 10000000 },
        ]
    }
];

export const workOrders = [
    { id: 'w1', woNumber: 'WO-2024-001', pemberiKerja: 'Telkomsel', status: 'Active', tanggalWo: '2024-01-15' },
    { id: 'w2', woNumber: 'WO-2024-002', pemberiKerja: 'Indosat', status: 'Pending SPK Approval', tanggalWo: '2024-02-01' },
];

export const activityFeed = [
    { id: 'a1', userId: 'p1', action: 'Approved SPK', target: 'WO-2024-001', timestamp: '2 hours ago' },
    { id: 'a2', userId: 'p2', action: 'Created project', target: 'Project Beta', timestamp: '5 hours ago' },
];

export const siteMasterRecords = [
    { id: 's1', site_id: 's1', site_name: 'Site JKT-1', projectId: '1', budget: 20000000, cluster: 'Jakarta Pusat', region: 'Jabodetabek', sector: 'Central', team_assigned: 'Team Alpha', latitude: -6.2272, longitude: 106.8023, stage_updated_at: '2024-03-01T10:00:00Z', stage: 'permit_process', project_type: 'COMBAT', stage_notes: '', contractNumber: 'CTR-001' },
    { id: 's2', site_id: 's2', site_name: 'Site BDO-1', projectId: '1', budget: 30000000, cluster: 'Bandung Tengah', region: 'Jawa Barat', sector: 'West', team_assigned: 'Team Beta', latitude: -6.9175, longitude: 107.6191, stage_updated_at: '2024-03-02T10:00:00Z', stage: 'implementasi', project_type: 'FILTER', stage_notes: 'Issue with weather' },
    { id: 's3', site_id: 's3', site_name: 'Site SUB-1', projectId: '2', budget: 30000000, cluster: 'Surabaya Timur', region: 'Jawa Timur', sector: 'East', team_assigned: 'Team Alpha', latitude: -7.2575, longitude: 112.7521, stage_updated_at: '2024-03-03T10:00:00Z', stage: 'completed', project_type: 'FILTER', stage_notes: '' },
    { id: 's4', site_id: 'JKS999', site_name: 'GHOST_SITE_SOUTH', projectId: '1', budget: 0, cluster: 'South', region: 'Jakarta & Banten', sector: 'South', team_assigned: '', latitude: -6.2, longitude: 106.8, stage_updated_at: new Date().toISOString(), stage: 'imported', project_type: 'FILTER', stage_notes: '', contractNumber: '4200052176' },
];
