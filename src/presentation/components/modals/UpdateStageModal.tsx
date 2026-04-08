import { createSignal, createMemo, Show, For, Switch, Match, onMount, createEffect } from 'solid-js';
import type { Component } from 'solid-js';
import { STAGE_ORDER } from '../../pages/dashboard/data/mockData';
import type { SiteStage } from '../../pages/dashboard/data/mockData';
import { SiteRepositoryImpl } from '../../../infrastructure/repositories/site.repository.impl';
import { TeamRepositoryImpl } from '../../../infrastructure/repositories/team.repository.impl';
import { UpdateSiteStageInteractor } from '../../../application/use-cases/update-site-stage.use-case';
import { authStore } from '../../store/auth.store';
import type { Team } from '../../../domain/entities/team.entity';
import type { UpdateSiteStageRequest } from '../../../domain/entities/work-order.entity';
import { mockTeams, mockPeople, mockTeamMembers } from '../../pages/dashboard/data/mockTeams';

// Helper for classes
const clsx = (...classes: any[]) => classes.flat().filter(Boolean).join(' ');

// Inline SVG Icons to match project pattern
const XIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
);
const UploadIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
);
const AlertTriangleIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
);
const ChevronRightIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const FileIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
);
const XCircleIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" x2="9" y1="9" y2="15" /><line x1="9" x2="15" y1="9" y2="15" /></svg>
);

interface UpdateStageModalProps {
    isOpen: boolean;
    onClose: () => void;
    siteId: string;
    siteName?: string;
    projectType?: string;
    currentStage: string;
    onUpdateStage: (newStage: string, notes?: string, payload?: Record<string, any>) => void;
}

const STAGE_LABELS: Record<string, string> = {
    'imported': 'Imported',
    'assigned': 'Assigned',
    'permit_process': 'Permit Diproses',
    'permit_ready': 'Permit Ready',
    'akses_process': 'Akses Diproses',
    'akses_ready': 'Akses Ready',
    'implementasi': 'Implementasi',
    'rfi_done': 'RFI Selesai',
    'rfs_done': 'RFS Selesai',
    'dokumen_done': 'Dokumen Submitted',
    'bast': 'BAST',
    'invoice': 'Invoice',
    'completed': 'Selesai',
    'survey': 'Survey',
    'survey_nok': 'Survey NOK',
    'erfin_process': 'ERFIN Diproses',
    'erfin_ready': 'ERFIN Ready'
};

interface TransitionConfig {
    nextLabel: string;
    helper: string;
    fields: string[];
    requiredFields: string[];
    fileLabel?: string;
    paymentNote: string | null;
}

