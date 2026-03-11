import { createSignal, createMemo, For, Show, onMount, createResource } from 'solid-js';
import type { Component } from 'solid-js';
import {
    siteMasterRecords, projects, teams, people,
    siteMaterials, siteCosts, skpRecords,
    siteBoQRecords, siteStageLogs, mockSiteFiles, terminPengajuanRecords
} from '../data/mockData';
import UpdateStageModal from '../../../components/modals/UpdateStageModal';
import UploadSiteFileModal from './components/UploadSiteFileModal';
import UploadSiteEvidenceModal from './components/UploadSiteEvidenceModal';
import SiteFilePreviewModal from './components/SiteFilePreviewModal';
import type { SiteFile } from '../../../../domain/entities/site-file.entity';
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

    // Data Resolution
    const [siteDetail] = createResource(() => props.siteId, (id) => getSiteById.execute(id));
    const [siteFiles, { refetch: refetchFiles }] = createResource(() => props.siteId, (id) => siteRepository.getFiles(id));
    const [siteEvidenceData, { refetch: refetchEvidence }] = createResource(() => props.siteId, (id) => getSiteEvidence.execute(id));

    const site = createMemo(() => siteDetail());
    const project = createMemo(() => projects.find(p => p.id === site()?.project_id) || projects[0]);
    const team = createMemo(() => teams.find(t => t.name === (site() as any)?.team_assigned));
    const materials = createMemo(() => siteBoQRecords.filter(m => m.siteId === props.siteId));
    const evidenceList = createMemo(() => siteEvidenceData() || []);
    const costs = createMemo(() => siteCosts.filter(c => c.siteId === props.siteId));
    const skps = createMemo(() => skpRecords.filter(s => s.siteId === props.siteId));
    const boq = createMemo(() => siteBoQRecords.filter(b => b.siteId === props.siteId));
    const stageHistory = createMemo(() => siteStageLogs.filter(l => l.site_master_id === props.siteId));
    const files = createMemo(() => siteFiles() || []);

    const stages: any[] = [
        { id: 'assigned', label: 'Assigned' },
        { id: 'permit_process', label: 'Permit' },
        { id: 'akses_process', label: 'Akses' },
        { id: 'implementasi', label: 'Implementasi' },
        { id: 'bast', label: 'BAST' },
        { id: 'invoice', label: 'Invoice' },
        { id: 'completed', label: 'Selesai' }
    ];

    const currentStageIndex = createMemo(() => {
        const s = site()?.stage;
        if (s === 'imported') return -1;
        const idx = stages.findIndex(st => st.id === s || (st.id === 'permit_process' && s === 'permit_ready') || (st.id === 'akses_process' && s === 'akses_ready'));
        return idx;
    });

    const handleUpdateStage = (newStage: string, notes?: string) => {
        console.log('Updating stage:', { newStage, notes });
        // Since we're using mock data, we'll just show a success message and close the modal
        alert(`Stage updated to ${newStage}\nNotes: ${notes || 'None'}`);
        setIsUpdateModalOpen(false);
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

                    {/* Stepper Stage Area */}
                    <div class="bg-white rounded-xl border-t-4 border-t-blue-500 shadow-sm border border-slate-200 overflow-hidden">
                        <div class="p-8 overflow-x-auto">
                            <div class="min-w-[800px] flex items-center justify-between relative px-10">
                                {/* Progress Bar Background */}
                                <div class="absolute top-[18px] left-[60px] right-[60px] h-0.5 bg-slate-100 -z-0"></div>

                                {/* Progress Bar Active */}
                                <div
                                    class="absolute top-[18px] left-[60px] h-0.5 bg-blue-500 transition-all duration-500 -z-0"
                                    style={{
                                        width: `${currentStageIndex() >= 0 ? ((currentStageIndex() / (stages.length - 1)) * 100) : 0}%`,
                                        "max-width": "calc(100% - 120px)"
                                    }}
                                ></div>

                                <For each={stages}>
                                    {(st, index) => {
                                        const isCompleted = index() <= currentStageIndex();
                                        const isCurrent = index() === currentStageIndex();

                                        return (
                                            <div class="flex flex-col items-center gap-3 z-10 w-24">
                                                <div class={clsx(
                                                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 border-2 font-semibold text-sm",
                                                    isCompleted ? "bg-white border-blue-500 text-slate-400" : "bg-white border-slate-200 text-slate-300"
                                                )}>
                                                    {index() + 1}
                                                </div>
                                                <span class={clsx(
                                                    "text-xs font-semibold text-center tracking-tight",
                                                    isCurrent || isCompleted ? "text-slate-600" : "text-slate-400"
                                                )}>
                                                    {st.label}
                                                </span>
                                            </div>
                                        );
                                    }}
                                </For>
                            </div>
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
                                <button class="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
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
                                                        <div class="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm transition-all hover:shadow-md">
                                                            <Show
                                                                when={item.url}
                                                                fallback={
                                                                    <div class="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                                                        <ImageIcon class="w-8 h-8 mb-2 opacity-50" />
                                                                        <span class="text-[10px] uppercase font-bold tracking-wider">{item.progress_tag}</span>
                                                                    </div>
                                                                }
                                                            >
                                                                <img
                                                                    src={item.url.startsWith('http') ? item.url : `${import.meta.env.VITE_API_URL}${item.url}`}
                                                                    alt={item.progress_tag}
                                                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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

                                            <div class="overflow-x-auto text-slate-800">
                                                <table class="w-full text-left">
                                                    <thead>
                                                        <tr class="border-b border-slate-100 text-[10px] font-semibold text-slate-400 uppercase tracking-widest bg-slate-50/30">
                                                            <th class="px-4 py-3">Title / Filename</th>
                                                            <th class="px-4 py-3">Mime Type</th>
                                                            <th class="px-4 py-3">Uploaded By</th>
                                                            <th class="px-4 py-3">Size</th>
                                                            <th class="px-4 py-3">Uploaded At</th>
                                                            <th class="px-4 py-3 text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="text-sm">
                                                        <For each={files()}>
                                                            {(file) => (
                                                                <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors font-medium">
                                                                    <td class="px-4 py-4">
                                                                        <div class="flex flex-col">
                                                                            <span class="text-slate-800 font-bold">{file.title || 'No Title'}</span>
                                                                            <span class="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{file.original_name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td class="px-4 py-4">
                                                                        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] uppercase font-bold tracking-tighter">
                                                                            {file.mime_type.split('/').pop()}
                                                                        </span>
                                                                    </td>
                                                                    <td class="px-4 py-4 text-slate-600 font-semibold">{file.uploaded_by || 'System'}</td>
                                                                    <td class="px-4 py-4 text-slate-600">{(file.size / 1024).toFixed(0)} KB</td>
                                                                    <td class="px-4 py-4 text-slate-400 text-xs">{new Date(file.uploaded_at).toLocaleDateString()}</td>
                                                                    <td class="px-4 py-4 text-right">
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedFile(file);
                                                                                setIsPreviewModalOpen(true);
                                                                            }}
                                                                            class="p-2 text-blue-600 hover:bg-blue-50 transition-all bg-white border border-blue-100 rounded-lg shadow-sm"
                                                                        >
                                                                            <EyeIcon class="w-4 h-4" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </For>
                                                        <Show when={files().length === 0}>
                                                            <tr>
                                                                <td colspan="6" class="py-16">
                                                                    <div class="flex flex-col items-center justify-center text-slate-400 gap-4">
                                                                        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                                            <Search class="w-8 h-8 text-slate-200" />
                                                                        </div>
                                                                        <p class="text-xl font-semibold text-[#1e293b]">No files found</p>
                                                                        <p class="text-sm">Beberapa dokumen mungkin belum diupload atau sedang diproses.</p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </Show>
                                                    </tbody>
                                                </table>
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
                        siteId={site()?.id || ''}
                        siteName={site()?.site_name}
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
