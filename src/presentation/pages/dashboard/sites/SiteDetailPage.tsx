import { createSignal, createMemo, For, Show, onMount, createResource } from 'solid-js';
import type { Component } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
    siteMasterRecords, projects, teams, people,
    siteMaterials, siteCosts, skpRecords,
    siteBoQRecords, siteStageLogs, mockSiteFiles, terminPengajuanRecords
} from '../data/mockData';
import UpdateStageModal from '../../../components/modals/UpdateStageModal';
import UploadSiteFileModal from './components/UploadSiteFileModal';
import UploadSiteEvidenceModal from './components/UploadSiteEvidenceModal';
import SiteFilePreviewModal from './components/SiteFilePreviewModal';
import SiteEvidencePreviewModal from './components/SiteEvidencePreviewModal';
import type { SiteFile } from '../../../../domain/entities/site-file.entity';
import type { SiteEvidence } from '../../../../domain/entities/site-evidence.entity';
import { GetSiteByIdInteractor } from '../../../../application/use-cases/get-site-by-id.use-case';
import { GetSiteEvidenceInteractor } from '../../../../application/use-cases/get-site-evidence.use-case';
import { siteRepository } from '../../../../infrastructure/repositories/site.repository.impl';

const getSiteById = new GetSiteByIdInteractor(siteRepository);
const getSiteEvidence = new GetSiteEvidenceInteractor(siteRepository);

// Icons
const ArrowLeft = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>;
const DollarSign = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const FileText = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>;
const Upload = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>;
const CheckCircle2 = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>;
const Check = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const ImageIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>;
const Send = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;
const Edit = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>;
const Plus = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>;
const X = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>;
const AlertTriangle = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>;
const Search = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const EyeIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
const DownloadIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>;
const Copy = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>;
const Printer = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>;
const ChevronDown = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>;

const clsx = (...classes: any[]) => classes.flat().filter(Boolean).join(' ');

interface SiteDetailPageProps {
    siteId: string;
    onBack: () => void;
}

