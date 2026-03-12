import { createSignal, createMemo, Show, For, Switch, Match, onCleanup, createEffect } from 'solid-js';
import type { Component } from 'solid-js';
import * as xlsx from 'xlsx';
import { STAGE_ORDER, siteMasterRecords, type ProjectType } from '../../pages/dashboard/data/mockData';
import {
    generateBulkUpdateTemplate,
    parseBulkTemplate,
    groupByTransition,
    type TemplateScope,
    type ValidatedBulkRow,
    type StageTransitionGroup,
} from '../../pages/dashboard/utils/excelTemplates';
import { authStore } from '../../store/auth.store';

interface BulkStageUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectType?: string;
    onSuccess?: (count: number) => void;
}

type Step = 1 | 2 | 3 | 4 | 5;
type PreviewTab = 'valid' | 'skip' | 'error';

// Helper for classes
const clsx = (...classes: any[]) => classes.flat().filter(Boolean).join(' ');

// SVG Icons
const XIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>;
const UploadIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>;
const DownloadIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>;
const CheckCircle2Icon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>;
const AlertTriangleIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>;
const XCircleIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" x2="9" y1="9" y2="15" /><line x1="9" x2="15" y1="9" y2="15" /></svg>;
const ArrowRightIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
const ArrowLeftIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="5" y1="12" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>;
const FileSpreadsheetIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>;
const FilterIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const PaperclipIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>;
const SkipForwardIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" x2="19" y1="5" y2="19" /></svg>;
const EyeIcon = (props: { class?: string }) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;

const STAGE_LABELS: Record<string, string> = {
    imported: 'Imported', assigned: 'Assigned',
    permit_process: 'Permit Process', permit_ready: 'Permit Ready',
    akses_process: 'Akses Process', akses_ready: 'Akses Ready',
    implementasi: 'Implementasi', rfi_done: 'RFI Done',
    rfs_done: 'RFS Done', dokumen_done: 'Dokumen Done',
    bast: 'BAST', invoice: 'Invoice', completed: 'Completed',
};

const PROJECT_TYPES: { id: ProjectType | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'Semua Tipe' },
    { id: 'FILTER', label: 'Filter' },
    { id: 'COMBAT', label: 'Combat' },
    { id: 'BLACKSITE', label: 'Blacksite' },
    { id: 'L2H', label: 'L2H' },
    { id: 'REFINEN', label: 'Refinen' },
];

interface DocUpload {
    transitionKey: string;
    files: File[];
}

