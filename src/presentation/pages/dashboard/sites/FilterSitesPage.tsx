import { createSignal, createMemo, For, Show, createResource, onMount, Switch, Match } from 'solid-js';
import type { Component } from 'solid-js';
const clsx = (...classes: any[]) => classes.flat().filter(Boolean).join(' ');
import AgGridSolid from 'ag-grid-solid';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import BulkStageUpdateModal from '../../../components/modals/BulkStageUpdateModal';
import ImportSiteModal from '../../../components/modals/ImportSiteModal';
import MapWidget from '../components/MapWidget';
import FilterFlow from './components/FilterFlow';
import { GetAllSitesInteractor } from '../../../../application/use-cases/get-all-sites.use-case';
import { siteRepository } from '../../../../infrastructure/repositories/site.repository.impl';

const getAllSites = new GetAllSitesInteractor(siteRepository);

const SearchIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const RefreshCwIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>;
const FileSpreadsheetIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>;
const LayersIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.1a1 1 0 0 0 0 1.8l8.57 3.92a2 2 0 0 0 1.66 0L21.4 7.9a1 1 0 0 0 0-1.8Z"/><path d="m3.58 10.16 6.59 3a2 2 0 0 0 1.66 0l6.59-3a1 1 0 0 1 1.14 1.57l-7.31 3.34a2 2 0 0 1-1.66 0l-7.31-3.34a1 1 0 0 1 1.14-1.57Z"/><path d="m3.58 15.1 6.59 3a2 2 0 0 0 1.66 0l6.59-3a1 1 0 0 1 1.14 1.57l-7.31 3.34a2 2 0 0 1-1.66 0l-7.31-3.34a1 1 0 0 1 1.14-1.57Z"/></svg>;
const ListIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>;
const MapPinIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;

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

// Action Card Component
type DotColor = 'red' | 'amber' | 'purple' | 'blue' | 'emerald';
interface ActionCardProps {
    label: string;
    count: number;
    subText: string;
    dotColor: DotColor;
    filterKey: string;
    activeFilter: string | null;
    onClick: () => void;
}

const ActionCard: Component<ActionCardProps> = (props) => {
    const isActive = () => props.activeFilter === props.filterKey;
    
    const dotMap: Record<DotColor, string> = {
        red: 'bg-red-500',
        amber: 'bg-amber-500',
        purple: 'bg-purple-500',
        blue: 'bg-blue-600',
        emerald: 'bg-emerald-500',
    };
    
    const subTextMap: Record<DotColor, string> = {
        red: 'text-red-600',
        amber: 'text-amber-600',
        purple: 'text-purple-600',
        blue: 'text-slate-400',
        emerald: 'text-emerald-600',
    };
    
    const alertBorderMap: Record<DotColor, string> = {
        red: props.count > 0 ? 'border-red-300 bg-red-50/40' : 'border-slate-200',
        amber: props.count > 0 ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200',
        purple: 'border-slate-200',
        blue: 'border-slate-200',
        emerald: 'border-slate-200',
    };

    return (
        <div
            onClick={props.onClick}
            class={clsx(
                'flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 cursor-pointer shrink-0',
                'border shadow-[0_2px_8px_rgba(0,0,0,0.07)] transition-all duration-200',
                'hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.10)]',
                isActive() ? 'ring-2 ring-blue-500/40 bg-blue-50/30 border-blue-300' : alertBorderMap[props.dotColor]
            )}
            style={{ "min-width": "168px" }}
        >
            <span class={clsx(
                'w-2.5 h-2.5 rounded-full shrink-0',
                isActive() ? 'bg-blue-500' : dotMap[props.dotColor]
            )} />
            <div class="flex flex-col gap-0 min-w-0">
                <span class="text-[22px] font-extrabold leading-none tracking-tight text-[#111827]">{props.count}</span>
                <span class="text-[11px] font-medium text-slate-400 uppercase tracking-wide truncate">{props.label}</span>
                <span class={clsx('text-[11px] font-bold leading-snug', isActive() ? 'text-blue-600' : subTextMap[props.dotColor])}>
                    {props.subText}
                </span>
            </div>
        </div>
    );
};

