import * as xlsx from 'xlsx';
import { STAGE_ORDER, siteMasterRecords, type ProjectType, type SiteStage } from '../data/mockData';

export interface TemplateScope {
    projectType: ProjectType | 'ALL';
    stageFilters: string[];
}

export interface ValidatedBulkRow {
    status: 'valid' | 'skip' | 'error';
    reason?: string;
    changedFields?: string[];
    row: {
        unique_key: string;
        site_name: string;
        curr_stage: string;
        new_stage: string;
        [key: string]: any;
    };
}

export interface StageTransitionGroup {
    fromStage: string;
    toStage: string;
    label: string;
    count: number;
    icon: string;
    docExamples: string;
}

export const generateBulkUpdateTemplate = (scope: TemplateScope) => {
    let sites = [...siteMasterRecords];
    
    if (scope.projectType !== 'ALL') {
        sites = sites.filter(s => s.project_type === scope.projectType);
    }
    
    if (scope.stageFilters.length > 0) {
        sites = sites.filter(s => scope.stageFilters.includes(s.stage || 'imported'));
    }

    const data = sites.map(s => ({
        'UNIQUE_KEY': s.site_id,
        'Site Name': s.site_name,
        'Current Stage': s.stage,
        'NEW_STAGE': s.stage,
        'Notes': ''
    }));

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Bulk_Update');

    // Add instructions or dropdowns if possible (omitted for simplicity in this mock/template)
    
    const wbOut = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bulk_Update_Template_${scope.projectType}_${new Date().getTime()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
};

export const parseBulkTemplate = async (file: File): Promise<{ isValid: boolean; rows: ValidatedBulkRow[] }> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = xlsx.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(firstSheet) as any[];

            if (jsonData.length === 0 || !jsonData[0].UNIQUE_KEY || !jsonData[0].NEW_STAGE) {
                resolve({ isValid: false, rows: [] });
                return;
            }

            const rows: ValidatedBulkRow[] = jsonData.map(item => {
                const site = siteMasterRecords.find(s => s.site_id === item.UNIQUE_KEY);
                
                if (!site) {
                    return {
                        status: 'error',
                        reason: 'Site ID tidak ditemukan',
                        row: {
                            unique_key: item.UNIQUE_KEY,
                            site_name: item['Site Name'] || 'Unknown',
                            curr_stage: item['Current Stage'] || 'Unknown',
                            new_stage: item.NEW_STAGE
                        }
                    };
                }

                if (item.NEW_STAGE === site.stage) {
                    return {
                        status: 'skip',
                        reason: 'Tidak ada perubahan stage',
                        row: {
                            unique_key: item.UNIQUE_KEY,
                            site_name: site.site_name,
                            curr_stage: site.stage,
                            new_stage: item.NEW_STAGE
                        }
                    };
                }

                // Basic validation: Check if stage exists in STAGE_ORDER
                if (!STAGE_ORDER.includes(item.NEW_STAGE as SiteStage)) {
                     return {
                        status: 'error',
                        reason: 'Stage tujuan tidak valid',
                        row: {
                            unique_key: item.UNIQUE_KEY,
                            site_name: site.site_name,
                            curr_stage: site.stage,
                            new_stage: item.NEW_STAGE
                        }
                    };
                }

                return {
                    status: 'valid',
                    changedFields: ['stage'],
                    row: {
                        unique_key: item.UNIQUE_KEY,
                        site_name: site.site_name,
                        curr_stage: site.stage,
                        new_stage: item.NEW_STAGE
                    }
                };
            });

            resolve({ isValid: true, rows });
        };
        reader.readAsArrayBuffer(file);
    });
};

export const groupByTransition = (rows: ValidatedBulkRow[]): StageTransitionGroup[] => {
    const validRows = rows.filter(r => r.status === 'valid');
    const groups: Record<string, StageTransitionGroup> = {};

    validRows.forEach(r => {
        const key = `${r.row.curr_stage}→${r.row.new_stage}`;
        if (!groups[key]) {
            groups[key] = {
                fromStage: r.row.curr_stage,
                toStage: r.row.new_stage,
                label: `${r.row.curr_stage.replace(/_/g, ' ')} ke ${r.row.new_stage.replace(/_/g, ' ')}`,
                count: 0,
                icon: '🔄',
                docExamples: getDocExamples(r.row.new_stage)
            };
        }
        groups[key].count++;
    });

    return Object.values(groups);
};

const getDocExamples = (stage: string): string => {
    const examples: Record<string, string> = {
        'assigned': 'SPK atau LOI',
        'permit_process': 'Form perizinan atau surat tugas',
        'permit_ready': 'Dokumen IMB atau SITU',
        'akses_process': 'Izin akses pemilik lahan',
        'akses_ready': 'Kunci atau surat izin masuk',
        'implementasi': 'Laporan harian',
        'rfi_done': 'BA RFI',
        'rfs_done': 'BA RFS',
        'dokumen_done': 'Bundel dokumen lengkap',
        'bast': 'BAST yang sudah ditandatangani',
        'invoice': 'Softcopy Invoice',
        'completed': 'Berita Acara Selesai'
    };
    return examples[stage] || 'Dokumen pendukung (PDF/JPG)';
};