const STAGE_TRANSITION_CONFIG: Record<string, TransitionConfig> = {
    'imported→assigned': {
        nextLabel: 'Assigned',
        helper: 'Tugaskan tim yang akan mengerjakan site ini.',
        fields: ['team_select'],
        requiredFields: ['team_id'],
        paymentNote: null
    },
    'assigned→permit_process': {
        nextLabel: 'Permit Diproses',
        helper: 'Catat tanggal pengajuan permit ke TPAS.',
        fields: ['permit_create_date'],
        requiredFields: ['permit_create_date'],
        paymentNote: null
    },
    'assigned→survey': {
        nextLabel: 'Survey',
        helper: 'Catat tanggal survei hasil lapangan.',
        fields: ['survey_date'],
        requiredFields: ['survey_date'],
        paymentNote: null
    },
    'survey→erfin_process': {
        nextLabel: 'Input Hasil Survey',
        helper: 'Tentukan hasil survey. Jika OK lanjut ke ERFIN, jika NOK proses berhenti sementara.',
        fields: ['survey_result_radio'],
        requiredFields: ['survey_result'],
        paymentNote: null
    },
    'erfin_process→erfin_ready': {
        nextLabel: 'ERFIN Ready',
        helper: 'Input data ERFIN yang sudah disetujui.',
        fields: ['erfin_number', 'erfin_date', 'erfin_ready_date'],
        requiredFields: ['erfin_number', 'erfin_date'],
        paymentNote: null
    },
    'erfin_ready→permit_process': {
        nextLabel: 'Permit Diproses',
        helper: 'Catat tanggal pengajuan permit ke TPAS.',
        fields: ['permit_create_date'],
        requiredFields: ['permit_create_date'],
        paymentNote: null
    },
    'permit_process→permit_ready': {
        nextLabel: 'Permit Ready',
        helper: 'Konfirmasi semua approval sudah didapat dan upload dokumen permit.',
        fields: ['approval_chain', 'permit_start_date', 'permit_expiry_date', 'file_upload'],
        requiredFields: ['tpas_approved', 'tp_approved', 'files'],
        fileLabel: 'Upload Dokumen TPAS',
        paymentNote: null
    },
    'permit_ready→akses_process': {
        nextLabel: 'Akses Diproses',
        helper: 'Isi informasi akses tower untuk tim lapangan.',
        fields: ['tower_provider', 'jenis_kunci', 'pic_nama', 'pic_telp'],
        requiredFields: ['tower_provider', 'jenis_kunci'],
        paymentNote: null
    },
    'akses_process→akses_ready': {
        nextLabel: 'Akses Ready',
        helper: 'Konfirmasi akses ke tower sudah bisa dilakukan.',
        fields: ['konfirmasi_akses', 'file_upload'],
        requiredFields: ['konfirmasi_akses'],
        fileLabel: 'Foto kondisi site / bukti akses',
        paymentNote: null
    },
    'akses_ready→implementasi': {
        nextLabel: 'Implementasi',
        helper: 'Catat jadwal dan mulai tracking pekerjaan di lapangan.',
        fields: ['tgl_rencana_impl', 'tgl_aktual_mulai', 'ci_tim'],
        requiredFields: ['tgl_rencana_impl'],
        paymentNote: null
    },
    'implementasi→rfi_done': {
        nextLabel: 'RFI Selesai',
        helper: 'Radio Frequency Inspection selesai dilakukan.',
        fields: ['co_tim', 'konfirmasi_rfi', 'file_upload'],
        requiredFields: ['co_tim', 'konfirmasi_rfi'],
        fileLabel: 'Foto CI/CO, laporan RFI',
        paymentNote: '💰 Setelah stage ini: T2a (30% dari Termin 2) akan dapat diajukan.'
    },
    'rfi_done→rfs_done': {
        nextLabel: 'RFS Selesai',
        helper: 'Site sudah Ready For Service.',
        fields: ['konfirmasi_rfs', 'file_upload'],
        requiredFields: ['konfirmasi_rfs', 'files'],
        fileLabel: 'Laporan RFS / foto instalasi selesai',
        paymentNote: '💰 Setelah stage ini: T2b (50% dari Termin 2) akan dapat diajukan.'
    },
    'rfs_done→dokumen_done': {
        nextLabel: 'Dokumen Submitted',
        helper: 'Semua dokumen pekerjaan sudah diserahkan.',
        fields: ['konfirmasi_dok', 'file_upload'],
        requiredFields: ['konfirmasi_dok', 'files'],
        fileLabel: 'As-built, laporan instalasi, atau dokumen lainnya',
        paymentNote: '💰 Setelah stage ini: T2c (20% dari Termin 2) akan dapat diajukan.'
    },
    'dokumen_done→bast': {
        nextLabel: 'BAST',
        helper: 'Berita Acara Serah Terima pekerjaan.',
        fields: ['file_upload', 'tgl_bast'],
        requiredFields: ['files', 'tgl_bast'],
        fileLabel: 'Upload BAST yang sudah ditandatangani',
        paymentNote: '💰 Setelah stage ini: T3 (10% dari total) akan dapat diajukan.'
    },
    'bast→invoice': {
        nextLabel: 'Invoice',
        helper: 'Invoice sudah dikirim ke TI untuk pembayaran final.',
        fields: ['no_invoice', 'tgl_invoice', 'file_upload'],
        requiredFields: ['no_invoice', 'tgl_invoice', 'files'],
        fileLabel: 'Upload Invoice',
        paymentNote: '💰 Setelah stage ini: T4 (10% dari total) akan dapat diajukan.'
    },
    'invoice→completed': {
        nextLabel: 'Selesai',
        helper: 'Konfirmasi semua pekerjaan dan pembayaran sudah selesai.',
        fields: ['konfirmasi_final'],
        requiredFields: ['konfirmasi_final'],
        paymentNote: null
    }
};