interface FilterSitesPageProps {
    onViewDetail?: (id: string) => void;
}

const FilterSitesPage: Component<FilterSitesPageProps> = (props) => {
    const [isBulkOpen, setIsBulkOpen] = createSignal(false);
    const [isImportOpen, setIsImportOpen] = createSignal(false);
    
    // View toggle: 'list' or 'map'
    const [viewMode, setViewMode] = createSignal<'list' | 'map'>('list');

    // Filters
    const [searchTerm, setSearchTerm] = createSignal('');
    const [filterStage, setFilterStage] = createSignal<string>('All');
    const [filterCluster, setFilterCluster] = createSignal<string>('All');
    const [filterTeam, setFilterTeam] = createSignal<string>('All');
    const [quickFilter, setQuickFilter] = createSignal<string | null>(null);

    const [sites, { refetch }] = createResource(() => getAllSites.execute());

    // Filter only FILTER type sites
    const filterSites = createMemo(() => {
        const data = sites() || [];
        return data.filter((site: any) => {
            const type = site.project_type || site.project_id || '';
            return type === 'FILTER' || type.includes('FILTER');
        });
    });

    // Derived distinct values for dropdowns
    const availableStages = createMemo(() => {
        return Array.from(new Set(filterSites().map((s: any) => s.stage)));
    });
    const availableClusters = createMemo(() => {
        return Array.from(new Set(filterSites().map((s: any) => (s as any).cluster).filter(Boolean)));
    });
    const availableTeams = createMemo(() => {
        return Array.from(new Set(filterSites().map((s: any) => (s as any).team_assigned).filter(Boolean)));
    });

    // Filter Logic
    const filteredSites = createMemo(() => {
        return filterSites().filter((site: any) => {
            // Apply Quick Filters from KPI Cards
            if (quickFilter()) {
                if (quickFilter() === 'assigned' && site.stage === 'imported') return false;
                if (quickFilter() === 'permit' && site.stage !== 'permit_process' && site.stage !== 'permit_ready') return false;
                if (quickFilter() === 'wait' && site.stage !== 'wait') return false;
                if (quickFilter() === 'rfi' && site.stage !== 'rfi_done') return false;
                if (quickFilter() === 'bast' && site.stage !== 'bast') return false;
                if (quickFilter() === 'selesai' && site.stage !== 'completed') return false;
            }

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

    // Sorting Logic
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
        const data = filterSites();
        let assigned = 0;
        let permit = 0;
        let wait = 0;
        let rfi = 0;
        let bast = 0;
        let selesai = 0;
        let totalTeams = 0;
        let totalBudget = 0;

        data.forEach((s: any) => {
            if (s.stage !== 'imported') assigned++;
            if (s.stage === 'permit_process' || s.stage === 'permit_ready') permit++;
            if (s.stage === 'wait') wait++;
            if (s.stage === 'rfi_done') rfi++;
            if (s.stage === 'bast') bast++;
            if (s.stage === 'completed') selesai++;
            if (s.team_assigned) totalTeams++;
            
            // Calculate budget if available
            const budget = parseFloat(s.budget || s.value || '0');
            if (!isNaN(budget)) totalBudget += budget;
        });

        return { 
            total: data.length, 
            assigned, 
            permit, 
            wait, 
            rfi, 
            bast, 
            selesai,
            totalTeams: Array.from(new Set(data.map((s: any) => s.team_assigned).filter(Boolean))).length,
            totalBudget
        };
    });

    const handlePillClick = (key: string) => {
        if (key === 'total') setQuickFilter(null);
        else setQuickFilter(prev => prev === key ? null : key);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterStage('All');
        setFilterCluster('All');
        setFilterTeam('All');
    };

    const getDaysInStage = (site: any) => {
        if (site.stage === 'imported' || !site.stage_updated_at) return { text: '—', isStuck: false, daysDiff: 0 };
        const d = new Date(site.stage_updated_at);
        const text = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        const daysDiff = Math.floor((Date.now() - d.getTime()) / 86400000);
        const isStuck = daysDiff > 14 || site.stage_notes?.toLowerCase().includes('issue') || site.stage === 'issue_hold';
        return { text, isStuck, daysDiff };
    };

    // AG Grid Column Definitions
    const columnDefs: ColDef[] = [
        {
            headerName: 'SITE_ID',
            field: 'site_id',
            width: 140,
            cellClass: 'font-mono font-bold text-slate-700',
            pinned: 'left'
        },
        {
            headerName: 'Site Name',
            field: 'site_name',
            width: 200,
            cellClass: 'font-semibold text-slate-800'
        },
        {
            headerName: 'Sector',
            field: 'sector',
            width: 120,
            cellClass: 'text-slate-600 text-xs',
            valueFormatter: (params) => params.value || '—'
        },
        {
            headerName: 'Cluster',
            field: 'cluster',
            width: 140,
            cellClass: 'text-slate-600 text-xs',
            valueFormatter: (params) => params.value || '—'
        },
        {
            headerName: 'Region',
            field: 'region',
            width: 130,
            cellClass: 'text-slate-500 text-xs',
            valueFormatter: (params) => params.value || '—'
        },
        {
            headerName: 'Team',
            field: 'team_assigned',
            width: 150,
            cellClass: (params) => params.value ? 'font-medium text-slate-700 text-xs' : 'text-amber-500 font-medium italic text-xs',
            valueFormatter: (params) => params.value || 'Unassigned'
        },
        {
            headerName: 'Stage',
            field: 'stage',
            width: 180,
            cellClass: 'stage-badge-cell',
            valueFormatter: (params) => params.value ? params.value.replace(/_/g, ' ') : ''
        },
        {
            headerName: 'Termin',
            width: 100,
            cellClass: 'text-slate-300 font-mono text-xs',
            valueGetter: () => '— — — —'
        },
        {
            headerName: 'Last Updated',
            field: 'stage_updated_at',
            width: 200,
            cellClass: (params) => {
                const { isStuck } = getDaysInStage(params.data);
                return isStuck 
                    ? 'font-mono text-xs font-semibold px-2 py-1 rounded-md bg-amber-100 text-amber-700 border border-amber-200'
                    : 'font-mono text-xs font-semibold text-slate-500';
            },
            valueFormatter: (params) => {
                const { text } = getDaysInStage(params.data);
                return text;
            }
        },
        {
            headerName: 'Actions',
            width: 120,
            pinned: 'right',
            cellClass: 'action-button-cell',
            valueGetter: () => 'Detail →'
        }
    ];

    const defaultColDef: ColDef = {
        sortable: true,
        filter: true,
        resizable: true
    };

    const onCellClicked = (event: any) => {
        if (event.colDef.headerName === 'Actions') {
            props.onViewDetail?.(event.data.id);
        }
    };

    return (
        <div class="space-y-6 animate-in fade-in duration-300 pb-16">

            {/* Header */}
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <LayersIcon class="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 class="text-3xl font-black text-slate-800 tracking-tight">FILTER Sites</h1>
                        <p class="text-slate-500 mt-1 text-sm font-medium">Overview and tracking for all active FILTER specific deployments.</p>
                    </div>
                </div>
                {/* View Toggle & Import Button */}
            <div class="flex items-center justify-end gap-2">
                <div class="inline-flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    <button
                        onClick={() => setViewMode('list')}
                        class={clsx(
                            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all',
                            viewMode() === 'list'
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                        )}
                    >
                        <ListIcon class="w-4 h-4" />
                        List
                    </button>
                    <button
                        onClick={() => setViewMode('map')}
                        class={clsx(
                            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all',
                            viewMode() === 'map'
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                        )}
                    >
                        <MapPinIcon class="w-4 h-4" />
                        Map
                    </button>
                </div>
            </div>
            </div>

            {/* Action-Signal KPI Cards */}
            <div class="flex gap-3 overflow-x-auto pb-1" style={{ "scrollbar-width": "none", "-ms-overflow-style": "none" }}>
                {/* Total Sites */}
                <div
                    onClick={() => handlePillClick('total')}
                    class={clsx(
                        'flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer shrink-0',
                        'border shadow-sm transition-all duration-200',
                        'hover:-translate-y-0.5 hover:shadow-md',
                        quickFilter() === null ? 'ring-2 ring-blue-500/40 border-blue-300' : 'border-slate-200'
                    )}
                    style={{ "min-width": "140px" }}
                >
                    <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                        <LayersIcon class="w-5 h-5 text-white" />
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="text-2xl font-black leading-none text-slate-800">{stats().total}</span>
                        <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">FILTER SITES</span>
                    </div>
                </div>

                {/* Total Teams */}
                <div
                    onClick={() => handlePillClick('teams')}
                    class={clsx(
                        'flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer shrink-0',
                        'border shadow-sm transition-all duration-200',
                        'hover:-translate-y-0.5 hover:shadow-md',
                        quickFilter() === 'teams' ? 'ring-2 ring-purple-500/40 border-purple-300' : 'border-slate-200'
                    )}
                    style={{ "min-width": "140px" }}
                >
                    <div class="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="text-2xl font-black leading-none text-slate-800">{stats().totalTeams}</span>
                        <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">TOTAL TEAMS</span>
                    </div>
                </div>

                {/* Menunggu Akses */}
                <div
                    onClick={() => handlePillClick('wait')}
                    class={clsx(
                        'flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer shrink-0',
                        'border shadow-sm transition-all duration-200',
                        'hover:-translate-y-0.5 hover:shadow-md',
                        quickFilter() === 'wait' ? 'ring-2 ring-amber-500/40 border-amber-300' : 'border-slate-200'
                    )}
                    style={{ "min-width": "140px" }}
                >
                    <div class="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="text-2xl font-black leading-none text-slate-800">{stats().wait}</span>
                        <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">MENUNGGU AKSES</span>
                    </div>
                </div>

                {/* Permit Ready */}
                <div
                    onClick={() => handlePillClick('permit')}
                    class={clsx(
                        'flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer shrink-0',
                        'border shadow-sm transition-all duration-200',
                        'hover:-translate-y-0.5 hover:shadow-md',
                        quickFilter() === 'permit' ? 'ring-2 ring-emerald-500/40 border-emerald-300' : 'border-slate-200'
                    )}
                    style={{ "min-width": "140px" }}
                >
                    <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="text-2xl font-black leading-none text-slate-800">{stats().permit}</span>
                        <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">PERMIT READY</span>
                    </div>
                </div>

                {/* Budget/Value */}
                <div
                    class={clsx(
                        'flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer shrink-0',
                        'border shadow-sm transition-all duration-200',
                        'hover:-translate-y-0.5 hover:shadow-md',
                        'border-slate-200'
                    )}
                    style={{ "min-width": "160px" }}
                >
                    <div class="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" x2="12" y1="2" y2="22"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="text-xl font-black leading-none text-slate-800">
                            Rp {(stats().totalBudget / 1000000).toFixed(1)}Jt
                        </span>
                        <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">TOTAL BUDGET</span>
                    </div>
                </div>

                {/* Selesai */}
                <div
                    onClick={() => handlePillClick('selesai')}
                    class={clsx(
                        'flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer shrink-0',
                        'border shadow-sm transition-all duration-200',
                        'hover:-translate-y-0.5 hover:shadow-md',
                        quickFilter() === 'selesai' ? 'ring-2 ring-green-500/40 border-green-300' : 'border-slate-200'
                    )}
                    style={{ "min-width": "140px" }}
                >
                    <div class="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                            <path d="m9 12 2 2 4-4"/>
                        </svg>
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                        <span class="text-2xl font-black leading-none text-slate-800">{stats().selesai}</span>
                        <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">SELESAI</span>
                    </div>
                </div>
            </div>


            {/* Conditional Rendering: Map or List */}
            <Switch>
                <Match when={viewMode() === 'map'}>
                    {/* Map Widget */}
                    <MapWidget presetType="FILTER" height="600px" />
                </Match>

                <Match when={viewMode() === 'list'}>
                    {/* Filter Flow */}
                    <FilterFlow sites={filterSites()} />

                    {/* Filter Bar & Table */}
                    <div class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div class="bg-white p-3 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] border border-slate-200 flex flex-col gap-3">
                            <div class="flex flex-col md:flex-row gap-2 items-center">
                                <div class="relative flex-1 w-full min-w-[200px]">
                                    <SearchIcon class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari SITE_ID, nama, PO..."
                                        value={searchTerm()}
                                        onInput={(e) => setSearchTerm(e.currentTarget.value)}
                                        class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                                    />
                                </div>
                                <div class="flex gap-2 w-full md:w-auto overflow-x-auto flex-wrap">
                                    <select value={filterStage()} onChange={e => setFilterStage(e.currentTarget.value)} class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none shrink-0 capitalize">
                                        <option value="All">All Stages</option>
                                        <For each={availableStages()}>
                                            {(s: any) => <option value={s}>{s.replace(/_/g, ' ')}</option>}
                                        </For>
                                    </select>
                                    <select value={filterCluster()} onChange={e => setFilterCluster(e.currentTarget.value)} class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none shrink-0">
                                        <option value="All">All Clusters</option>
                                        <For each={availableClusters()}>
                                            {(c: any) => <option value={c}>{c}</option>}
                                        </For>
                                    </select>
                                    <select value={filterTeam()} onChange={e => setFilterTeam(e.currentTarget.value)} class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none shrink-0">
                                        <option value="All">All Teams</option>
                                        <For each={availableTeams()}>
                                            {(t: any) => <option value={t}>{t}</option>}
                                        </For>
                                    </select>
                                    <button
                                        onClick={resetFilters}
                                        class="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 shrink-0 transition-colors"
                                        title="Reset all filters"
                                    >
                                        <RefreshCwIcon class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div class="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-2.5">
                                        <div class="w-0.5 h-8 bg-blue-600 rounded-full"></div>
                                        <div class="flex items-center gap-2.5">
                                            <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <svg class="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                                    <circle cx="12" cy="10" r="3"/>
                                                </svg>
                                            </div>
                                            <h2 class="text-lg font-bold text-slate-700 tracking-tight uppercase">SITE REGISTRY</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm text-slate-600 font-medium">
                                        <span class="font-bold text-slate-800">{sortedSites().length}</span>
                                        {' '}of{' '}
                                        <span class="font-bold text-slate-800">{filterSites().length}</span> sites
                                    </span>
                                    <Show when={quickFilter()}>
                                        <button
                                            onClick={() => setQuickFilter(null)}
                                            class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full border border-slate-200 transition-colors"
                                        >
                                            × Hapus Filter
                                        </button>
                                    </Show>
                                    <button 
                                        onClick={() => setIsBulkOpen(true)} 
                                        class="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg text-xs transition-colors shadow-sm"
                                    >
                                        <FileSpreadsheetIcon class="w-3.5 h-3.5 text-slate-500" />
                                        Bulk Update Stage
                                    </button>
                                </div>
                            </div>

                            <div class="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
                                <AgGridSolid
                                    columnDefs={columnDefs}
                                    rowData={sortedSites()}
                                    defaultColDef={defaultColDef}
                                    pagination={true}
                                    paginationPageSize={20}
                                    paginationPageSizeSelector={[10, 20, 50, 100]}
                                    onCellClicked={onCellClicked}
                                    domLayout="normal"
                                    getRowId={(params: any) => params.data.id}
                                    getRowClass={(params: any) => `stage-row-${params.data.stage}`}
                                />
                            </div>
                        </div>
                    </div>
                </Match>
            </Switch>

            <BulkStageUpdateModal
                isOpen={isBulkOpen()}
                onClose={() => setIsBulkOpen(false)}
            />

            <ImportSiteModal
                isOpen={isImportOpen()}
                onClose={() => setIsImportOpen(false)}
                onImportExcel={(data, name) => {
                    console.log(`Importing ${name}`, data);
                    refetch();
                }}
                onAddManual={() => {
                    setIsImportOpen(false);
                }}
            />

            <style>{`
                .ag-theme-alpine {
                    --ag-header-background-color: rgb(248 250 252);
                    --ag-header-foreground-color: rgb(71 85 105);
                    --ag-border-color: rgb(226 232 240);
                    --ag-row-hover-color: rgb(248 250 252);
                    --ag-selected-row-background-color: rgb(239 246 255);
                    --ag-font-size: 13px;
                    --ag-font-family: inherit;
                }
                .ag-theme-alpine .ag-header-cell-label {
                    font-weight: 600;
                    font-size: 12px;
                }
                .ag-theme-alpine .ag-cell {
                    display: flex;
                    align-items: center;
                }
                .ag-theme-alpine .ag-paging-panel {
                    border-top: 1px solid rgb(226 232 240);
                    padding: 12px 16px;
                    font-size: 12px;
                }
                
                /* Stage Badge Styling */
                .ag-theme-alpine .stage-badge-cell {
                    padding: 4px 0;
                }
                .ag-theme-alpine .stage-badge-cell::before {
                    content: attr(data-stage);
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 10px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border: 1px solid;
                    white-space: nowrap;
                }
                
                /* Stage Colors */
                .ag-theme-alpine .ag-row.stage-row-imported .stage-badge-cell::before,
                .ag-theme-alpine .ag-row.stage-row-assigned .stage-badge-cell::before {
                    background-color: rgb(243 244 246);
                    color: rgb(55 65 81);
                    border-color: rgb(209 213 219);
                }
                .ag-theme-alpine .ag-row.stage-row-permit_process .stage-badge-cell::before {
                    background-color: rgb(254 243 199);
                    color: rgb(180 83 9);
                    border-color: rgb(251 191 36);
                }
                .ag-theme-alpine .ag-row.stage-row-permit_ready .stage-badge-cell::before {
                    background-color: rgb(209 250 229);
                    color: rgb(4 120 87);
                    border-color: rgb(52 211 153);
                }
                .ag-theme-alpine .ag-row.stage-row-akses_process .stage-badge-cell::before,
                .ag-theme-alpine .ag-row.stage-row-akses_ready .stage-badge-cell::before {
                    background-color: rgb(219 234 254);
                    color: rgb(29 78 216);
                    border-color: rgb(96 165 250);
                }
                .ag-theme-alpine .ag-row.stage-row-implementasi .stage-badge-cell::before,
                .ag-theme-alpine .ag-row.stage-row-rfi_done .stage-badge-cell::before,
                .ag-theme-alpine .ag-row.stage-row-rfs_done .stage-badge-cell::before {
                    background-color: rgb(237 233 254);
                    color: rgb(109 40 217);
                    border-color: rgb(167 139 250);
                }
                .ag-theme-alpine .ag-row.stage-row-dokumen_done .stage-badge-cell::before,
                .ag-theme-alpine .ag-row.stage-row-bast .stage-badge-cell::before,
                .ag-theme-alpine .ag-row.stage-row-invoice .stage-badge-cell::before {
                    background-color: rgb(255 237 213);
                    color: rgb(194 65 12);
                    border-color: rgb(251 146 60);
                }
                .ag-theme-alpine .ag-row.stage-row-completed .stage-badge-cell::before {
                    background-color: rgb(16 185 129);
                    color: white;
                    border-color: rgb(5 150 105);
                }
                .ag-theme-alpine .ag-row.stage-row-issue_hold .stage-badge-cell::before {
                    background-color: rgb(254 226 226);
                    color: rgb(185 28 28);
                    border-color: rgb(248 113 113);
                }
                .ag-theme-alpine .ag-row.stage-row-wait .stage-badge-cell::before {
                    background-color: rgb(243 244 246);
                    color: rgb(55 65 81);
                    border-color: rgb(209 213 219);
                }
                
                /* Action Button Styling */
                .ag-theme-alpine .action-button-cell {
                    justify-content: center;
                    cursor: pointer;
                    padding: 4px 0;
                }
                .ag-theme-alpine .action-button-cell::after {
                    content: 'Detail →';
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    background-color: white;
                    border: 1px solid rgb(226 232 240);
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    color: rgb(51 65 85);
                    transition: all 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                }
                .ag-theme-alpine .action-button-cell:hover::after {
                    background-color: rgb(248 250 252);
                    border-color: rgb(203 213 225);
                }
            `}</style>
        </div>
    );
};

export default FilterSitesPage;
