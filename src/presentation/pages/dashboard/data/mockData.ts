export type ProjectType = 'COMBAT' | 'L2H' | 'BLACKSITE' | 'REFINEN' | 'FILTER' | 'BEBAN_OPERASIONAL';
export type SiteStage = 'imported' | 'assigned' | 'permit_process' | 'permit_ready' | 'akses_process' | 'akses_ready' | 'implementasi' | 'rfi_done' | 'rfs_done' | 'dokumen_done' | 'bast' | 'invoice' | 'completed' | 'issue_hold';

export const projects = [
    { id: '1', name: 'Project Alpha', type: 'COMBAT', status: 'active', budget: 50000000 },
    { id: '2', name: 'Project Beta', type: 'FILTER', status: 'active', budget: 30000000 },
    { id: '3', name: 'Project Gamma', type: 'BLACKSITE', status: 'active', budget: 100000000 },
];

export const sites = [
    { id: 's1', projectId: '1', name: 'Site JKT-1', teamId: 't1', budget: 20000000 },
    { id: 's2', projectId: '1', name: 'Site BDO-1', teamId: 't2', budget: 30000000 },
    { id: 's3', projectId: '2', name: 'Site SUB-1', teamId: 't1', budget: 30000000 },
];

export const teams = [
    { id: 't1', name: 'Team Alpha', members: [{ personId: 'p1' }, { personId: 'p2' }] },
    { id: 't2', name: 'Team Beta', members: [{ personId: 'p3' }] },
];

export const workOrders = [
    { id: 'w1', woNumber: 'WO-2024-001', pemberiKerja: 'Telkomsel', status: 'Active', tanggalWo: '2024-01-15' },
    { id: 'w2', woNumber: 'WO-2024-002', pemberiKerja: 'Indosat', status: 'Pending SPK Approval', tanggalWo: '2024-02-01' },
];

export const activityFeed = [
    { id: 'a1', userId: 'p1', action: 'Approved SPK', target: 'WO-2024-001', timestamp: '2 hours ago' },
    { id: 'a2', userId: 'p2', action: 'Created project', target: 'Project Beta', timestamp: '5 hours ago' },
];

export const people = [
    { id: 'p1', name: 'Budi Santoso' },
    { id: 'p2', name: 'Siti Aminah' },
    { id: 'p3', name: 'Joko Widodo' },
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

export const siteMasterRecords = [
    { id: 'sm1', site_id: 'S-001', site_name: 'Site Senayan 1', cluster: 'Jakarta Pusat', region: 'Jabodetabek', sector: 'Central', team_assigned: 'Team Alpha', latitude: -6.2272, longitude: 106.8023, stage_updated_at: '2024-03-01T10:00:00Z', stage: 'permit_process', project_type: 'COMBAT', stage_notes: '' },
    { id: 'sm2', site_id: 'S-002', site_name: 'Site SCBD', cluster: 'Jakarta Selatan', region: 'Jabodetabek', sector: 'South', team_assigned: 'Team Beta', latitude: -6.2255, longitude: 106.8096, stage_updated_at: '2024-03-02T10:00:00Z', stage: 'implementasi', project_type: 'FILTER', stage_notes: 'Issue with weather' },
    { id: 'sm3', site_id: 'S-003', site_name: 'Site Kelapa Gading', cluster: 'Jakarta Utara', region: 'Jabodetabek', sector: 'North', team_assigned: 'Team Alpha', latitude: -6.1585, longitude: 106.9015, stage_updated_at: '2024-03-03T10:00:00Z', stage: 'completed', project_type: 'BLACKSITE', stage_notes: '' },
];
