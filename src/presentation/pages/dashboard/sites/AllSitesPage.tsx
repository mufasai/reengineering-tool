import { createSignal, createMemo, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
const clsx = (...classes: any[]) => classes.flat().filter(Boolean).join(' ');
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { siteMasterRecords, type ProjectType } from '../data/mockData';
import BulkStageUpdateModal from '../../../components/modals/BulkStageUpdateModal';

const SearchIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const FilterIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const ArrowRightIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const EyeIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
const AlertCircleIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>;
const RefreshCwIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>;
const FileSpreadsheetIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>;

const STAGE_COLORS: Record<string, string> = {
    'imported': 'bg-gray-100 text-gray-700 border-gray-200',
    'assigned': 'bg-gray-100 text-gray-700 border-gray-200',
    'permit_process': 'bg-amber-100 text-amber-700 border-amber-200',
    'permit_ready': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'akses_process': 'bg-blue-100 text-blue-700 border-blue-200',
    'akses_ready': 'bg-blue-100 text-blue-700 border-blue-200',
    'implementasi': 'bg-violet-100 text-violet-700 border-violet-200',
    'rfi_done': 'bg-violet-100 text-violet-700 border-violet-200',
    'rfs_done': 'bg-violet-100 text-violet-700 border-violet-200',
    'dokumen_done': 'bg-orange-100 text-orange-700 border-orange-200',
    'bast': 'bg-orange-100 text-orange-700 border-orange-200',
    'invoice': 'bg-orange-100 text-orange-700 border-orange-200',
    'completed': 'bg-emerald-500 text-white border-emerald-600',
    'issue_hold': 'bg-red-100 text-red-700 border-red-200',
};

const PROJECT_TYPES: { id: ProjectType; label: string; color: string }[] = [
    { id: 'BLACKSITE', label: 'Blacksite', color: 'bg-red-50 text-red-600 border-red-200' },
    { id: 'COMBAT', label: 'Combat', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { id: 'FILTER', label: 'Filter', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { id: 'L2H', label: 'L2H', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { id: 'REFINEN', label: 'Refinen', color: 'bg-purple-50 text-purple-600 border-purple-200' }
];

interface AllSitesPageProps {
    onViewDetail?: (id: string) => void;
}

const AllSitesPage: Component<AllSitesPageProps> = (props) => {
    const [isBulkOpen, setIsBulkOpen] = createSignal(false);

    // Filters
    const [searchTerm, setSearchTerm] = createSignal('');
    const [filterType, setFilterType] = createSignal<ProjectType | 'All'>('All');
    const [filterStage, setFilterStage] = createSignal<string>('All');
    const [filterCluster, setFilterCluster] = createSignal<string>('All');
    const [filterTeam, setFilterTeam] = createSignal<string>('All');

    // Derived distinct values for dropdowns
    const availableStages = createMemo(() => Array.from(new Set(siteMasterRecords.map((s: any) => s.stage))));
    const availableClusters = createMemo(() => Array.from(new Set(siteMasterRecords.map((s: any) => s.cluster).filter(Boolean))));
    const availableTeams = createMemo(() => Array.from(new Set(siteMasterRecords.map((s: any) => s.team_assigned).filter(Boolean))));

    // Filter Logic
    const filteredSites = createMemo(() => {
        return siteMasterRecords.filter((site: any) => {
            if (filterType() !== 'All' && site.project_type !== filterType()) return false;
            if (filterStage() !== 'All' && site.stage !== filterStage()) return false;
            if (filterCluster() !== 'All' && (site as any).cluster !== filterCluster()) return false;
            if (filterTeam() !== 'All' && (site as any).team_assigned !== filterTeam()) return false;

            if (searchTerm()) {
                const term = searchTerm().toLowerCase();
                if (!(site as any).site_id?.toLowerCase().includes(term) &&
                    !(site as any).site_name?.toLowerCase().includes(term) &&
                    !((site as any).custom_po || '').toLowerCase().includes(term)) {
                    return false;
                }
            }
            return true;
        });
    });

    // Sorting Logic: Days in Stage DESC by default
    const sortedSites = createMemo(() => {
        return [...filteredSites()].sort((a, b) => {
            if (a.stage === 'imported' && b.stage !== 'imported') return 1;
            if (b.stage === 'imported' && a.stage !== 'imported') return -1;

            const dateA = (a as any).stage_updated_at ? new Date((a as any).stage_updated_at).getTime() : Date.now();
            const dateB = (b as any).stage_updated_at ? new Date((b as any).stage_updated_at).getTime() : Date.now();
            return dateA - dateB;
        });
    });

    // Calculate Summary Stats
    const stats = createMemo(() => {
        let filter = 0;
        let combat = 0;
        let actions = 0;
        let others = 0;

        siteMasterRecords.forEach((s: any) => {
            if (s.project_type === 'FILTER') filter++;
            else if (s.project_type === 'COMBAT') combat++;
            else others++;

            if (s.stage !== 'imported' && (s as any).stage_updated_at) {
                const daysDiff = Math.floor((new Date().getTime() - new Date((s as any).stage_updated_at).getTime()) / (1000 * 3600 * 24));
                if (daysDiff > 14 || s.stage_notes?.toLowerCase().includes('issue') || (s.stage as string) === 'issue_hold') {
                    actions++;
                }
            }
        });

        return { total: siteMasterRecords.length, filter, combat, others, actions };
    });

    const resetFilters = () => {
        setSearchTerm('');
        setFilterType('All');
        setFilterStage('All');
        setFilterCluster('All');
        setFilterTeam('All');
    };

    const columnDefs = [
        {
            field: 'site_id',
            headerName: 'SITE_ID',
            width: 120,
            cellRenderer: (params: any) => <span class="font-mono font-bold text-slate-700">{params.value || '—'}</span>
        },
        {
            field: 'site_name',
            headerName: 'Site Name',
            flex: 1,
            minWidth: 200,
            cellRenderer: (params: any) => <div class="font-semibold text-slate-800 truncate">{params.value || '—'}</div>
        },
        {
            field: 'project_type',
            headerName: 'Type',
            width: 120,
            cellRenderer: (params: any) => {
                const typeObj = PROJECT_TYPES.find(t => t.id === params.value);
                return typeObj ? (
                    <div class="flex items-center justify-start h-full py-2">
                        <span class={clsx(
                            "px-2 py-0.5 rounded text-[10px] uppercase tracking-tighter border shrink-0",
                            typeObj.color
                        )}>
                            {typeObj.label}
                        </span>
                    </div>
                ) : <span class="text-slate-400">—</span>;
            }
        },
        { field: 'cluster', headerName: 'Cluster', width: 130, cellClass: 'text-slate-600 text-xs' },
        { field: 'region', headerName: 'Region', width: 130, cellClass: 'text-slate-600 text-xs' },
        {
            field: 'team_assigned',
            headerName: 'Team',
            width: 150,
            cellRenderer: (params: any) => params.value ? <span class="font-medium text-slate-700">{params.value}</span> : <span class="text-slate-400 italic">Unassigned</span>
        },
        {
            field: 'stage',
            headerName: 'Stage',
            width: 160,
            cellRenderer: (params: any) => {
                const stageStr = params.value as string;
                if (!stageStr) return <span class="text-slate-400">—</span>;
                return (
                    <div class="flex items-center justify-start h-full py-2">
                        <span class={clsx(
                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-tighter border shrink-0",
                            STAGE_COLORS[stageStr] || STAGE_COLORS['imported']
                        )}>
                            <span class="w-1 h-1 rounded-full bg-current opacity-70 mr-1.5"></span>
                            {stageStr.replace(/_/g, ' ')}
                        </span>
                    </div>
                );
            }
        },
        {
            headerName: 'Days in Stage',
            width: 140,
            valueGetter: (params: any) => {
                if (!params.data) return '—';
                if (params.data.stage === 'imported' || !params.data.stage_updated_at) return '—';
                const updateDate = new Date(params.data.stage_updated_at);
                const daysDiff = Math.floor((new Date().getTime() - updateDate.getTime()) / (1000 * 3600 * 24));
                return `${daysDiff} Hari`;
            },
            cellRenderer: (params: any) => {
                if (!params.data) return null;
                if (params.data.stage === 'imported' || !params.data.stage_updated_at) {
                    return (
                        <div class="flex items-center">
                            <span class="text-slate-500 font-mono text-xs px-2 py-1">—</span>
                        </div>
                    );
                }
                const updateDate = new Date(params.data.stage_updated_at);
                const daysDiff = Math.floor((new Date().getTime() - updateDate.getTime()) / (1000 * 3600 * 24));
                const isStuck = daysDiff > 14 || params.data.stage_notes?.toLowerCase().includes('issue') || params.data.stage === 'issue_hold';

                return (
                    <div class="flex items-center">
                        <span class={clsx(
                            "inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-md border",
                            isStuck ? "bg-amber-100 text-amber-700 shadow-sm border-amber-200" : "bg-slate-50 text-slate-500 border-slate-200"
                        )}>
                            {isStuck ? <AlertCircleIcon class="w-3.5 h-3.5" /> : null}
                            {daysDiff} Hari
                        </span>
                    </div>
                );
            }
        },
        {
            headerName: 'Actions',
            width: 80,
            sortable: false,
            filter: false,
            pinned: 'right',
            cellRenderer: (params: any) => (
                <div class="flex items-center justify-center h-full">
                    <button
                        onClick={() => props.onViewDetail?.(params.data.id)}
                        class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Detail"
                    >
                        <EyeIcon class="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    const gridOptions = {
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true,
            suppressMovable: true,
            flex: 0,
            minWidth: 100,
            cellStyle: { display: 'flex', alignItems: 'center' }
        },
        headerHeight: 60,
        rowHeight: 70,
        animateRows: true,
        pagination: true,
        paginationPageSize: 20,
        suppressCellFocus: true,
    };

    return (
        <div class="space-y-6 animate-in fade-in duration-300 pb-16">

            {/* Header */}
            <div class="flex justify-between items-start">
                <div>
                    <h1 class="text-2xl font-bold text-[var(--text-primary)]">Semua Sites</h1>
                    <p class="text-[var(--text-secondary)] mt-1">Progress seluruh site lintas tipe pekerjaan</p>
                </div>
                <button onClick={() => setIsBulkOpen(true)} class="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2">
                    <FileSpreadsheetIcon class="w-4 h-4 text-blue-600" />
                    Bulk Update Stage
                </button>
            </div>

            {/* Summary Strip */}
            <div class="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-md px-4 py-2 flex items-center gap-4 text-sm font-medium text-slate-600 overflow-x-auto shadow-sm backdrop-blur-sm">
                <span class="font-bold text-slate-800">Total: {stats().total} sites</span>
                <span class="text-slate-300">•</span>
                <span>{stats().filter} Filter</span>
                <span class="text-slate-300">•</span>
                <span>{stats().combat} Combat</span>
                <span class="text-slate-300">•</span>
                <span>{stats().others} lainnya</span>
                <span class="text-slate-300">•</span>
                <span class={clsx("flex items-center gap-1", stats().actions > 0 ? "text-amber-600 font-bold" : "")}>
                    {stats().actions} butuh perhatian {stats().actions > 0}
                </span>
            </div>

            {/* Filter Bar */}
            <div class="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
                <div class="relative flex-1 w-full">
                    <SearchIcon class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari site ID, name, PO..."
                        value={searchTerm()}
                        onInput={(e) => setSearchTerm(e.currentTarget.value)}
                        class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                    />
                </div>
                <div class="flex gap-2 w-full md:w-auto overflow-x-auto">
                    <select value={filterType()} onChange={e => setFilterType(e.currentTarget.value as any)} class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none w-[130px] shrink-0">
                        <option value="All">All Types</option>
                        <For each={PROJECT_TYPES}>
                            {t => <option value={t.id}>{t.label}</option>}
                        </For>
                    </select>
                    <select value={filterStage()} onChange={e => setFilterStage(e.currentTarget.value)} class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none w-[130px] shrink-0 capitalize">
                        <option value="All">All Stages</option>
                        <For each={availableStages()}>
                            {(s: any) => <option value={s}>{s.replace(/_/g, ' ')}</option>}
                        </For>
                    </select>
                    <select value={filterCluster()} onChange={e => setFilterCluster(e.currentTarget.value)} class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none w-[130px] shrink-0 capitalize">
                        <option value="All">All Clusters</option>
                        <For each={availableClusters()}>
                            {(c: any) => <option value={c}>{c}</option>}
                        </For>
                    </select>
                    <select value={filterTeam()} onChange={e => setFilterTeam(e.currentTarget.value)} class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none w-[130px] shrink-0 capitalize">
                        <option value="All">All Teams</option>
                        <For each={availableTeams()}>
                            {(t: any) => <option value={t}>{t}</option>}
                        </For>
                    </select>

                    <button
                        onClick={resetFilters}
                        class="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 shrink-0 transition-colors tooltip-trigger"
                        title="Reset Filters"
                    >
                        <RefreshCwIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div class="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden h-[650px] flex flex-col p-4">
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
                        columnDefs={columnDefs}
                        rowData={sortedSites()}
                        gridOptions={gridOptions}
                        overlayNoRowsTemplate={`
                            <div class="flex flex-col items-center justify-center p-8">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                                <p class="font-medium text-slate-600">Tidak ada site yang cocok dengan filter</p>
                            </div>
                        `}
                    />
                </div>
            </div>

            <BulkStageUpdateModal
                isOpen={isBulkOpen()}
                onClose={() => setIsBulkOpen(false)}
            />
        </div>
    );
};

export default AllSitesPage;
