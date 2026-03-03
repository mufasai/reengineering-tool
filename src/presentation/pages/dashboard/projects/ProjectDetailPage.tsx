import { createSignal, createMemo, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import type { Project } from '../../../../domain/entities/project.entity';
import type { Site } from '../../../../domain/entities/work-order.entity';
import type { ProjectFile } from '../../../../domain/entities/project-file.entity';
import CreateSiteModal from './components/CreateSiteModal';
import UploadProjectFileModal from './components/UploadProjectFileModal';
import FilePreviewModal from './components/FilePreviewModal';
import SiteDetailPage from './SiteDetailPage';
import { GetSitesByProjectInteractor } from '../../../../application/use-cases/get-sites-by-project.use-case';
import { GetProjectFilesInteractor } from '../../../../application/use-cases/get-project-files.use-case';
import { siteRepository } from '../../../../infrastructure/repositories/site.repository.impl';
import { projectRepository } from '../../../../infrastructure/repositories/project.repository.impl';

const getSitesByProjectUseCase = new GetSitesByProjectInteractor(siteRepository);
const getProjectFilesUseCase = new GetProjectFilesInteractor(projectRepository);

// Mock data - replace with actual imports
const mockTeams = [
    { id: 't1', projectId: '1', name: 'Team Alpha', members: [{ id: 'm1', name: 'John Doe' }] }
];

interface ProjectDetailPageProps {
    project: Project;
    onBack: () => void;
}

const ProjectDetailPage: Component<ProjectDetailPageProps> = (props) => {
    const projectId = () => props.project.id;

    // Local state
    const [searchTerm, setSearchTerm] = createSignal('');
    const [fileSearchTerm, setFileSearchTerm] = createSignal('');
    const [showCreateSiteModal, setShowCreateSiteModal] = createSignal(false);
    const [showUploadFileModal, setShowUploadFileModal] = createSignal(false);
    const [showFilePreviewModal, setShowFilePreviewModal] = createSignal(false);
    const [selectedFile, setSelectedFile] = createSignal<ProjectFile | null>(null);
    const [sites, setSites] = createSignal<Site[]>([]);
    const [files, setFiles] = createSignal<ProjectFile[]>([]);
    const [isLoadingSites, setIsLoadingSites] = createSignal(false);
    const [isLoadingFiles, setIsLoadingFiles] = createSignal(false);
    const [selectedSite, setSelectedSite] = createSignal<Site | null>(null);

    const loadSites = async () => {
        setIsLoadingSites(true);
        try {
            const sitesData = await getSitesByProjectUseCase.execute(projectId());
            setSites(sitesData);
        } catch (error) {
            console.error('Failed to load sites:', error);
        } finally {
            setIsLoadingSites(false);
        }
    };

    const loadFiles = async () => {
        setIsLoadingFiles(true);
        try {
            const filesData = await getProjectFilesUseCase.execute(projectId());
            console.log('Files data received:', filesData);
            setFiles(filesData);
            console.log('Files state after set:', files());
        } catch (error) {
            console.error('Failed to load files:', error);
        } finally {
            setIsLoadingFiles(false);
        }
    };

    onMount(() => {
        loadSites();
        loadFiles();
    });

    const handleSiteCreated = () => {
        setShowCreateSiteModal(false);
        loadSites();
    };

    const handleFileUploaded = () => {
        setShowUploadFileModal(false);
        loadFiles();
    };

    const handleFilePreview = (file: ProjectFile) => {
        setSelectedFile(file);
        setShowFilePreviewModal(true);
    };

    const handleFileDownload = (file: ProjectFile) => {
        const fileId = file.id.includes(':') ? file.id.split(':').pop()! : file.id;
        const downloadUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/project-files/${fileId}/download`;

        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.original_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Data
    const teams = createMemo(() => mockTeams.filter(t => t.projectId === projectId()));

    // Stats calculations
    const totalBudget = createMemo(() => props.project.value || 0);
    const usedAmount = createMemo(() => 150000000); // Mock
    const remainingBudget = createMemo(() => totalBudget() - usedAmount());
    const usedPercentage = createMemo(() => totalBudget() > 0 ? (usedAmount() / totalBudget()) * 100 : 0);
    const pendingCount = createMemo(() => 3); // Mock
    const pendingAmount = createMemo(() => 25000000); // Mock

    // Filtered sites
    const filteredSites = createMemo(() => {
        return sites().filter(site =>
            site.site_name.toLowerCase().includes(searchTerm().toLowerCase()) ||
            site.lokasi.toLowerCase().includes(searchTerm().toLowerCase())
        );
    });

    // Filtered files
    const filteredFiles = createMemo(() => {
        const result = files().filter(file =>
            file.title.toLowerCase().includes(fileSearchTerm().toLowerCase()) ||
            file.original_name.toLowerCase().includes(fileSearchTerm().toLowerCase())
        );
        console.log('Filtered files:', result);
        return result;
    });

    // AG Grid Column Definitions for Sites
    const sitesColumnDefs = [
        {
            field: 'site_name',
            headerName: 'Site Name',
            flex: 1,
            minWidth: 180,
            cellRenderer: (params: any) => (
                <button
                    onClick={() => setSelectedSite(params.data)}
                    class="font-medium text-blue-600 hover:underline text-left"
                >
                    {params.value}
                </button>
            )
        },
        {
            field: 'site_info',
            headerName: 'Site Info',
            flex: 1,
            minWidth: 200,
            cellClass: 'text-slate-700 text-xs'
        },
        {
            field: 'pekerjaan',
            headerName: 'Pekerjaan',
            flex: 1,
            minWidth: 150,
            cellClass: 'text-slate-700 text-xs'
        },
        {
            field: 'lokasi',
            headerName: 'Location',
            width: 150,
            cellClass: 'text-slate-700'
        },
        {
            field: 'nomor_kontrak',
            headerName: 'Contract No',
            width: 130,
            cellClass: 'text-slate-700 text-xs'
        },
        {
            field: 'start',
            headerName: 'Start Date',
            width: 120,
            cellClass: 'text-slate-700 text-xs'
        },
        {
            field: 'end',
            headerName: 'End Date',
            width: 120,
            cellClass: 'text-slate-700 text-xs'
        },
        {
            field: 'maximal_budget',
            headerName: 'Max Budget',
            width: 140,
            cellClass: 'text-slate-900 font-medium text-xs',
            valueFormatter: (params: any) => `Rp ${params.value.toLocaleString('id-ID')}`
        },
        {
            field: 'cost_estimated',
            headerName: 'Cost Est.',
            width: 140,
            cellClass: 'text-slate-900 font-medium text-xs',
            valueFormatter: (params: any) => `Rp ${params.value.toLocaleString('id-ID')}`
        },
        {
            field: 'pemberi_tugas',
            headerName: 'Pemberi Tugas',
            flex: 1,
            minWidth: 150,
            cellClass: 'text-slate-700 text-xs'
        },
        {
            field: 'penerima_tugas',
            headerName: 'Penerima Tugas',
            flex: 1,
            minWidth: 150,
            cellClass: 'text-slate-700 text-xs'
        },
        {
            headerName: 'Actions',
            width: 120,
            sortable: false,
            filter: false,
            pinned: 'right',
            cellRenderer: (params: any) => (
                <div class="flex justify-end gap-2 h-full items-center">
                    <button
                        onClick={() => {
                            console.log('View clicked, data:', params.data);
                            setSelectedSite(params.data);
                        }}
                        class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </button>
                    <button class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                    </button>
                    <button class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            )
        }
    ]

    // AG Grid Column Definitions for Files
    const filesColumnDefs = [
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            minWidth: 200,
            cellRenderer: (params: any) => (
                <div class="flex items-center gap-2">
                    <div class="p-2 bg-red-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-slate-900">{params.value}</p>
                        <p class="text-xs text-slate-500">{params.data.original_name}</p>
                    </div>
                </div>
            )
        },
        {
            field: 'size',
            headerName: 'Size',
            width: 120,
            cellClass: 'text-slate-600 text-sm',
            valueFormatter: (params: any) => {
                const bytes = params.value;
                if (bytes < 1024) return bytes + ' B';
                if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
                return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
            }
        },
        {
            field: 'mime_type',
            headerName: 'Type',
            width: 150,
            cellRenderer: (params: any) => (
                <span class="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                    {params.value.split('/')[1] || params.value}
                </span>
            )
        },
        {
            field: 'uploaded_at',
            headerName: 'Uploaded',
            width: 180,
            cellClass: 'text-slate-500 text-xs',
            valueFormatter: (params: any) => {
                const date = new Date(params.value);
                return date.toLocaleString('id-ID');
            }
        },
        {
            headerName: 'Actions',
            width: 120,
            sortable: false,
            filter: false,
            cellRenderer: (params: any) => {
                const container = document.createElement('div');
                container.className = 'flex justify-end gap-2 h-full items-center';

                // Preview button
                const previewBtn = document.createElement('button');
                previewBtn.className = 'p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all';
                previewBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                `;
                previewBtn.onclick = () => handleFilePreview(params.data);

                // Download button
                const downloadBtn = document.createElement('button');
                downloadBtn.className = 'p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all';
                downloadBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                `;
                downloadBtn.onclick = () => handleFileDownload(params.data);

                container.appendChild(previewBtn);
                container.appendChild(downloadBtn);

                return container;
            }
        }
    ];

    if (!props.project) {
        return (
            <div class="p-8 text-center text-slate-500">
                <p>Project not found</p>
                <button onClick={() => props.onBack()} class="mt-4 text-blue-600 hover:underline">
                    Back to Projects
                </button>
            </div>
        );
    }

    return (
        <Show
            when={!selectedSite()}
            fallback={
                <SiteDetailPage
                    site={selectedSite()!}
                    onBack={() => setSelectedSite(null)}
                />
            }
        >
            <div class="space-y-8 animate-in fade-in duration-500 pb-16">
                {/* Header */}
                <div class="space-y-6">
                    <div class="flex items-center gap-4">
                        <button
                            onClick={() => props.onBack()}
                            class="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 class="text-4xl font-bold tracking-tight text-slate-900">Dashboard Project</h1>
                            <p class="text-slate-500 mt-2">
                                <span class="font-semibold text-slate-900">{props.project.name}</span> • {props.project.tipe}
                            </p>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        {/* Total Budget */}
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <div class="flex items-center justify-between mb-3">
                                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Budget</p>
                                <div class="p-2 bg-blue-50 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </div>
                            </div>
                            <p class="text-2xl font-bold text-slate-900">Rp {totalBudget().toLocaleString('id-ID')}</p>
                            <p class="text-xs text-slate-500 mt-1">Nilai kontrak keseluruhan</p>
                        </div>

                        {/* Used Budget */}
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <div class="flex items-center justify-between mb-3">
                                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget Terpakai</p>
                                <div class="p-2 bg-amber-50 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </div>
                            </div>
                            <p class="text-2xl font-bold text-slate-900">Rp {usedAmount().toLocaleString('id-ID')}</p>
                            <div class="mt-2">
                                <div class="flex items-center justify-between text-xs mb-1">
                                    <span class="text-slate-500">{usedPercentage().toFixed(1)}% dari total</span>
                                </div>
                                <div class="w-full bg-slate-100 rounded-full h-2">
                                    <div class="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${usedPercentage()}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Remaining Budget */}
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <div class="flex items-center justify-between mb-3">
                                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sisa Budget</p>
                                <div class="p-2 bg-emerald-50 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                            </div>
                            <p class="text-2xl font-bold text-slate-900">Rp {remainingBudget().toLocaleString('id-ID')}</p>
                            <p class="text-xs text-slate-500 mt-1">Tersedia untuk pengajuan</p>
                        </div>

                        {/* Pending Approval */}
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer hover:border-amber-300 transition-all">
                            <div class="flex items-center justify-between mb-3">
                                <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Menunggu Approval</p>
                                <div class="p-2 bg-amber-50 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v6l4 2" />
                                    </svg>
                                </div>
                            </div>
                            <p class="text-2xl font-bold text-slate-900">{pendingCount()}</p>
                            <p class="text-xs text-slate-500 mt-1">Rp {pendingAmount().toLocaleString('id-ID')} pending</p>
                        </div>
                    </div>

                    {/* Secondary Stats */}
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p class="text-xs text-slate-500 mb-1">Total Sites</p>
                                <p class="text-xl font-bold text-slate-900">{sites().length}</p>
                            </div>
                            <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                        </div>

                        <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p class="text-xs text-slate-500 mb-1">Total Teams</p>
                                <p class="text-xl font-bold text-slate-900">{teams().length}</p>
                            </div>
                            <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                        </div>

                        <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p class="text-xs text-slate-500 mb-1">Total People</p>
                                <p class="text-xl font-bold text-slate-900">{teams().reduce((sum, t) => sum + t.members.length, 0)}</p>
                            </div>
                            <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                        </div>

                        <div class="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p class="text-xs text-slate-500 mb-1">Last Process</p>
                                <p class="text-sm font-bold text-slate-900 truncate">Termin 2 Review</p>
                            </div>
                            <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sites & Files Section */}
                <div>
                    {/* Sites Table */}
                    <div class="lg:col-span-2 space-y-6">
                        <div class="flex items-center justify-between">
                            <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                    <polyline points="2 17 12 22 22 17" />
                                    <polyline points="2 12 12 17 22 12" />
                                </svg>
                                Sites & Progress
                            </h2>
                            <button
                                onClick={() => setShowCreateSiteModal(true)}
                                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all"
                            >
                                + Add Site
                            </button>
                        </div>

                        {/* Sites AG Grid */}
                        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            {/* Search Bar */}
                            <div class="p-4 border-b border-slate-200">
                                <input
                                    type="text"
                                    placeholder="Cari site..."
                                    class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                                    value={searchTerm()}
                                    onInput={(e) => setSearchTerm(e.currentTarget.value)}
                                />
                            </div>

                            {/* AG Grid Table */}
                            {isLoadingSites() ? (
                                <div class="flex items-center justify-center h-[400px]">
                                    <div class="text-center">
                                        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p class="mt-2 text-sm text-slate-500">Loading sites...</p>
                                    </div>
                                </div>
                            ) : (
                                <div class="ag-theme-alpine w-full h-[400px]" style={{
                                    '--ag-background-color': 'transparent',
                                    '--ag-odd-row-background-color': '#f8fafc',
                                    '--ag-header-background-color': '#f8fafc',
                                    '--ag-border-color': '#e2e8f0',
                                    '--ag-row-hover-color': '#f1f5f9',
                                    '--ag-selected-row-background-color': '#dbeafe',
                                    '--ag-font-family': "'Inter', sans-serif",
                                    '--ag-font-size': '14px',
                                    '--ag-header-foreground-color': '#64748b',
                                    '--ag-header-font-weight': '600',
                                }}>
                                    <AgGridSolid
                                        columnDefs={sitesColumnDefs}
                                        rowData={filteredSites()}
                                        defaultColDef={{
                                            sortable: true,
                                            filter: true,
                                            resizable: true,
                                        }}
                                        rowHeight={60}
                                        headerHeight={48}
                                        pagination={true}
                                        paginationPageSize={10}
                                        paginationPageSizeSelector={[5, 10, 20]}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/*Files*/}
                <div class="space-y-8">
                    {/* Files */}
                    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 class="text-sm font-bold text-slate-900">Project Files ({files().length})</h3>
                            <button
                                onClick={() => setShowUploadFileModal(true)}
                                class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                                + Add Files
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div class="p-4 border-b border-slate-200">
                            <input
                                type="text"
                                placeholder="Search files..."
                                class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                                value={fileSearchTerm()}
                                onInput={(e) => setFileSearchTerm(e.currentTarget.value)}
                            />
                        </div>

                        {/* AG Grid for Files */}
                        {isLoadingFiles() ? (
                            <div class="flex items-center justify-center h-[300px]">
                                <div class="text-center">
                                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p class="mt-2 text-sm text-slate-500">Loading files...</p>
                                </div>
                            </div>
                        ) : (
                            <div class="ag-theme-alpine w-full h-[300px]" style={{
                                '--ag-background-color': 'transparent',
                                '--ag-odd-row-background-color': '#f8fafc',
                                '--ag-header-background-color': '#f8fafc',
                                '--ag-border-color': '#e2e8f0',
                                '--ag-row-hover-color': '#f1f5f9',
                                '--ag-font-family': "'Inter', sans-serif",
                                '--ag-font-size': '13px',
                                '--ag-header-foreground-color': '#64748b',
                                '--ag-header-font-weight': '600',
                            }}>
                                <AgGridSolid
                                    columnDefs={filesColumnDefs}
                                    rowData={filteredFiles()}
                                    defaultColDef={{
                                        sortable: true,
                                        filter: false,
                                        resizable: true,
                                    }}
                                    rowHeight={60}
                                    headerHeight={44}
                                    pagination={true}
                                    paginationPageSize={5}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Create Site Modal */}
                {showCreateSiteModal() && (
                    <CreateSiteModal
                        projectId={projectId()}
                        onSuccess={handleSiteCreated}
                        onCancel={() => setShowCreateSiteModal(false)}
                    />
                )}

                {/* Upload File Modal */}
                <UploadProjectFileModal
                    show={showUploadFileModal()}
                    projectId={projectId()}
                    onClose={() => setShowUploadFileModal(false)}
                    onSuccess={handleFileUploaded}
                />

                {/* File Preview Modal */}
                <FilePreviewModal
                    show={showFilePreviewModal()}
                    file={selectedFile()}
                    onClose={() => {
                        setShowFilePreviewModal(false);
                        setSelectedFile(null);
                    }}
                    onDownload={handleFileDownload}
                />
            </div>
        </Show>
    );
};

export default ProjectDetailPage;