const SiteDetailPage: Component<SiteDetailPageProps> = (props) => {
    const [activeTab, setActiveTab] = createSignal<'details' | 'costs'>('details');
    const [detailsSubTab, setDetailsSubTab] = createSignal<'material' | 'skp'>('material');
    const [historyExpanded, setHistoryExpanded] = createSignal(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = createSignal(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = createSignal(false);
    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = createSignal(false);

    // Site File Preview State
    const [selectedFile, setSelectedFile] = createSignal<SiteFile | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = createSignal(false);

    // Site Evidence Preview State
    const [selectedEvidence, setSelectedEvidence] = createSignal<SiteEvidence | null>(null);
    const [isEvidencePreviewOpen, setIsEvidencePreviewOpen] = createSignal(false);
    const [dummyStage, setDummyStage] = createSignal<string | null>(null);

    // Data Resolution
    const [siteDetail, { refetch: refetchSite }] = createResource(() => props.siteId, (id) => getSiteById.execute(id));
    const [siteFiles, { refetch: refetchFiles }] = createResource(() => props.siteId, (id) => siteRepository.getFiles(id));
    const [siteEvidenceData, { refetch: refetchEvidence }] = createResource(() => props.siteId, (id) => getSiteEvidence.execute(id));

    const site = createMemo(() => {
        const baseSite = siteDetail();
        if (!baseSite) return null;
        if (dummyStage()) return { ...baseSite, stage: dummyStage()! };
        return baseSite;
    });
    const project = createMemo(() => projects.find(p => p.id === site()?.project_id) || projects[0]);
    const team = createMemo(() => teams.find(t => t.name === (site() as any)?.team_assigned));
    const materials = createMemo(() => siteBoQRecords.filter(m => m.siteId === props.siteId));
    const evidenceList = createMemo(() => siteEvidenceData() || []);
    const costs = createMemo(() => siteCosts.filter(c => c.siteId === props.siteId));
    const skps = createMemo(() => skpRecords.filter(s => s.siteId === props.siteId));
    const boq = createMemo(() => siteBoQRecords.filter(b => b.siteId === props.siteId));
    const stageHistory = createMemo(() => siteStageLogs.filter(l => l.site_master_id === props.siteId));
    const files = createMemo(() => siteFiles() || []);

    const STAGE_GROUPS = [
        { label: 'Assigned', keys: ['assigned'] },
        { label: 'Survey', keys: ['survey', 'survey_nok'] },
        { label: 'ERFIN', keys: ['erfin_diproses', 'erfin_ready'] },
        { label: 'Permit', keys: ['permit_process', 'permit_ready'] },
        { label: 'Akses', keys: ['akses_process', 'akses_ready'] },
        { label: 'Implementasi', keys: ['implementasi', 'rfi_done', 'rfs_done', 'dokumen_done'] },
        { label: 'BAST', keys: ['bast'] },
        { label: 'Invoice', keys: ['invoice'] },
        { label: 'Completed', keys: ['completed'] }
    ];

    const activeIndex = createMemo(() => {
        const s = site()?.stage;
        if (!s || s === 'imported') return 0;
        const idx = STAGE_GROUPS.findIndex(group => group.keys.includes(s));
        return idx === -1 ? 0 : idx;
    });

    const currentStageIndex = activeIndex; // Alias for backward compatibility if needed

    const handleUpdateStage = (newStage: string, notes?: string) => {
        console.log('Stage transition triggered (Dummy Mode):', { newStage, notes });
        setDummyStage(newStage);
        setIsUpdateModalOpen(false);
    };

    const fileColumnDefs = [
        {
            headerName: 'Title / Filename',
            flex: 1,
            minWidth: 250,
            cellRenderer: (params: any) => {
                const file = params.data;
                if (!file) return null;
                return (
                    <div class="flex flex-col py-2 leading-tight">
                        <span class="text-slate-800 font-bold">{file.title || 'No Title'}</span>
                        <span class="text-[10px] text-slate-400 font-mono truncate">{file.original_name}</span>
                    </div>
                );
            }
        },
        {
            field: 'mime_type',
            headerName: 'Mime Type',
            width: 120,
            cellRenderer: (params: any) => {
                const ext = params.value?.split('/').pop() || 'file';
                return (
                    <div class="flex items-center h-full">
                        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] uppercase font-bold tracking-tighter">
                            {ext}
                        </span>
                    </div>
                );
            }
        },
        {
            field: 'uploaded_by',
            headerName: 'Uploaded By',
            width: 150,
            cellRenderer: (params: any) => <span class="font-semibold text-slate-600">{params.value || 'System'}</span>
        },
        {
            field: 'size',
            headerName: 'Size',
            width: 100,
            valueGetter: (params: any) => params.data ? `${(params.data.size / 1024).toFixed(0)} KB` : '—'
        },
        {
            field: 'uploaded_at',
            headerName: 'Uploaded At',
            width: 150,
            cellRenderer: (params: any) => <span class="text-xs text-slate-400 font-medium">{params.value ? new Date(params.value).toLocaleDateString() : '—'}</span>
        },
        {
            headerName: 'Action',
            width: 80,
            sortable: false,
            filter: false,
            pinned: 'right',
            cellRenderer: (params: any) => (
                <div class="flex items-center justify-center h-full">
                    <button
                        onClick={() => {
                            setSelectedFile(params.data);
                            setIsPreviewModalOpen(true);
                        }}
                        class="p-2 text-blue-600 hover:bg-blue-50 transition-all bg-white border border-blue-100 rounded-lg shadow-sm"
                    >
                        <EyeIcon class="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const fileGridOptions = {
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true,
            suppressMovable: true,
            cellStyle: { display: 'flex', alignItems: 'center' }
        },
        headerHeight: 50,
        rowHeight: 65,
        animateRows: true,
        suppressCellFocus: true,
    };

    return (
        <Show when={!siteDetail.loading} fallback={
            <div class="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p class="text-slate-500 font-medium animate-pulse">Memuat detail site...</p>
            </div>
        }>
            <Show when={siteDetail.error}>
                <div class="bg-red-50 border border-red-200 p-6 rounded-xl flex flex-col items-center gap-4 text-center my-10">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <AlertTriangle class="w-6 h-6" />
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">Gagal Memuat Data</h3>
                        <p class="text-slate-600 max-w-md mt-1">Terjadi kesalahan saat mengambil informasi site. Silakan coba kembali atau hubungi sistem administrator.</p>
                    </div>
                    <button
                        onClick={() => props.onBack()}
                        class="px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </Show>

            <Show when={siteDetail()} fallback={
                <div class="bg-amber-50 border border-amber-200 p-6 rounded-xl flex flex-col items-center gap-4 text-center my-10">
                    <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <Search class="w-6 h-6" />
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">Site Tidak Ditemukan</h3>
                        <p class="text-slate-600 max-w-md mt-1">Data site dengan ID {props.siteId} tidak tersedia di database.</p>
                    </div>
                    <button
                        onClick={() => props.onBack()}
                        class="px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            }>
                <div class="space-y-6 pb-16 animate-in fade-in duration-300">
                    {/* Modal for file preview */}
                    <SiteFilePreviewModal
                        show={isPreviewModalOpen()}
                        file={selectedFile()}
                        onClose={() => {
                            setIsPreviewModalOpen(false);
                            setSelectedFile(null);
                        }}
                    />

                    <UploadSiteEvidenceModal
                        isOpen={isEvidenceModalOpen()}
                        siteId={props.siteId}
                        onClose={() => setIsEvidenceModalOpen(false)}
                        onSuccess={() => {
                            refetchEvidence();
                        }}
                    />
                    <SiteEvidencePreviewModal
                        show={isEvidencePreviewOpen()}
                        evidence={selectedEvidence()}
                        onClose={() => {
                            setIsEvidencePreviewOpen(false);
                            setSelectedEvidence(null);
                        }}
                    />
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <button
                                onClick={() => props.onBack()}
                                class="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200"
                            >
                                <ArrowLeft class="w-5 h-5 text-slate-400" />
                            </button>
                            <div>
                                <h1 class="text-3xl font-semibold text-[#1e293b] tracking-tight">Detail Site</h1>
                                <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                                    {site()?.site_name}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <button
                                onClick={() => setIsUpdateModalOpen(true)}
                                class="px-5 py-2.5 bg-[#2563eb] text-white font-semibold rounded-lg text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
                            >
                                Update Stage
                            </button>
                            <button
                                class="px-5 py-2.5 bg-[#fbbf24] text-white font-semibold rounded-lg text-sm shadow-md hover:bg-yellow-500 transition-all flex items-center gap-2"
                            >
                                Edit Site
                            </button>
                        </div>
                    </div>

                    {/* Advanced Stage Stepper Section */}
                    <div class="bg-white rounded-xl border border-slate-200 shadow-sm border-t-4 border-t-blue-500 p-8 pt-10 pb-16">
                        <div class="flex items-center justify-between relative px-2">
                            {/* Connecting Lines Context */}
                            <div class="absolute top-4 left-0 w-full h-0.5 z-0 flex rounded-full overflow-hidden px-10">
                                <For each={STAGE_GROUPS}>
                                    {(_, idx) => {
                                        if (idx() === STAGE_GROUPS.length - 1) return null;
                                        const isCompletedLine = activeIndex() > idx();
                                        return (
                                            <div class="flex-1 h-full flex items-center justify-center">
                                                <div class={clsx("w-full h-full transition-all duration-700", isCompletedLine ? "bg-emerald-500" : "bg-slate-100")} />
                                            </div>
                                        );
                                    }}
                                </For>
                            </div>

                            <For each={STAGE_GROUPS}>
                                {(group, idx) => {
                                    const isPast = createMemo(() => activeIndex() > idx());
                                    const isCurrent = createMemo(() => activeIndex() === idx());
                                    const isReached = createMemo(() => isPast() || isCurrent());

                                    const isPermitGroup = group.label === 'Permit';
                                    const eData = createMemo(() => (site() as any)?.extra_data || {});
                                    const permitExpiry = createMemo(() => (eData() as any)?.permit_expiry_date);

                                    // Find the date this stage group was reached
                                    const reachedDate = createMemo(() => {
                                        const groupLogs = stageHistory().filter(log => group.keys.includes(log.to_stage));
                                        if (groupLogs.length === 0) return null;
                                        // Sort to find earliest entry
                                        groupLogs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                                        return new Date(groupLogs[0].created_at);
                                    });

                                    const permitInfo = createMemo(() => {
                                        let permitDaysText = null;
                                        let permitDaysColor = 'text-slate-500';
                                        let permitNodeColorOverride = null;
                                        let permitNodeTextOverride = null;

                                        if (isPermitGroup && permitExpiry()) {
                                            const daysLeft = Math.floor((new Date(permitExpiry()).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                            if (daysLeft < 0) {
                                                permitDaysText = `✗ Kedaluwarsa ${new Date(permitExpiry()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`;
                                                permitDaysColor = 'text-red-600 font-bold';
                                                permitNodeColorOverride = 'border-red-500 ring-4 ring-red-100 bg-red-50';
                                                permitNodeTextOverride = 'text-red-600 font-bold';
                                            } else if (daysLeft <= 14) {
                                                permitDaysText = `⚠ Berlaku s/d ${new Date(permitExpiry()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`;
                                                permitDaysColor = 'text-amber-600 font-bold';
                                                permitNodeColorOverride = 'border-amber-500 ring-4 ring-amber-100 bg-amber-50';
                                                permitNodeTextOverride = 'text-amber-600 font-bold';
                                            } else {
                                                permitDaysText = `Berlaku s/d ${new Date(permitExpiry()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`;
                                                permitDaysColor = 'text-slate-500';
                                            }
                                        }

                                        return { permitDaysText, permitDaysColor, permitNodeColorOverride, permitNodeTextOverride };
                                    });

                                    // Node Appearance
                                    let nodeClass = createMemo(() => {
                                        if (isPast()) return "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20";
                                        if (isCurrent()) {
                                            return permitInfo().permitNodeColorOverride || "bg-white text-blue-600 border-blue-500 ring-4 ring-blue-100 animate-pulse";
                                        }
                                        return "bg-white text-slate-300 border-slate-200";
                                    });

                                    let textClass = createMemo(() => {
                                        if (isPast()) return "text-slate-700 font-bold";
                                        if (isCurrent()) return permitInfo().permitNodeTextOverride || "text-blue-700 font-extrabold";
                                        return "text-slate-400";
                                    });

                                    return (
                                        <div class="relative z-10 flex flex-col items-center group">
                                            <div class={clsx(
                                                "w-8 h-8 rounded-full flex items-center justify-center border-[3px] shadow-sm mb-3 font-bold text-xs transition-all duration-500",
                                                nodeClass()
                                            )}>
                                                <Show when={isPast()} fallback={idx() + 1}>
                                                    <CheckCircle2 class="w-5 h-5 text-white" />
                                                </Show>
                                            </div>
                                            <span class={clsx("text-[11px] font-bold whitespace-nowrap transition-colors duration-300", textClass())}>
                                                {group.label}
                                            </span>

                                            {/* Meta texts beneath */}
                                            <div class="absolute top-16 w-38 text-center flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity duration-300">
                                                {/* Line 1: Date reached */}
                                                <Show when={isReached() && reachedDate()}>
                                                    <span class="text-[10px] text-slate-500 whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded border border-slate-100 shadow-sm mb-1 uppercase tracking-tighter">
                                                        {reachedDate()!.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </Show>

                                                {/* Line 2: Permit Expiry if applicable */}
                                                <Show when={isReached() && isPermitGroup && permitInfo().permitDaysText}>
                                                    <span class={clsx(
                                                        "text-[9px] mt-0.5 whitespace-nowrap bg-white/90 px-1.5 py-0.5 rounded border border-slate-100 shadow-sm font-semibold uppercase tracking-tighter",
                                                        permitInfo().permitDaysColor
                                                    )}>
                                                        {permitInfo().permitDaysText}
                                                    </span>
                                                </Show>
                                            </div>
                                        </div>
                                    );
                                }}
                            </For>
                        </div>
                    </div>

                    {/* Content Area Grid */}
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Informasi Site Card */}
                        <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                            <h3 class="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-50 pb-4">Informasi Site</h3>
                            <div class="space-y-4">
                                {/* <div class="grid grid-cols-3 gap-2 py-0.5">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">ID</span>
                                    <span class="col-span-2 text-sm font-semibold text-slate-700 break-all">{site()?.id || '—'}</span>
                                </div> */}
                                <div class="grid grid-cols-3 gap-2 py-0.5">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Project</span>
                                    <span class="col-span-2 text-sm font-semibold text-slate-700 break-words">{project()?.name || '—'}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2 py-0.5">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Site Name</span>
                                    <span class="col-span-2 text-sm font-semibold text-slate-700 break-words">{site()?.site_name || '—'}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2 py-0.5">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Job Name</span>
                                    <span class="col-span-2 text-sm font-semibold text-slate-700 break-words">{site()?.pekerjaan || '—'}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2 py-0.5">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Location</span>
                                    <span class="col-span-2 text-sm font-semibold text-slate-700 break-words">{site()?.lokasi || '—'}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2 py-0.5">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Contract</span>
                                    <span class="col-span-2 text-sm font-semibold text-slate-700 break-all">{site()?.nomor_kontrak || '—'}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2 py-0.5">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Source Info</span>
                                    <span class="col-span-2 text-sm font-semibold text-slate-700 break-words overflow-hidden">{site()?.site_info || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Lainnya Card */}
                        <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                            <h3 class="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-50 pb-4">Informasi Lainnya</h3>
                            <div class="space-y-4">
                                <div class="grid grid-cols-3 gap-2 py-0.5 font-semibold">
                                    <span class="text-xs text-slate-400 uppercase tracking-tight">Max Value</span>
                                    <span class="col-span-2 text-sm text-slate-700 break-words">Rp {(site()?.maximal_budget || 0).toLocaleString()}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2 py-0.5 font-semibold">
                                    <span class="text-xs text-slate-400 uppercase tracking-tight">Est. Cost</span>
                                    <span class="col-span-2 text-sm text-slate-700 break-words">Rp {(site()?.cost_estimated || 0).toLocaleString()}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2 py-0.5 font-semibold">
                                    <span class="text-xs text-slate-400 uppercase tracking-tight">Cost Dibayar</span>
                                    <span class="col-span-2 text-sm text-emerald-500 break-words">Rp 0</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2 py-0.5 font-semibold">
                                    <span class="text-xs text-slate-400 uppercase tracking-tight">Sisa</span>
                                    <span class="col-span-2 text-sm text-orange-500 break-words">Rp {(site()?.maximal_budget || 0).toLocaleString()}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2 py-0.5 font-semibold">
                                    <span class="text-xs text-slate-400 uppercase tracking-tight">Start Date</span>
                                    <span class="col-span-2 text-sm text-slate-700 break-words">{site()?.start?.toString() || '—'}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-2 py-0.5 font-semibold">
                                    <span class="text-xs text-slate-400 uppercase tracking-tight">End Date</span>
                                    <span class="col-span-2 text-sm text-slate-700 break-words">{site()?.end?.toString() || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Team Card */}
                        <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative">
                            <div class="flex items-center justify-between mb-6 border-b border-slate-50 pb-4 gap-2">
                                <h3 class="text-sm font-semibold text-blue-500 break-words">Team: {(site() as any)?.team_assigned || 'Unassigned'}</h3>
                                <button 
                                    onClick={() => setIsUpdateModalOpen(true)}
                                    class="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                                >
                                    <Edit class="w-3.5 h-3.5" />
                                    Edit
                                </button>
                            </div>
                            <div class="flex flex-col items-center justify-center h-[200px] text-slate-400 italic text-sm">
                                No team members assigned
                            </div>
                        </div>
                    </div>

                    {/* Tabs Context */}
                    <div class="mt-8">
                        <div class="flex border-b border-slate-200">
                            <button
                                onClick={() => setActiveTab('details')}
                                class={clsx(
                                    "px-6 py-4 text-sm font-semibold transition-all border-b-2",
                                    activeTab() === 'details' ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent hover:text-slate-600"
                                )}
                            >
                                Details & Evidence
                            </button>
                            <button
                                onClick={() => setActiveTab('costs')}
                                class={clsx(
                                    "px-6 py-4 text-sm font-semibold transition-all border-b-2",
                                    activeTab() === 'costs' ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent hover:text-slate-600"
                                )}
                            >
                                Costs & Payments
                            </button>
                        </div>

                        {/* Content Area */}
                        <div class="mt-6">
                            <Show when={activeTab() === 'details'}>
                                <div class="space-y-6">
                                    {/* Evidence Section */}
                                    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <div class="flex items-center justify-between mb-6">
                                            <h3 class="text-lg font-semibold text-[#1e293b] tracking-tight">Field Evidence</h3>
                                            <button
                                                onClick={() => setIsEvidenceModalOpen(true)}
                                                class="px-5 py-2.5 bg-[#2563eb] text-white font-semibold rounded-lg text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
                                            >
                                                <Upload class="w-4 h-4" />
                                                Upload Evidence
                                            </button>
                                        </div>
                                        <Show when={evidenceList().length > 0} fallback={
                                            <div class="w-full h-40 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-medium italic">
                                                No field evidence or photos uploaded yet.
                                            </div>
                                        }>
                                            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                <For each={evidenceList()}>
                                                    {(item) => (
                                                        <div
                                                            onClick={() => {
                                                                setSelectedEvidence(item);
                                                                setIsEvidencePreviewOpen(true);
                                                            }}
                                                            class="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm transition-all hover:shadow-md cursor-pointer"
                                                        >
                                                            <Show
                                                                when={item.url || item.id}
                                                                fallback={
                                                                    <div class="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                                                        <ImageIcon class="w-8 h-8 mb-2 opacity-50" />
                                                                        <span class="text-[10px] uppercase font-bold tracking-wider">{item.progress_tag}</span>
                                                                    </div>
                                                                }
                                                            >
                                                                <img
                                                                    src={item.url ? ((item.url.startsWith('http') || item.url.startsWith('data:')) ? item.url : `${import.meta.env.VITE_API_URL}${item.url}`) : `${import.meta.env.VITE_API_URL}/api/site-evidence/${item.id}/preview`}
                                                                    alt={item.progress_tag}
                                                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                    onError={(e) => {
                                                                        // If image fails to load, maybe show placeholder? 
                                                                        // But Solid handles standard HTML5 error.
                                                                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                                    }}
                                                                />
                                                            </Show>

                                                            {/* Overlay */}
                                                            <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-3 translate-y-2 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                                                                <p class="text-[10px] font-bold text-white uppercase tracking-widest mb-0.5">{item.progress_tag}</p>
                                                                <p class="text-white/80 text-[10px] line-clamp-1">{item.stage_context || 'No context'}</p>
                                                            </div>

                                                            {/* Date Badge */}
                                                            <div class="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[9px] font-bold text-slate-600 shadow-sm border border-slate-200/50">
                                                                {new Date(item.uploaded_at).toLocaleDateString('id-ID')}
                                                            </div>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>
                                        </Show>
                                    </div>

                                    {/* Nested Tabs Section */}
                                    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div class="flex border-b border-slate-100 bg-slate-50/50">
                                            <button
                                                onClick={() => setDetailsSubTab('material')}
                                                class={clsx(
                                                    "px-8 py-4 text-sm font-semibold transition-all border-b-2",
                                                    detailsSubTab() === 'material' ? "text-blue-600 border-blue-600 bg-white" : "text-slate-400 border-transparent hover:text-slate-600"
                                                )}
                                            >
                                                Material Item
                                            </button>
                                            <button
                                                onClick={() => setDetailsSubTab('skp')}
                                                class={clsx(
                                                    "px-8 py-4 text-sm font-semibold transition-all border-b-2",
                                                    detailsSubTab() === 'skp' ? "text-blue-600 border-blue-600 bg-white" : "text-slate-400 border-transparent hover:text-slate-600"
                                                )}
                                            >
                                                Surat Perintah Ambil Material (SKP)
                                            </button>
                                        </div>

                                        <div class="p-6">
                                            <Show when={detailsSubTab() === 'material'}>
                                                <div class="space-y-6">
                                                    <div class="flex items-center justify-between">
                                                        <div class="flex items-center gap-2">
                                                            <FileText class="w-5 h-5 text-slate-400" />
                                                            <h3 class="text-lg font-semibold text-[#1e293b] tracking-tight">Material List</h3>
                                                        </div>
                                                        <button class="px-5 py-2.5 bg-[#2563eb] text-white font-semibold rounded-lg text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
                                                            <Plus class="w-4 h-4" />
                                                            Tambah Material
                                                        </button>
                                                    </div>

                                                    <div class="flex items-center justify-between gap-4">
                                                        <div class="relative flex-1 max-w-md">
                                                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                                <Search class="w-4 h-4" />
                                                            </span>
                                                            <input
                                                                type="text"
                                                                placeholder="Search materials..."
                                                                class="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                            />
                                                        </div>
                                                        <div class="flex items-center gap-1">
                                                            <button class="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"><Copy class="w-4 h-4" /></button>
                                                            <button class="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"><FileText class="w-4 h-4" /></button>
                                                            <button class="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"><DownloadIcon class="w-4 h-4" /></button>
                                                            <button class="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"><Printer class="w-4 h-4" /></button>
                                                        </div>
                                                    </div>

                                                    <div class="overflow-x-auto">
                                                        <table class="w-full text-left">
                                                            <thead>
                                                                <tr class="border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50/30">
                                                                    <th class="px-4 py-3">Item Code</th>
                                                                    <th class="px-4 py-3">Description</th>
                                                                    <th class="px-4 py-3 text-right">Quantity</th>
                                                                    <th class="px-4 py-3">Unit</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="text-sm">
                                                                <For each={materials()}>
                                                                    {(m) => (
                                                                        <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors font-medium">
                                                                            <td class="px-4 py-4 text-slate-800 uppercase">{m.itemCode}</td>
                                                                            <td class="px-4 py-4 text-slate-600">{m.description}</td>
                                                                            <td class="px-4 py-4 text-right font-semibold text-[#1e293b]">{(m.quantity as any)}</td>
                                                                            <td class="px-4 py-4 text-slate-600 uppercase italic text-xs">{m.unit}</td>
                                                                        </tr>
                                                                    )}
                                                                </For>
                                                                <Show when={materials().length === 0}>
                                                                    <tr class="font-medium">
                                                                        <td class="px-4 py-4 text-slate-800 uppercase">EQP-001</td>
                                                                        <td class="px-4 py-4 text-slate-600">EQP Filter LTE 900</td>
                                                                        <td class="px-4 py-4 text-right font-semibold text-[#1e293b]">1</td>
                                                                        <td class="px-4 py-4 text-slate-600 uppercase italic text-xs">Set</td>
                                                                    </tr>
                                                                </Show>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </Show>

                                            <Show when={detailsSubTab() === 'skp'}>
                                                <div class="space-y-6">
                                                    <div class="flex items-center justify-between">
                                                        <div class="flex items-center gap-2">
                                                            <FileText class="w-5 h-5 text-slate-400" />
                                                            <h3 class="text-lg font-semibold text-[#1e293b] tracking-tight">Surat Perintah Ambil Material (SKP)</h3>
                                                        </div>
                                                        <div class="flex items-center gap-2">
                                                            <button class="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                                                                <Upload class="w-4 h-4" />
                                                                Upload Permit
                                                            </button>
                                                            <button class="px-4 py-2 bg-[#2563eb] text-white font-semibold rounded-lg text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
                                                                <FileText class="w-4 h-4" />
                                                                Create Permit
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <Show when={skps().length > 0} fallback={
                                                        <div class="flex flex-col items-center justify-center py-16 text-slate-400 gap-4">
                                                            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                                <Search class="w-8 h-8 text-slate-200" />
                                                            </div>
                                                            <p class="text-xl font-semibold text-[#1e293b]">Belum ada SKP</p>
                                                        </div>
                                                    }>
                                                        <div class="overflow-x-auto">
                                                            <table class="w-full text-left">
                                                                <thead>
                                                                    <tr class="border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50/30">
                                                                        <th class="px-4 py-3">SKP Number</th>
                                                                        <th class="px-4 py-3">Tanggal</th>
                                                                        <th class="px-4 py-3">Keterangan</th>
                                                                        <th class="px-4 py-3">Status</th>
                                                                        <th class="px-4 py-3 text-right">Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody class="text-sm">
                                                                    <For each={skps()}>
                                                                        {(skp) => (
                                                                            <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                                                <td class="px-4 py-4 font-mono font-semibold text-[#1e293b]">{skp.skpNumber}</td>
                                                                                <td class="px-4 py-4 text-slate-600">{skp.tanggal}</td>
                                                                                <td class="px-4 py-4 text-slate-600 italic text-xs">{(skp as any).keterangan || '—'}</td>
                                                                                <td class="px-4 py-4">
                                                                                    <span class={clsx(
                                                                                        "px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-tighter shadow-sm border",
                                                                                        skp.status === 'Received' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                                                                    )}>
                                                                                        {skp.status}
                                                                                    </span>
                                                                                </td>
                                                                                <td class="px-4 py-4 text-right">
                                                                                    <div class="flex justify-end gap-2">
                                                                                        <button class="p-1.5 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-100 rounded-lg shadow-sm"><FileText class="w-4 h-4" /></button>
                                                                                        <Show when={skp.status !== 'Received'}>
                                                                                            <button
                                                                                                onClick={() => alert('Terima SKP Modal needs implementation')}
                                                                                                class="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors bg-white border border-slate-100 rounded-lg shadow-sm"
                                                                                            >
                                                                                                <CheckCircle2 class="w-4 h-4" />
                                                                                            </button>
                                                                                        </Show>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </For>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </Show>
                                                </div>
                                            </Show>
                                        </div>
                                    </div>

                                    {/* Site Files Section */}
                                    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <div class="p-6">
                                            <div class="flex items-center justify-between mb-6">
                                                <div class="flex items-center gap-2">
                                                    <FileText class="w-5 h-5 text-slate-400" />
                                                    <h3 class="text-lg font-semibold text-[#1e293b] tracking-tight">Site Files</h3>
                                                </div>
                                                <button
                                                    onClick={() => setIsUploadModalOpen(true)}
                                                    class="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg text-sm shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
                                                >
                                                    <Upload class="w-4 h-4" />
                                                    Upload File
                                                </button>
                                            </div>

                                            <div class="flex items-center justify-between gap-4 mb-6">
                                                <div class="relative flex-1 max-w-md">
                                                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                        <Search class="w-4 h-4" />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        placeholder="Search files..."
                                                        class="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                                    />
                                                </div>
                                                <div class="flex items-center gap-1">
                                                    <button onClick={() => refetchFiles()} class="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors" title="Refresh">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="bg-white rounded-xl overflow-hidden h-[400px] flex flex-col">
                                                <div class="ag-theme-alpine w-full flex-1" style={{
                                                    '--ag-background-color': '#ffffff',
                                                    '--ag-odd-row-background-color': '#f8fafc',
                                                    '--ag-header-background-color': '#ffffff',
                                                    '--ag-header-foreground-color': '#64748b',
                                                    '--ag-header-font-weight': '800',
                                                    '--ag-header-font-size': '11px',
                                                    '--ag-border-color': '#f1f5f9',
                                                    '--ag-row-hover-color': '#eff6ff',
                                                    '--ag-selected-row-background-color': '#dbeafe',
                                                    '--ag-font-family': "inherit",
                                                    '--ag-font-size': '13px',
                                                }}>
                                                    <AgGridSolid
                                                        columnDefs={fileColumnDefs}
                                                        rowData={files()}
                                                        gridOptions={fileGridOptions}
                                                        overlayNoRowsTemplate={`
                                                            <div class="flex flex-col items-center justify-center p-16">
                                                                <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                                                                </div>
                                                                <p class="text-xl font-semibold text-[#1e293b]">No files found</p>
                                                                <p class="text-sm text-slate-500">Beberapa dokumen mungkin belum diupload atau sedang diproses.</p>
                                                            </div>
                                                        `}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Riwayat Stage Expandable Section */}
                                    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => setHistoryExpanded(!historyExpanded())}
                                            class="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                                        >
                                            <h3 class="text-lg font-semibold text-[#1e293b] tracking-tight">
                                                Riwayat Stage ({stageHistory().length} perubahan)
                                            </h3>
                                            <ChevronDown class={clsx(
                                                "w-5 h-5 text-slate-400 transition-transform duration-300",
                                                historyExpanded() ? "rotate-180" : ""
                                            )} />
                                        </button>

                                        <Show when={historyExpanded()}>
                                            <div class="p-6 pt-0 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                                                <div class="space-y-6 relative before:absolute before:left-3 before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-50 mt-6">
                                                    <For each={stageHistory().slice().reverse()}>
                                                        {(log) => (
                                                            <div class="relative pl-10">
                                                                <div class="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-600 border-4 border-blue-50 ring-4 ring-white z-10"></div>
                                                                <div class="flex flex-col gap-1">
                                                                    <div class="flex items-center justify-between">
                                                                        <span class="text-[10px] font-semibold text-blue-600 uppercase tracking-tighter">{log.to_stage.replace(/_/g, ' ')}</span>
                                                                        <span class="text-[8px] text-slate-400 font-semibold">{new Date(log.created_at).toLocaleDateString()}</span>
                                                                    </div>
                                                                    <p class="text-[11px] text-slate-600 leading-tight">{log.notes || 'Stage updated'}</p>
                                                                    <span class="text-[8px] text-slate-400 uppercase font-semibold tracking-widest mt-1">BY {log.created_by}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </For>
                                                </div>
                                            </div>
                                        </Show>
                                    </div>
                                </div>
                            </Show>

                            <Show when={activeTab() === 'costs'}>
                                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    {/* Financial Summary */}
                                    <div class="lg:col-span-1 space-y-6">
                                        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                            <h3 class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Site Budget</h3>
                                            <div class="flex flex-col">
                                                <span class="text-2xl font-semibold text-slate-800">Rp {(site()?.maximal_budget || 0).toLocaleString()}</span>
                                                <div class="mt-4 pt-4 border-t border-slate-50 flex justify-between items-end">
                                                    <div class="flex flex-col">
                                                        <span class="text-[8px] text-slate-400 uppercase font-semibold tracking-tighter">Paid Out</span>
                                                        <span class="text-sm font-semibold text-emerald-600">Rp {costs().reduce((acc, c) => acc + c.jumlahPembayaran, 0).toLocaleString()}</span>
                                                    </div>
                                                    <div class="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded">
                                                        {((costs().reduce((acc, c) => acc + c.jumlahPembayaran, 0) / (site()?.maximal_budget || 1)) * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => alert('Pengajuan Termin Modal needs implementation')}
                                            class="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                        >
                                            <DollarSign class="w-5 h-5" />
                                            Request Payment
                                        </button>
                                    </div>

                                    {/* Payment Timeline */}
                                    <div class="lg:col-span-3">
                                        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                            <h3 class="text-sm font-semibold text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">Payment Requests</h3>
                                            <div class="overflow-x-auto">
                                                <table class="w-full text-left">
                                                    <thead>
                                                        <tr class="border-b border-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                                                            <th class="px-2 py-3">Step</th>
                                                            <th class="px-2 py-3">Status</th>
                                                            <th class="px-2 py-3 text-right">Requested</th>
                                                            <th class="px-2 py-3 text-right">Paid</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="text-sm font-medium">
                                                        <For each={costs()}>
                                                            {(cost) => (
                                                                <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                                                    <td class="px-2 py-4 font-semibold text-slate-700">{cost.typeTermin}</td>
                                                                    <td class="px-2 py-4">
                                                                        <span class={clsx(
                                                                            "px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-tighter",
                                                                            cost.status === 'paid' ? "bg-emerald-100 text-emerald-700" :
                                                                                cost.status === 'pengajuan' ? "bg-blue-100 text-blue-700" :
                                                                                    "bg-slate-100 text-slate-700"
                                                                        )}>
                                                                            {cost.status}
                                                                        </span>
                                                                    </td>
                                                                    <td class="px-2 py-4 text-right font-mono text-slate-600 text-sm">Rp {cost.jumlahPengajuan.toLocaleString()}</td>
                                                                    <td class="px-2 py-4 text-right font-mono font-semibold text-slate-800 text-sm">Rp {cost.jumlahPembayaran.toLocaleString()}</td>
                                                                </tr>
                                                            )}
                                                        </For>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Show>
                        </div>
                    </div>

                    <UpdateStageModal
                        isOpen={isUpdateModalOpen()}
                        onClose={() => setIsUpdateModalOpen(false)}
                        siteId={site()?.id || props.siteId}
                        siteName={site()?.site_name}
                        projectType={project()?.type}
                        currentStage={(site()?.stage as any) || 'imported'}
                        onUpdateStage={handleUpdateStage}
                    />
                </div>
            </Show>

            <UploadSiteFileModal
                isOpen={isUploadModalOpen()}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={() => {
                    refetchFiles();
                    setIsUploadModalOpen(false);
                }}
                siteId={props.siteId}
            />

            <SiteFilePreviewModal
                show={isPreviewModalOpen()}
                file={selectedFile()}
                onClose={() => setIsPreviewModalOpen(false)}
            />
        </Show>
    );
};


export default SiteDetailPage;