const BulkStageUpdateModal: Component<BulkStageUpdateModalProps> = (props) => {
    // RBAC: Check permission using authStore
    const user = () => authStore.user();
    const can = (perm: string) => {
        // Simplified permission check based on Sidebar.tsx logic
        const role = user()?.role?.toLowerCase().replace(/_/g, ' ') || '';
        const rolePermissions: Record<string, string[]> = {
            'backoffice admin': ['site.bulk_update'],
            'management': ['site.bulk_update'],
            'admin': ['site.bulk_update'],
        };
        const perms = rolePermissions[role] || [];
        return perms.includes(perm);
    };

    // ── Step state ──
    const [step, setStep] = createSignal<Step>(1);

    // ── Step 1: Scope ──
    const [selectedType, setSelectedType] = createSignal<ProjectType | 'ALL'>(
        (props.projectType?.toUpperCase() as ProjectType) || 'ALL'
    );
    const [selectedStages, setSelectedStages] = createSignal<string[]>([]);

    // ── Step 2: Upload ──
    const [isDragActive, setIsDragActive] = createSignal(false);
    const [uploadError, setUploadError] = createSignal<string | null>(null);
    const [isParsingFile, setIsParsingFile] = createSignal(false);
    let fileInputRef: HTMLInputElement | undefined;

    // ── Step 3: Preview ──
    const [validatedRows, setValidatedRows] = createSignal<ValidatedBulkRow[]>([]);
    const [previewTab, setPreviewTab] = createSignal<PreviewTab>('valid');

    // ── Step 4: Doc Upload ──
    const [transitionGroups, setTransitionGroups] = createSignal<StageTransitionGroup[]>([]);
    const [docUploads, setDocUploads] = createSignal<DocUpload[]>([]);

    // ── Step 5: Result ──
    const [updatedCount, setUpdatedCount] = createSignal(0);
    const [skippedCount, setSkippedCount] = createSignal(0);
    const [errorCount, setErrorCount] = createSignal(0);
    const [isProcessing, setIsProcessing] = createSignal(false);
    const [docAttachedCount, setDocAttachedCount] = createSignal(0);

    // ── Derived counts ──
    const validCount = createMemo(() => validatedRows().filter(r => r.status === 'valid').length);
    const skipCount = createMemo(() => validatedRows().filter(r => r.status === 'skip').length);
    const errCount = createMemo(() => validatedRows().filter(r => r.status === 'error').length);

    // ── Scope preview count ──
    const scopeCount = createMemo(() => {
        let sitesList = [...siteMasterRecords];
        if (selectedType() !== 'ALL') {
            sitesList = sitesList.filter(s => s.project_type === selectedType());
        }
        if (selectedStages().length > 0) {
            sitesList = sitesList.filter(s => selectedStages().includes(s.stage || 'imported'));
        }
        return sitesList.length;
    });

    // ── Reset ──
    const resetModal = () => {
        setStep(1);
        setSelectedType((props.projectType?.toUpperCase() as ProjectType) || 'ALL');
        setSelectedStages([]);
        setIsDragActive(false);
        setUploadError(null);
        setIsParsingFile(false);
        setValidatedRows([]);
        setPreviewTab('valid');
        setTransitionGroups([]);
        setDocUploads([]);
        setUpdatedCount(0);
        setSkippedCount(0);
        setErrorCount(0);
        setIsProcessing(false);
        setDocAttachedCount(0);
    };

    const handleClose = () => { resetModal(); props.onClose(); };

    // ── Step 1: Download Template ──
    const handleDownloadTemplate = () => {
        const scope: TemplateScope = { projectType: selectedType(), stageFilters: selectedStages() };
        generateBulkUpdateTemplate(scope);
    };

    const toggleStage = (stage: string) => {
        setSelectedStages(prev =>
            prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
        );
    };

    // ── Step 2: File handling ──
    const processFile = async (file: File) => {
        setUploadError(null);
        setIsParsingFile(true);
        try {
            const result = await parseBulkTemplate(file);
            if (!result.isValid) {
                setUploadError('format_unknown');
                setIsParsingFile(false);
                return;
            }
            setValidatedRows(result.rows);
            // Build transition groups for step 4
            setTransitionGroups(groupByTransition(result.rows));
            setPreviewTab('valid');
            setStep(3);
        } catch {
            setUploadError('parse_error');
        }
        setIsParsingFile(false);
    };

    const handleFileDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
        if (e.dataTransfer?.files[0]) processFile(e.dataTransfer.files[0]);
    };
    const handleFileInput = (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        if (target.files?.[0]) processFile(target.files[0]);
    };

    // ── Step 4: Doc file management ──
    const addDocFiles = (transitionKey: string, files: FileList | null) => {
        if (!files) return;
        setDocUploads(prev => {
            const existing = prev.find(d => d.transitionKey === transitionKey);
            const newFiles = Array.from(files);
            if (existing) {
                return prev.map(d => d.transitionKey === transitionKey
                    ? { ...d, files: [...d.files, ...newFiles] }
                    : d
                );
            }
            return [...prev, { transitionKey, files: newFiles }];
        });
    };
    const removeDocFile = (transitionKey: string, fileIdx: number) => {
        setDocUploads(prev => prev.map(d =>
            d.transitionKey === transitionKey
                ? { ...d, files: d.files.filter((_, i) => i !== fileIdx) }
                : d
        ));
    };

    // ── Step 5: Execute ──
    const executeUpdates = (withDocs: boolean) => {
        setIsProcessing(true);
        setTimeout(() => {
            const vc = validCount();
            const sc = skipCount();
            const ec = errCount();
            setUpdatedCount(vc);
            setSkippedCount(sc);
            setErrorCount(ec);

            // Count docs
            if (withDocs) {
                const sitesWithDocs = transitionGroups()
                    .filter(g => docUploads().some(d => d.transitionKey === `${g.fromStage}→${g.toStage}` && d.files.length > 0))
                    .reduce((sum, g) => sum + g.count, 0);
                setDocAttachedCount(sitesWithDocs);
            }

            setStep(5);
            setIsProcessing(false);
            if (props.onSuccess) props.onSuccess(vc);
        }, 800);
    };

    // ── Export report ──
    const exportReport = () => {
        const reportData = validatedRows().map(r => ({
            ...r.row,
            import_status: r.status,
            import_reason: r.reason || 'Sukses',
            changed_fields: r.changedFields?.join(', ') || '',
        }));
        const ws = xlsx.utils.json_to_sheet(reportData);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Import_Result');
        const wbOut = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Bulk_Update_Result_${new Date().getTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
    };

    // ── Step indicator ──
    const steps_config = [
        { n: 1, label: 'Scope' },
        { n: 2, label: 'Upload' },
        { n: 3, label: 'Preview' },
        { n: 4, label: 'Dokumen' },
        { n: 5, label: 'Hasil' },
    ];

    // ── Filtered preview rows ──
    const filteredPreview = () => validatedRows().filter(r => r.status === previewTab());

    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[92vh] overflow-hidden">
                    
                    {/* RBAC Guard */}
                    <Show when={can('site.bulk_update')} fallback={
                        <div class="p-8 text-center flex flex-col items-center">
                            <XCircleIcon class="w-12 h-12 text-red-400 mb-3" />
                            <h2 class="text-xl font-bold text-slate-800 mb-2">Akses Ditolak</h2>
                            <p class="text-slate-500 text-sm mb-6">Anda tidak memiliki izin untuk Bulk Update Stage.</p>
                            <button onClick={handleClose} class="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium">Tutup</button>
                        </div>
                    }>
                        {/* ── Header ── */}
                        <div class="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50/50 shrink-0">
                            <div>
                                <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <FileSpreadsheetIcon class="w-5 h-5 text-blue-600" /> Bulk Update Stage
                                </h2>
                                <p class="text-sm text-slate-500 mt-0.5">Update stage untuk banyak site sekaligus dari Excel</p>
                            </div>
                            <button onClick={handleClose} class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <XIcon class="w-5 h-5" />
                            </button>
                        </div>

                        {/* ── Step Indicator ── */}
                        <div class="px-6 pt-4 pb-3 border-b border-slate-100 shrink-0">
                            <div class="flex items-center gap-1">
                                <For each={steps_config}>
                                    {(s, i) => (
                                        <div class="flex items-center">
                                            <div class={clsx(
                                                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                                                step() === s.n
                                                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200'
                                                    : step() > s.n
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-slate-100 text-slate-400'
                                            )}>
                                                <Show when={step() > s.n} fallback={<span>{s.n}</span>}>
                                                    <CheckCircle2Icon class="w-3.5 h-3.5" />
                                                </Show>
                                                <span class="hidden sm:inline">{s.label}</span>
                                            </div>
                                            <Show when={i() < steps_config.length - 1}>
                                                <div class={clsx('w-6 h-px mx-1', step() > s.n ? 'bg-emerald-300' : 'bg-slate-200')} />
                                            </Show>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>

                        {/* ── Body ── */}
                        <div class="p-6 flex-1 overflow-y-auto custom-scrollbar">
                            <Switch>
                                {/* ════ STEP 1: SCOPE & DOWNLOAD ════ */}
                                <Match when={step() === 1}>
                                    <div class="space-y-6 max-w-2xl mx-auto">
                                        <div class="text-center mb-2">
                                            <FilterIcon class="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                            <h3 class="text-lg font-bold text-slate-800">Pilih Scope Template</h3>
                                            <p class="text-sm text-slate-500 mt-1">Filter site yang akan dimasukkan ke template Excel</p>
                                        </div>

                                        <div>
                                            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tipe Pekerjaan</label>
                                            <select
                                                value={selectedType()}
                                                onChange={e => setSelectedType(e.currentTarget.value as ProjectType | 'ALL')}
                                                class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                                            >
                                                <For each={PROJECT_TYPES}>{t => <option value={t.id}>{t.label}</option>}</For>
                                            </select>
                                        </div>

                                        <div>
                                            <div class="flex items-center justify-between mb-2">
                                                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Stage Saat Ini</label>
                                                <button
                                                    onClick={() => setSelectedStages([])}
                                                    class="text-xs text-blue-600 hover:underline font-medium"
                                                >
                                                    {selectedStages().length > 0 ? 'Reset' : 'Semua (default)'}
                                                </button>
                                            </div>
                                            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                <For each={STAGE_ORDER}>
                                                    {stage => (
                                                        <button
                                                            onClick={() => toggleStage(stage)}
                                                            class={clsx(
                                                                'text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                                                                selectedStages().includes(stage)
                                                                    ? 'bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-200'
                                                                    : selectedStages().length === 0
                                                                        ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                                                            )}
                                                        >
                                                            <Show when={selectedStages().includes(stage)}>
                                                                <CheckCircle2Icon class="w-3 h-3 inline mr-1" />
                                                            </Show>
                                                            {STAGE_LABELS[stage] || stage}
                                                        </button>
                                                    )}
                                                </For>
                                            </div>
                                        </div>

                                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                            <p class="text-sm text-blue-800 font-medium">
                                                Template akan berisi <strong class="text-lg">{scopeCount()}</strong> sites
                                            </p>
                                        </div>

                                        <div class="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={handleDownloadTemplate}
                                                disabled={scopeCount() === 0}
                                                class="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50"
                                            >
                                                <DownloadIcon class="w-5 h-5" /> Download Template
                                            </button>
                                            <button
                                                onClick={() => setStep(2)}
                                                class="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                <UploadIcon class="w-5 h-5" /> Upload Template
                                            </button>
                                        </div>
                                    </div>
                                </Match>

                                {/* ════ STEP 2: UPLOAD ════ */}
                                <Match when={step() === 2}>
                                    <div class="space-y-6 max-w-2xl mx-auto">
                                        <div class="text-center mb-2">
                                            <UploadIcon class="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                            <h3 class="text-lg font-bold text-slate-800">Upload Template yang Sudah Diisi</h3>
                                            <p class="text-sm text-slate-500 mt-1">Drag & drop file .xlsx atau .xls</p>
                                        </div>

                                        <div
                                            onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
                                            onDragLeave={e => { e.preventDefault(); setIsDragActive(false); }}
                                            onDrop={handleFileDrop}
                                            class={clsx(
                                                'border-2 border-dashed rounded-xl p-12 text-center transition-all bg-white cursor-pointer',
                                                isDragActive() ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                                            )}
                                            onClick={() => fileInputRef?.click()}
                                        >
                                            <input ref={fileInputRef} type="file" class="hidden" accept=".xlsx,.xls" onChange={handleFileInput} />
                                            <Show when={isParsingFile()} fallback={
                                                <>
                                                    <FileSpreadsheetIcon class={clsx('w-12 h-12 mx-auto mb-4', isDragActive() ? 'text-blue-500' : 'text-slate-300')} />
                                                    <p class="text-base font-semibold text-slate-700 mb-1">Drag & drop file ke sini</p>
                                                    <p class="text-sm text-slate-400 mb-5">Menerima format .xlsx dan .xls</p>
                                                    <span class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors shadow-sm inline-block">
                                                        Browse Files
                                                    </span>
                                                </>
                                            }>
                                                <div class="flex flex-col items-center">
                                                    <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                                                    <p class="text-sm font-medium text-slate-600">Membaca dan memvalidasi file...</p>
                                                </div>
                                            </Show>
                                        </div>

                                        <Show when={uploadError() === 'format_unknown'}>
                                            <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
                                                <div class="flex gap-3">
                                                    <AlertTriangleIcon class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 class="font-bold text-amber-800 text-sm">Format file tidak dikenali</h4>
                                                        <p class="text-sm text-amber-700 mt-1">Gunakan template resmi dari Sistem.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Show>
                                    </div>
                                </Match>

                                {/* ════ STEP 3: PREVIEW ════ */}
                                <Match when={step() === 3}>
                                    <div class="space-y-4">
                                        <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
                                            <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                                                <EyeIcon class="w-4 h-4" /> Analysis & Preview
                                            </h3>
                                            <div class="flex gap-4 text-xs font-bold">
                                                <span class="text-emerald-600 flex items-center gap-1"><CheckCircle2Icon class="w-3.5 h-3.5" /> {validCount()}</span>
                                                <span class="text-amber-600 flex items-center gap-1"><AlertTriangleIcon class="w-3.5 h-3.5" /> {skipCount()}</span>
                                                <span class="text-red-500 flex items-center gap-1"><XCircleIcon class="w-3.5 h-3.5" /> {errCount()}</span>
                                            </div>
                                        </div>

                                        <div class="flex border-b border-slate-200">
                                            <For each={[
                                                { key: 'valid' as const, label: `Akan Diupdate (${validCount()})`, color: 'emerald' },
                                                { key: 'skip' as const, label: `Dilewati (${skipCount()})`, color: 'amber' },
                                                { key: 'error' as const, label: `Error (${errCount()})`, color: 'red' },
                                            ]}>
                                                {tab => (
                                                    <button
                                                        onClick={() => setPreviewTab(tab.key)}
                                                        class={clsx(
                                                            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
                                                            previewTab() === tab.key
                                                                ? `border-blue-500 text-blue-700 bg-blue-50/50`
                                                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                                        )}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                )}
                                            </For>
                                        </div>

                                        <div class="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm overflow-x-auto">
                                            <table class="w-full text-left text-sm whitespace-nowrap">
                                                <thead class="bg-slate-50 border-b border-slate-200">
                                                    <tr>
                                                        <th class="px-4 py-2.5 font-bold text-slate-600 text-xs uppercase w-10">#</th>
                                                        <th class="px-4 py-2.5 font-bold text-slate-600 text-xs uppercase">Unique Key</th>
                                                        <Show when={previewTab() === 'valid'} fallback={
                                                            <th class="px-4 py-2.5 font-bold text-slate-600 text-xs uppercase">Alasan</th>
                                                        }>
                                                            <th class="px-4 py-2.5 font-bold text-slate-600 text-xs uppercase">Transition</th>
                                                        </Show>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <For each={filteredPreview()} fallback={
                                                        <tr><td colspan="3" class="text-center py-8 text-slate-400">Tidak ada data</td></tr>
                                                    }>
                                                        {(r, i) => (
                                                            <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                                <td class="px-4 py-2 text-slate-400 text-xs">{i() + 1}</td>
                                                                <td class="px-4 py-2 font-mono text-xs">{r.row.unique_key}</td>
                                                                <Show when={previewTab() === 'valid'} fallback={
                                                                    <td class="px-4 py-2 text-xs text-slate-600">{r.reason}</td>
                                                                }>
                                                                    <td class="px-4 py-2 text-xs font-bold text-slate-700">
                                                                        {r.row.curr_stage} <ArrowRightIcon class="w-3 h-3 inline mx-1" /> {r.row.new_stage}
                                                                    </td>
                                                                </Show>
                                                            </tr>
                                                        )}
                                                    </For>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Match>

                                {/* ════ STEP 4: DOC UPLOAD ════ */}
                                <Match when={step() === 4}>
                                    <div class="space-y-5 max-w-3xl mx-auto">
                                        <div class="text-center mb-2">
                                            <PaperclipIcon class="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                            <h3 class="text-lg font-bold text-slate-800">Upload Dokumen Pendukung</h3>
                                            <p class="text-sm text-slate-500 mt-1">Lampirkan dokumen untuk setiap kelompok perubahan stage</p>
                                        </div>

                                        <For each={transitionGroups()}>
                                            {(group) => {
                                                const key = `${group.fromStage}→${group.toStage}`;
                                                const uploads = () => docUploads().find(d => d.transitionKey === key);
                                                return (
                                                    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                                        <div class="flex items-start gap-3 mb-3">
                                                            <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">{group.icon}</div>
                                                            <div>
                                                                <h4 class="font-bold text-slate-800 text-sm capitalize">{group.label}</h4>
                                                                <p class="text-xs text-slate-500 mt-0.5">Contoh: {group.docExamples}</p>
                                                            </div>
                                                            <div class="ml-auto bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500">
                                                                {group.count} SITES
                                                            </div>
                                                        </div>

                                                        {/* Uploaded files list */}
                                                        <div class="space-y-1.5 mb-3">
                                                            <For each={uploads()?.files}>
                                                                {(f, fi) => (
                                                                    <div class="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-xs text-emerald-700 font-medium">
                                                                        <span class="truncate">{f.name}</span>
                                                                        <button onClick={() => removeDocFile(key, fi())} class="text-red-400 hover:text-red-600">✕</button>
                                                                    </div>
                                                                )}
                                                            </For>
                                                        </div>

                                                        <label class="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">
                                                            <UploadIcon class="w-3.5 h-3.5" /> Pilih File
                                                            <input type="file" multiple class="hidden" onChange={e => addDocFiles(key, e.currentTarget.files)} />
                                                        </label>
                                                    </div>
                                                );
                                            }}
                                        </For>
                                    </div>
                                </Match>

                                {/* ════ STEP 5: RESULT ════ */}
                                <Match when={step() === 5}>
                                    <div class="flex flex-col items-center justify-center py-8">
                                        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-5 ring-4 ring-emerald-50 text-emerald-600">
                                            <CheckCircle2Icon class="w-8 h-8" />
                                        </div>
                                        <h3 class="text-xl font-bold text-slate-800 mb-1">Bulk Update Selesai!</h3>
                                        <p class="text-slate-500 text-sm mb-6">Database telah diperbarui dengan data baru.</p>

                                        <div class="w-full max-w-md bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm mb-6 uppercase tracking-wider font-bold text-xs">
                                            <div class="flex justify-between items-center text-emerald-700 border-b border-slate-100 pb-2">
                                                <span>Berhasil diupdate</span>
                                                <span class="text-lg">{updatedCount()}</span>
                                            </div>
                                            <div class="flex justify-between items-center text-slate-500">
                                                <span>Dilewati</span>
                                                <span>{skippedCount()}</span>
                                            </div>
                                            <div class="flex justify-between items-center text-red-600">
                                                <span>Gagal/Error</span>
                                                <span>{errorCount()}</span>
                                            </div>
                                        </div>

                                        <div class="flex gap-3">
                                            <button onClick={exportReport} class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 text-xs transition-colors">
                                                <DownloadIcon class="w-4 h-4" /> Download Laporan
                                            </button>
                                            <button onClick={handleClose} class="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors">
                                                <EyeIcon class="w-4 h-4" /> Tutup
                                            </button>
                                        </div>
                                    </div>
                                </Match>
                            </Switch>
                        </div>

                        {/* ── Footer Navigation ── */}
                        <div class="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center shrink-0">
                            <div>
                                <Show when={step() === 1}>
                                    <button onClick={handleClose} class="px-5 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 font-bold rounded-lg transition-colors text-xs uppercase tracking-widest">
                                        Batal
                                    </button>
                                </Show>
                                <Show when={step() >= 2 && step() <= 4}>
                                    <button onClick={() => setStep(s => (s - 1) as Step)} class="px-4 py-2 text-slate-600 hover:bg-slate-200 bg-slate-100 font-bold rounded-lg transition-colors text-xs flex items-center gap-2 uppercase tracking-widest">
                                        <ArrowLeftIcon class="w-3.5 h-3.5" /> Kembali
                                    </button>
                                </Show>
                            </div>

                            <div class="flex gap-3">
                                <Show when={step() === 3}>
                                    <button
                                        onClick={() => setStep(4)}
                                        disabled={validCount() === 0}
                                        class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all text-xs flex items-center gap-2 shadow-md uppercase tracking-widest disabled:opacity-50"
                                    >
                                        Proceed to Docs <ArrowRightIcon class="w-3.5 h-3.5" />
                                    </button>
                                </Show>
                                <Show when={step() === 4}>
                                    <button
                                        onClick={() => executeUpdates(false)}
                                        disabled={isProcessing()}
                                        class="px-4 py-2 text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 font-bold rounded-lg transition-colors text-xs flex items-center gap-2 uppercase tracking-widest"
                                    >
                                        <SkipForwardIcon class="w-3.5 h-3.5" /> Tanpa Dokumen
                                    </button>
                                    <button
                                        onClick={() => executeUpdates(true)}
                                        disabled={isProcessing() || docUploads().every(d => d.files.length === 0)}
                                        class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all text-xs flex items-center gap-2 shadow-md uppercase tracking-widest disabled:opacity-50"
                                    >
                                        Proses & Upload <CheckCircle2Icon class="w-3.5 h-3.5" />
                                    </button>
                                </Show>
                            </div>
                        </div>
                    </Show>
                </div>
            </div>
        </Show>
    );
};

export default BulkStageUpdateModal;