const UpdateStageModal: Component<UpdateStageModalProps> = (props) => {

    const [selectedBranch, setSelectedBranch] = createSignal<string>('');

    const getNextStages = () => {

        if (props.currentStage === 'survey') return ['erfin_process', 'survey_nok'];

        const ppl = props.projectType === 'RESCOPING'
            ? ['imported', 'assigned', 'survey', 'erfin_process', 'erfin_ready', 'permit_process', 'permit_ready', 'akses_process', 'akses_ready', 'implementasi', 'rfi_done', 'dokumen_done', 'bast', 'invoice', 'completed']
            : ['imported', 'assigned', 'permit_process', 'permit_ready', 'akses_process', 'akses_ready', 'implementasi', 'rfs_done', 'dokumen_done', 'bast', 'invoice', 'completed'];

        console.log('Pipeline:', ppl);

        const currentIndex = ppl.indexOf(props.currentStage);
        console.log('Current Index:', currentIndex);

        if (currentIndex === -1 || currentIndex === ppl.length - 1) {
            console.log('No next stages available');
            return [];
        }

        const nextStages = [ppl[currentIndex + 1]];
        console.log('Next Stages:', nextStages);
        return nextStages;
    };

    const nextLogicalStageId = createMemo(() => {
        const nextStages = getNextStages();
        return (props.currentStage === 'survey' && selectedBranch() === 'survey_nok') ? 'survey_nok' : (nextStages[0] || null);
    });

    const transitionKey = createMemo(() => {
        const nextStage = nextLogicalStageId();
        const key = `${props.currentStage}→${nextStage}`;
        console.log('=== TRANSITION DEBUG ===');
        console.log('Current Stage:', props.currentStage);
        console.log('Next Stage:', nextStage);
        console.log('Transition Key:', key);
        console.log('Config Found:', !!STAGE_TRANSITION_CONFIG[key]);
        return key;
    });

    const config = createMemo(() => {
        const key = transitionKey();
        const configFound = STAGE_TRANSITION_CONFIG[key];
        console.log('=== CONFIG DEBUG ===');
        console.log('Transition Key:', key);
        console.log('Config Found:', !!configFound);
        console.log('Config:', configFound);
        console.log('Available Configs:', Object.keys(STAGE_TRANSITION_CONFIG));
        return configFound;
    });

    // Form State
    const [notes, setNotes] = createSignal('');
    const [showIssueForm, setShowIssueForm] = createSignal(false);
    const [issueNotes, setIssueNotes] = createSignal('');
    const [issueAction, setIssueAction] = createSignal('hold'); // hold, escalate

    // Dynamic Fields State
    const [formData, setFormData] = createSignal<Record<string, any>>({
        survey_date: new Date().toISOString().split('T')[0], // default today for survey
        permit_create_date: new Date().toISOString().split('T')[0], // default today for permit creation
        permit_start_date: new Date().toISOString().split('T')[0], // default today for other permit fields
        permit_expiry_date: new Date().toISOString().split('T')[0]
    });

    // Files State
    const [files, setFiles] = createSignal<File[]>([]);
    const [isDragActive, setIsDragActive] = createSignal(false);

    // Metadata & API State
    const [teams, setTeams] = createSignal<Team[]>([]);
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [fetchError, setFetchError] = createSignal('');

    onMount(async () => {
        try {
            const teamRepo = new TeamRepositoryImpl();
            const apiTeams = await teamRepo.findAll();
            setTeams(apiTeams);
        } catch (err) {
            console.error('Failed to fetch teams:', err);
            setFetchError('Gagal mengambil data tim');
        }
    });

    // Reset form when modal opens with new site/stage
    createEffect(() => {
        if (props.isOpen) {
            setNotes('');
            setShowIssueForm(false);
            setIssueNotes('');
            setFiles([]);
            setFormData({
                permit_create_date: new Date().toISOString().split('T')[0]
            });
        }
    });

    const handleFormChange = (key: string, value: any) => {
        console.log('=== FORM CHANGE DEBUG ===');
        console.log('Key:', key);
        console.log('Value:', value);
        console.log('Previous formData:', formData());

        setFormData(prev => ({ ...prev, [key]: value }));

        console.log('New formData will be:', { ...formData(), [key]: value });

        if (key === 'survey_result') {
            setSelectedBranch(value === 'nok' ? 'survey_nok' : 'erfin_process');
        }
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => [...prev, ...newFiles].slice(0, 10)); // max 10
        }
    };

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const newFiles = Array.from(target.files);
            setFiles(prev => [...prev, ...newFiles].slice(0, 10)); // max 10
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Validation
    const hasOversizedFiles = createMemo(() => files().some(f => f.size > 20 * 1024 * 1024));

    const isMainFormValid = createMemo(() => {
        const c = config();
        if (!c) {
            console.log('❌ Validation: No config found');
            return false;
        }
        if (hasOversizedFiles()) {
            console.log('❌ Validation: Oversized files');
            return false;
        }

        const data = formData();
        console.log('=== VALIDATION DEBUG ===');
        console.log('Form Data:', data);
        console.log('Required Fields:', c.requiredFields);

        if (props.currentStage === 'survey') {
            if (!data['survey_result']) {
                console.log('❌ Validation: Missing survey_result');
                return false;
            }
            if (data['survey_result'] === 'nok' && (!data['survey_nok_reason'] || data['survey_nok_reason'].trim() === '')) {
                console.log('❌ Validation: Missing survey_nok_reason');
                return false;
            }
        }

        if (data['has_akses_gedung'] === true && (!data['gedung_nama'] || data['gedung_nama'] === '')) {
            console.log('❌ Validation: Missing gedung_nama');
            return false;
        }

        for (const req of c.requiredFields) {
            if (req === 'files' && data['survey_result'] === 'nok') continue;

            if (req === 'files') {
                if (files().length === 0) {
                    console.log('❌ Validation: Missing files');
                    return false;
                }
            } else if (req === 'tpas_approved' || req === 'tp_approved' || req.startsWith('konfirmasi_')) {
                if (!data[req]) {
                    console.log(`❌ Validation: Missing ${req}`);
                    return false;
                }
            } else {
                if (!data[req] || data[req] === '') {
                    console.log(`❌ Validation: Missing ${req}`, data[req]);
                    return false;
                }
            }
        }

        console.log('✅ Validation: All checks passed');
        return true;
    });

    const isIssueValid = createMemo(() => issueNotes().trim().length > 0);

    const mapUiToApiFields = (nextStage: string, notes: string, uiData: Record<string, any>): UpdateSiteStageRequest => {
        // Use 'nama' field from user if available (API teams format), fallback to 'name' or 'System'
        const changedBy = (authStore.user() as any)?.nama || authStore.user()?.name || 'System';
        const apiData: UpdateSiteStageRequest = {
            stage: nextStage,
            notes: notes,
            changed_by: changedBy,
            files: files()
        };

        // Mapping table
        const mapping: Record<string, string> = {
            'permit_create_date': 'permit_date',
            'tpas_approved': 'stage_tpas_approved',
            'tp_approved': 'stage_tp_approved',
            'caf_approved': 'stage_caf_approved',
            'permit_start_date': 'stage_permit_berlaku',
            'permit_expiry_date': 'stage_permit_berakhir',
            'survey_date': 'stage_survey_date',
            'survey_result': 'stage_survey_result',
            'survey_nok_reason': 'stage_survey_nok_reason',
            'erfin_number': 'stage_erfin_number',
            'erfin_date': 'stage_erfin_date',
            'tower_provider': 'stage_akses_provider',
            'jenis_kunci': 'stage_akses_kunci',
            'pic_nama': 'stage_akses_pic_nama',
            'pic_telp': 'stage_akses_pic_telp',
            'has_akses_gedung': 'stage_gedung_akses',
            'gedung_nama': 'stage_gedung_nama',
            'gedung_pic_nama': 'stage_gedung_pic_nama',
            'gedung_pic_telp': 'stage_gedung_pic_telp',
            'tgl_rencana_impl': 'stage_impl_rencana_tgl',
            'tgl_aktual_mulai': 'stage_impl_aktual_tgl',
            'ci_tim': 'stage_impl_check_in',
            'co_tim': 'stage_impl_check_out',
            'konfirmasi_rfi': 'stage_rfi_confirm',
            'konfirmasi_rfs': 'stage_rfs_confirm',
            'rfs_catatan': 'stage_rfs_catatan',
            'konfirmasi_dok': 'stage_bast_dok_confirm',
            'konfirmasi_final': 'stage_bast_final_confirm',
            'final_notes': 'stage_catatan_final',
            // Pass through fields
            'team_id': 'team_id',
            'field_leader_id': 'field_leader_id'
        };

        Object.entries(uiData).forEach(([key, value]) => {
            const apiKey = mapping[key] || key;

            // Optional transformations
            let transformedValue = value;
            if (key === 'survey_result') {
                transformedValue = value === 'ok' ? 'LAYAK' : value === 'nok' ? 'TIDAK_LAYAK' : value;
            }

            apiData[apiKey] = transformedValue;
        });

        return apiData;
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        if (showIssueForm()) {
            if (!isIssueValid()) return;
            props.onUpdateStage('issue_hold', issueNotes(), { issueAction: issueAction() });
        } else {
            if (!isMainFormValid()) return;

            try {
                setIsSubmitting(true);
                const nextStage = nextLogicalStageId()!;

                const repo = new SiteRepositoryImpl();
                const interactor = new UpdateSiteStageInteractor(repo);

                const mappedData = mapUiToApiFields(nextStage, notes(), formData());

                console.log('Sending stage update payload:', mappedData);

                const response = await interactor.execute(props.siteId, mappedData);

                props.onUpdateStage(nextStage, notes(), formData());
                props.onClose();
            } catch (err: any) {
                console.error('Failed to update stage:', err);
                alert(err.message || 'Gagal mengupdate stage. Silakan coba lagi.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    // Render Field Helpers
    const renderField = (field: string) => {
        const data = formData();

        return (
            <Switch>
                <Match when={field === 'team_select'}>
                    <div class="space-y-4 border p-4 rounded-lg bg-slate-50/50">
                        <div class="space-y-1">
                            <label class="block text-sm font-medium text-slate-700">Tim Lapangan <span class="text-red-500">*</span></label>
                            <select
                                required
                                class="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 text-sm bg-white"
                                value={(formData().team_id as string) || ''}
                                onChange={(e) => {
                                    handleFormChange('team_id', e.currentTarget.value);
                                    handleFormChange('field_leader_id', ''); // Reset field leader when team changes
                                }}
                            >
                                <option value="">Pilih tim lapangan...</option>
                                <For each={teams().filter((t: any) => t.active !== false)}>
                                    {(t: any) => (
                                        <option value={t.id}>
                                            {t.nama} {t.regional ? `(${t.regional})` : ''}
                                        </option>
                                    )}
                                </For>
                            </select>
                        </div>

                        <Show when={formData().team_id}>
                            <div class="pl-4 border-l-2 border-blue-200 space-y-3 pt-1">
                                <div class="space-y-1.5 pt-1">
                                    <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Field Leader <span class="text-red-500">*</span>
                                    </label>
                                    <Show
                                        when={mockTeamMembers.filter(tm =>
                                            tm.team_id === formData().team_id && tm.role === 'Team Leader'
                                        ).length > 0}
                                        fallback={
                                            <div class="space-y-2">
                                                <select
                                                    disabled
                                                    class="w-full px-3 py-2 border border-slate-200 rounded text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                                                >
                                                    <option>— Belum ada field leader di tim ini</option>
                                                </select>
                                                <div class="flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                                                    <AlertTriangleIcon class="w-4 h-4 shrink-0" />
                                                    <p>Tim ini belum memiliki field leader. Tambahkan terlebih dahulu di halaman Teams.</p>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <select
                                            required
                                            class="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 text-sm bg-white"
                                            value={(formData().field_leader_id as string) || ''}
                                            onChange={(e) => handleFormChange('field_leader_id', e.currentTarget.value)}
                                        >
                                            <option value="">Pilih field leader...</option>
                                            <For each={mockTeamMembers.filter(tm =>
                                                tm.team_id === formData().team_id && tm.role === 'Team Leader'
                                            )}>
                                                {(tm) => {
                                                    const person = mockPeople.find(p => p.id === tm.person_id);
                                                    return person ? (
                                                        <option value={person.id}>{person.name}</option>
                                                    ) : null;
                                                }}
                                            </For>
                                        </select>
                                    </Show>
                                </div>
                            </div>
                        </Show>
                    </div>
                </Match>
                <Match when={['survey_date', 'erfin_date', 'erfin_ready_date', 'permit_create_date', 'permit_start_date', 'permit_expiry_date', 'tgl_rencana_impl', 'tgl_aktual_mulai', 'tgl_bast', 'tgl_invoice'].includes(field)}>
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-slate-700">
                            {
                                field === 'survey_date' ? 'Tanggal Survey' :
                                    field === 'erfin_date' ? 'Tanggal ERFIN' :
                                        field === 'erfin_ready_date' ? 'Tanggal ERFIN Ready' :
                                            field === 'permit_create_date' ? 'Tanggal Buat Permit' :
                                                field === 'permit_start_date' ? 'Tanggal Berlaku Permit TPAS' :
                                                    field === 'permit_expiry_date' ? 'Tanggal Berakhir Permit TPAS' :
                                                        field === 'tgl_rencana_impl' ? 'Tanggal Rencana Implementasi' :
                                                            field === 'tgl_aktual_mulai' ? 'Tanggal Aktual Mulai' :
                                                                field === 'tgl_bast' ? 'Tanggal BAST' :
                                                                    field === 'tgl_invoice' ? 'Tanggal Invoice' : ''
                            } {config()?.requiredFields.includes(field) && <span class="text-red-500">*</span>}
                        </label>
                        <input
                            type="date"
                            required={config()?.requiredFields.includes(field)}
                            value={(data[field] as string) || ''}
                            onChange={(e) => handleFormChange(field, e.currentTarget.value)}
                            class="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 text-sm"
                        />
                    </div>
                </Match>
                <Match when={field === 'ci_tim' || field === 'co_tim'}>
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-slate-700">
                            {field === 'ci_tim' ? 'Jam Check-In (CI)' : 'Jam Check-Out (CO)'} {config()?.requiredFields.includes(field) && <span class="text-red-500">*</span>}
                        </label>
                        <input
                            type="datetime-local"
                            required={config()?.requiredFields.includes(field)}
                            value={(data[field] as string) || ''}
                            onChange={(e) => handleFormChange(field, e.currentTarget.value)}
                            class="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 text-sm"
                        />
                    </div>
                </Match>
                <Match when={field === 'approval_chain'}>
                    <div class="space-y-3 bg-slate-50 p-3 border border-slate-200 rounded">
                        <label class="block text-sm font-semibold text-slate-700">Approval Chain <span class="text-red-500">*</span></label>
                        <div class="space-y-2">
                            <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input type="checkbox" checked={(data.tpas_approved as boolean) || false} onChange={e => handleFormChange('tpas_approved', e.currentTarget.checked)} class="rounded text-blue-600 focus:ring-blue-500" />
                                TPAS Approved *
                            </label>
                            <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input type="checkbox" checked={(data.tp_approved as boolean) || false} onChange={e => handleFormChange('tp_approved', e.currentTarget.checked)} class="rounded text-blue-600 focus:ring-blue-500" />
                                TP Approved *
                            </label>
                            <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                <input type="checkbox" checked={(data.caf_approved as boolean) || false} onChange={e => handleFormChange('caf_approved', e.currentTarget.checked)} class="rounded text-blue-600 focus:ring-blue-500" />
                                CAF Approved <span class="text-slate-400 text-xs ml-1">(Jika TP sewa pihak lain)</span>
                            </label>
                        </div>
                    </div>
                </Match>
                <Match when={field === 'tower_provider'}>
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-slate-700">Tower Provider <span class="text-red-500">*</span></label>
                        <select
                            required
                            class="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 text-sm"
                            value={(data.tower_provider as string) || ''}
                            onChange={(e) => handleFormChange('tower_provider', e.currentTarget.value)}
                        >
                            <option value="">Pilih provider...</option>
                            <option value="MITRATEL">MITRATEL</option>
                            <option value="STP">STP</option>
                            <option value="PTI">PTI</option>
                            <option value="DMT">DMT</option>
                            <option value="LAINNYA">Lainnya</option>
                        </select>
                    </div>
                </Match>
                <Match when={field === 'jenis_kunci'}>
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-slate-700">Jenis Kunci <span class="text-red-500">*</span></label>
                        <div class="flex gap-4">
                            <For each={['PADLOCK', 'SMARTLOCK', 'QUADLOCK']}>
                                {(k) => (
                                    <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="jenis_kunci"
                                            value={k}
                                            checked={data.jenis_kunci === k}
                                            onChange={(e) => handleFormChange('jenis_kunci', e.currentTarget.value)}
                                            class="text-blue-600 focus:ring-blue-500"
                                        />
                                        {k}
                                    </label>
                                )}
                            </For>
                        </div>
                    </div>
                </Match>
                <Match when={['erfin_number', 'pic_nama', 'pic_telp', 'no_invoice'].includes(field)}>
                    <div class="space-y-1">
                        <label class="block text-sm font-medium text-slate-700">
                            {
                                field === 'erfin_number' ? 'Nomor ERFIN' :
                                    field === 'pic_nama' ? 'PIC Akses — Nama' :
                                        field === 'pic_telp' ? 'PIC Akses — No. Telp' :
                                            field === 'no_invoice' ? 'Nomor Invoice' : ''
                            } {config()?.requiredFields.includes(field) && <span class="text-red-500">*</span>}
                        </label>
                        <input
                            type={field === 'pic_telp' ? 'tel' : 'text'}
                            placeholder={
                                field === 'erfin_number' ? 'ERF-XXX' :
                                    field === 'pic_nama' ? 'Nama PIC dari Tower Provider' :
                                        field === 'pic_telp' ? '08xx xxxx xxxx' :
                                            field === 'no_invoice' ? 'INV-XXX' : ''
                            }
                            required={config()?.requiredFields.includes(field)}
                            value={(data[field] as string) || ''}
                            onChange={(e) => handleFormChange(field, e.currentTarget.value)}
                            class="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 text-sm"
                        />
                    </div>
                </Match>
                <Match when={['konfirmasi_akses', 'konfirmasi_rfi', 'konfirmasi_rfs', 'konfirmasi_dok', 'konfirmasi_final'].includes(field)}>
                    <div class="pt-2">
                        <label class="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded cursor-pointer hover:bg-blue-100/50 transition-colors">
                            <input
                                type="checkbox"
                                required
                                checked={(data[field] as boolean) || false}
                                onChange={(e) => handleFormChange(field, e.currentTarget.checked)}
                                class="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                            />
                            <span class="text-sm font-medium text-slate-800 tracking-tight leading-tight">
                                {
                                    field === 'konfirmasi_akses' ? 'Akses ke site sudah READY EKSEKUSI' :
                                        field === 'konfirmasi_rfi' ? 'RFI sudah selesai dilakukan' :
                                            field === 'konfirmasi_rfs' ? 'Site sudah Ready For Service (RFS)' :
                                                field === 'konfirmasi_dok' ? 'Semua dokumen pekerjaan sudah disubmit' :
                                                    field === 'konfirmasi_final' ? 'Semua termin sudah dibayar dan pekerjaan selesai' : ''
                                } <span class="text-red-500">*</span>
                            </span>
                        </label>
                    </div>
                </Match>
                <Match when={field === 'survey_result_radio'}>
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-slate-800">Hasil Survey <span class="text-red-500">*</span></label>
                            <div class="flex flex-col gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                                <label class="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-white border border-transparent hover:border-slate-200 transition-colors">
                                    <input
                                        type="radio"
                                        name="survey_result"
                                        value="ok"
                                        checked={data.survey_result === 'ok'}
                                        onChange={(e) => handleFormChange('survey_result', e.currentTarget.value)}
                                        class="mt-0.5 text-blue-600 focus:ring-blue-500 w-4 h-4"
                                    />
                                    <div>
                                        <span class="block text-sm font-bold text-slate-800">OK</span>
                                        <span class="block text-xs text-slate-500">Site layak, lanjut ke ERFIN</span>
                                    </div>
                                </label>
                                <label class="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-white border border-transparent hover:border-slate-200 transition-colors">
                                    <input
                                        type="radio"
                                        name="survey_result"
                                        value="nok"
                                        checked={data.survey_result === 'nok'}
                                        onChange={(e) => handleFormChange('survey_result', e.currentTarget.value)}
                                        class="mt-0.5 text-red-600 focus:ring-red-500 w-4 h-4"
                                    />
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <span class="block text-sm font-bold text-red-700">NOK</span>
                                            <Show when={data.survey_result === 'nok'}>
                                                <span class="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Hentikan Sementara</span>
                                            </Show>
                                        </div>
                                        <span class="block text-xs text-slate-500">Site tidak layak sementara</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <Show when={data.survey_result === 'nok'}>
                            <div class="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                <div class="flex items-start gap-2 bg-amber-50 border border-amber-200 p-3 rounded">
                                    <AlertTriangleIcon class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <p class="text-xs font-medium text-amber-800 leading-relaxed">
                                        ⚠ Site akan ditandai Survey NOK. <br />
                                        Proses akan berhenti di sini sampai direset oleh Operational/Admin.
                                    </p>
                                </div>
                                <div class="pt-2">
                                    <label class="block text-sm font-semibold text-slate-700 mb-1">Alasan NOK <span class="text-red-500">*</span></label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={(data.survey_nok_reason as string) || ''}
                                        onChange={(e) => handleFormChange('survey_nok_reason', e.currentTarget.value)}
                                        class="w-full px-3 py-2 border border-red-300 rounded focus:border-red-500 text-sm bg-white"
                                        placeholder="Jelaskan alasan site tidak layak..."
                                    />
                                </div>
                            </div>
                        </Show>
                    </div>
                </Match>
                <Match when={field === 'file_upload'}>
                    <div class="space-y-3">
                        <label class="block text-sm font-medium text-slate-700">
                            {config()?.fileLabel || 'Lampiran / Dokumen'} {config()?.requiredFields.includes('files') && <span class="text-red-500">*</span>}
                        </label>

                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            class={clsx(
                                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                                isDragActive() ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
                            )}
                        >
                            <UploadIcon class={clsx("w-8 h-8 mx-auto mb-3 transition-colors", isDragActive() ? "text-blue-500" : "text-slate-400")} />
                            <p class="text-sm font-medium text-slate-700 mb-1">
                                📎 Drag & drop files ke sini
                            </p>
                            <p class="text-sm text-slate-500 mb-4">
                                atau <label class="text-blue-600 font-medium cursor-pointer hover:underline">
                                    Browse Files
                                    <input type="file" multiple class="hidden" accept="*/*" onChange={handleFileChange} />
                                </label>
                            </p>
                            <div class="text-xs text-slate-400 space-y-0.5">
                                <p>Semua format diterima • Max 20MB per file</p>
                                <p>Max 10 files per upload</p>
                            </div>
                        </div>

                        {files().length > 0 && (
                            <div class="space-y-2">
                                <div class="space-y-1.5">
                                    <For each={files()}>
                                        {(f, i) => {
                                            const isTooLarge = f.size > 20 * 1024 * 1024;
                                            return (
                                                <div class={clsx("flex items-center justify-between text-left p-2.5 bg-white border rounded shadow-sm group transition-colors", isTooLarge ? "border-red-300 bg-red-50" : "border-slate-200")}>
                                                    <div class="flex items-center gap-3 overflow-hidden">
                                                        <FileIcon class="w-5 h-5 text-slate-400 flex-shrink-0" />
                                                        <div class="min-w-0">
                                                            <div class="truncate text-sm font-medium text-slate-700" title={f.name}>{f.name}</div>
                                                            <div class={clsx("text-xs", isTooLarge ? "text-red-500 font-medium" : "text-slate-500")}>
                                                                {(f.size / (1024 * 1024)).toFixed(1)} MB {isTooLarge && ' (Melebihi 20MB)'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button type="button" onClick={() => removeFile(i())} class="text-slate-400 hover:text-red-500 p-1.5 rounded transition-colors" title="Remove">
                                                            <XCircleIcon class="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    </For>
                                </div>
                                <div class="flex items-center justify-between pt-1">
                                    <span class="text-xs font-medium text-slate-600">
                                        {files().length} file{files().length > 1 ? 's' : ''} • {(files().reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(1)} MB total
                                    </span>
                                </div>
                                <Show when={files().reduce((acc, f) => acc + f.size, 0) > 50 * 1024 * 1024}>
                                    <div class="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 flex items-center gap-2">
                                        <AlertTriangleIcon class="w-4 h-4 shrink-0 text-amber-500" /> Upload besar, mungkin butuh waktu lebih lama
                                    </div>
                                </Show>
                            </div>
                        )}
                        <Show when={files().some(f => f.size > 20 * 1024 * 1024)}>
                            <div class="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 flex items-center gap-2">
                                <XCircleIcon class="w-4 h-4 shrink-0 text-red-500" /> Terdapat file melebihi 20MB
                            </div>
                        </Show>
                    </div>
                </Match>
            </Switch>
        );
    };

    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div class="px-5 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                        <div>
                            <h2 class="text-lg font-bold text-slate-800">Update Stage</h2>
                            <p class="text-sm text-slate-500">{props.siteName || 'Site Name Placeholder'}</p>
                        </div>
                        <button onClick={props.onClose} class="p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors">
                            <XIcon class="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <div class="flex-1 overflow-y-auto">
                        <form id="update-stage-form" onSubmit={handleSubmit} class="p-5 space-y-6">

                            {/* Progress Indicator */}
                            <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                <div class="flex-1">
                                    <span class="block text-xs font-medium text-slate-500 mb-0.5">Current Stage</span>
                                    <span class="font-semibold text-slate-700">{STAGE_LABELS[props.currentStage] || props.currentStage}</span>
                                </div>
                                <ChevronRightIcon class="w-5 h-5 text-slate-400 flex-shrink-0" />
                                <div class="flex-1">
                                    <span class="block text-xs font-medium text-blue-500 mb-0.5">Move to</span>
                                    <Show when={config()} fallback={<span class="font-bold text-slate-400">Tidak ada next stage</span>}>
                                        <span class="font-bold text-blue-700">
                                            {props.currentStage === 'survey' ? (selectedBranch() === 'survey_nok' ? 'Survey NOK' : 'ERFIN Diproses') : config()?.nextLabel}
                                        </span>
                                    </Show>
                                </div>
                            </div>

                            <Show when={config()} fallback={
                                <div class="p-4 bg-slate-50 text-slate-600 text-center rounded border border-slate-200">
                                    Site sudah berada di stage paling akhir, atau transisi tidak valid.
                                </div>
                            }>
                                <p class="text-sm text-slate-600 leading-relaxed font-medium">
                                    {config()?.helper}
                                </p>

                                {/* Dynamic Fields Array */}
                                <div class="space-y-5">
                                    <For each={config()?.fields}>
                                        {(f) => renderField(f)}
                                    </For>
                                </div>

                                <div class="space-y-1 pt-2">
                                    <label class="block text-sm font-medium text-slate-700">Catatan Tambahan</label>
                                    <textarea
                                        rows={2}
                                        value={notes()}
                                        onInput={(e) => setNotes(e.currentTarget.value)}
                                        class="w-full px-3 py-2 border border-slate-300 rounded focus:border-blue-500 text-sm placeholder:text-slate-400"
                                        placeholder="Opsional"
                                    />
                                </div>

                                <Show when={config()?.paymentNote}>
                                    <div class="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3 rounded flex gap-2 items-start mt-4">
                                        <AlertTriangleIcon class="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                                        <span class="font-medium">{config()?.paymentNote}</span>
                                    </div>
                                </Show>
                            </Show>

                            <hr class="border-slate-100 my-4" />

                            {/* Issue Form Accordion */}
                            <div class="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => setShowIssueForm(!showIssueForm())}
                                    class={clsx(
                                        "w-full flex items-center justify-between p-3 rounded text-sm font-medium transition-colors border",
                                        showIssueForm()
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                    )}
                                >
                                    <div class="flex items-center gap-2">
                                        <AlertTriangleIcon class={clsx("w-4 h-4", showIssueForm() ? "text-red-500" : "text-amber-500")} />
                                        Laporkan Issue / Tahan Stage
                                    </div>
                                    <span>{showIssueForm() ? 'Tutup' : 'Buka'}</span>
                                </button>

                                <Show when={showIssueForm()}>
                                    <div class="p-4 bg-red-50/50 border border-red-100 rounded space-y-4 animate-in slide-in-from-top-2 duration-200">
                                        <div>
                                            <label class="block text-sm font-medium text-slate-800 mb-1">Keterangan Issue <span class="text-red-500">*</span></label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={issueNotes()}
                                                onInput={(e) => setIssueNotes(e.currentTarget.value)}
                                                class="w-full px-3 py-2 border border-red-200 rounded focus:border-red-500 text-sm bg-white"
                                                placeholder="Jelaskan masalah yang ditemukan secara detail..."
                                            />
                                        </div>

                                        <div>
                                            <label class="block text-sm font-medium text-slate-800 mb-2">Tindakan</label>
                                            <div class="flex gap-4">
                                                <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={issueAction() === 'hold'}
                                                        onChange={() => setIssueAction('hold')}
                                                        class="text-red-600 focus:ring-red-500 mt-0.5"
                                                    />
                                                    Tahan di stage ini
                                                </label>
                                                <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        checked={issueAction() === 'escalate'}
                                                        onChange={() => setIssueAction('escalate')}
                                                        class="text-red-600 focus:ring-red-500 mt-0.5"
                                                    />
                                                    Eskalasi ke management
                                                </label>
                                            </div>
                                        </div>

                                        <div class="pt-2">
                                            <label class="block text-sm text-blue-600 font-medium cursor-pointer hover:underline inline-flex items-center gap-1">
                                                <UploadIcon class="w-3 h-3" /> Upload Bukti Issue (Opsional)
                                                <input type="file" class="hidden" />
                                            </label>
                                        </div>
                                    </div>
                                </Show>
                            </div>

                        </form>
                    </div>

                    {/* Footer Fixed */}
                    <div class="px-5 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                        <button type="button" onClick={props.onClose} class="px-5 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors text-sm">
                            Cancel
                        </button>
                        <Show when={showIssueForm()} fallback={
                            <button
                                type="submit"
                                form="update-stage-form"
                                disabled={!config() || !isMainFormValid()}
                                class="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded transition-colors text-sm shadow-sm flex items-center gap-2"
                            >
                                {isSubmitting() ? 'Updating...' : (props.currentStage === 'survey' && selectedBranch() === 'survey_nok' ? 'Tandai NOK' : 'Update Stage')}
                                {isSubmitting() ? (
                                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <ChevronRightIcon class="w-4 h-4" />
                                )}
                            </button>
                        }>
                            <button
                                type="submit"
                                form="update-stage-form"
                                disabled={!isIssueValid()}
                                class="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium rounded transition-colors text-sm shadow-sm"
                            >
                                Laporkan Issue
                            </button>
                        </Show>
                    </div>

                </div>
            </div>
        </Show>
    );
}

export default UpdateStageModal;
