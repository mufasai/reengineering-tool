import { createSignal, createMemo, createEffect, onMount, onCleanup, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

import type { ProjectType, SiteStage } from '../data/mockData';
import { siteMasterRecords } from '../data/mockData';

// Icons mapped from lucide-react to raw SVG:
const MapPinIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
const ChevronDownIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="m6 9 6 6 6-6" /></svg>);
const LayersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 12 12 17 22 12" /><polyline points="2 17 12 22 22 17" /></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>);
const ArrowRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>);

// 0. DEFINITIONS & HELPERS
const STAGE_COLORS: Record<string, string> = {
    'imported': '#9CA3AF',
    'assigned': '#6B7280',
    'permit_process': '#F59E0B',
    'permit_ready': '#10B981',
    'akses_process': '#3B82F6',
    'akses_ready': '#3B82F6',
    'implementasi': '#8B5CF6',
    'rfi_done': '#8B5CF6',
    'rfs_done': '#8B5CF6',
    'dokumen_done': '#F97316',
    'bast': '#F97316',
    'invoice': '#F97316',
    'completed': '#065F46',
    'issue_hold': '#EF4444',
};

const STAGE_LABELS: Record<string, string> = {
    'imported': 'Imported',
    'assigned': 'Assigned',
    'permit_process': 'Permit Process',
    'permit_ready': 'Permit Ready',
    'akses_process': 'Akses Process',
    'akses_ready': 'Akses Ready',
    'implementasi': 'Implementasi / RFI / RFS',
    'rfi_done': 'Implementasi / RFI / RFS',
    'rfs_done': 'Implementasi / RFI / RFS',
    'dokumen_done': 'Dokumen / BAST / Invoice',
    'bast': 'Dokumen / BAST / Invoice',
    'invoice': 'Dokumen / BAST / Invoice',
    'completed': 'Completed',
    'issue_hold': 'Issue / Hold',
};

const PROJECT_TYPES: { id: ProjectType; label: string }[] = [
    { id: 'FILTER', label: 'Filter' },
    { id: 'COMBAT', label: 'Combat' },
    { id: 'BLACKSITE', label: 'Blacksite' },
    { id: 'L2H', label: 'L2H' },
    { id: 'REFINEN', label: 'Refinen' }
];

const getPinColor = (stage: SiteStage | 'issue_hold', notes?: string) => {
    if (stage === 'issue_hold' || notes?.toLowerCase().includes('issue')) {
        return STAGE_COLORS['issue_hold'];
    }
    return STAGE_COLORS[stage] || STAGE_COLORS['imported'];
};

const getPinLabel = (stage: SiteStage | 'issue_hold', notes?: string) => {
    if (stage === 'issue_hold' || notes?.toLowerCase().includes('issue')) {
        return STAGE_LABELS['issue_hold'];
    }
    return STAGE_LABELS[stage] || STAGE_LABELS['imported'];
};

const generateIconHtml = (type: string, color: string) => {
    const stroke = '#ffffff';
    const strokeW = 2;
    const filter = `drop-shadow(0px 2px 3px rgba(0,0,0,0.3))`;

    if (type === 'FILTER') {
        const size = 12;
        return `<svg width="${size}" height="${size}" viewBox="0 0 12 12" style="filter: ${filter}; transform: translate(-50%, -50%); overflow: visible;">
                  <circle cx="6" cy="6" r="5" fill="${color}" stroke="${stroke}" stroke-width="${strokeW}" />
                </svg>`;
    } else if (type === 'COMBAT') {
        const size = 10;
        return `<svg width="${size}" height="${size}" viewBox="0 0 10 10" style="filter: ${filter}; transform: translate(-50%, -50%); overflow: visible;">
                  <rect x="1" y="1" width="8" height="8" fill="${color}" stroke="${stroke}" stroke-width="${strokeW}" rx="1" />
                </svg>`;
    } else if (type === 'BLACKSITE') {
        const size = 12;
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="filter: ${filter}; transform: translate(-50%, -50%); overflow: visible;">
                   <path d="M12 2L22 12L12 22L2 12Z" fill="${color}" stroke="${stroke}" stroke-width="${strokeW}" />
                </svg>`;
    } else if (type === 'L2H') {
        const size = 12;
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="filter: ${filter}; transform: translate(-50%, -50%); overflow: visible;">
                   <path d="M12 3L22 20H2L12 3Z" fill="${color}" stroke="${stroke}" stroke-width="${strokeW}" stroke-linejoin="round" />
                </svg>`;
    } else {
        const size = 12; // Hexagon
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="filter: ${filter}; transform: translate(-50%, -50%); overflow: visible;">
                   <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" fill="${color}" stroke="${stroke}" stroke-width="${strokeW}" stroke-linejoin="round" />
                </svg>`;
    }
};

const createCustomIcon = (type: string, stage: string, notes?: string) => {
    const color = getPinColor(stage as SiteStage, notes);
    const html = generateIconHtml(type, color);

    return L.divIcon({
        className: 'custom-map-pin',
        html: html,
        iconSize: [0, 0], // CSS handles positioning via svg transform translate
        iconAnchor: [0, 0],
        popupAnchor: [0, -10]
    });
};

const createClusterCustomIcon = function (cluster: any) {
    const markers = cluster.getAllChildMarkers();
    let hasIssue = false;
    let hasPermitProcess = false;

    markers.forEach((marker: any) => {
        const siteData = marker.options.siteData;
        if (siteData) {
            if (siteData.stage === 'issue_hold' || siteData.stage_notes?.toLowerCase().includes('issue')) {
                hasIssue = true;
            } else if (siteData.stage === 'permit_process') {
                hasPermitProcess = true;
            }
        }
    });

    let bgColor = 'rgba(156, 163, 175, 0.9)';
    let shadowColor = 'rgba(156, 163, 175, 0.5)';
    if (hasIssue) {
        bgColor = 'rgba(239, 68, 68, 0.9)';
        shadowColor = 'rgba(239, 68, 68, 0.5)';
    } else if (hasPermitProcess) {
        bgColor = 'rgba(245, 158, 11, 0.9)';
        shadowColor = 'rgba(245, 158, 11, 0.5)';
    }

    return L.divIcon({
        html: `<div style="background-color: ${bgColor}; box-shadow: 0 0 8px ${shadowColor}; color: white; border: 2px solid white; border-radius: 50%; font-weight: bold; display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;">${cluster.getChildCount()}</div>`,
        className: 'custom-cluster-icon',
        iconSize: L.point(30, 30, true),
    });
};

interface MapWidgetProps {
    className?: string;
    height?: string;
    presetType?: ProjectType;
    presetStage?: string;
    onTabChange?: (tab: string) => void;
}

const MapWidget: Component<MapWidgetProps> = (props) => {
    const [filterType, setFilterType] = createSignal<ProjectType | 'All'>(props.presetType || 'All');
    const [filterStage, setFilterStage] = createSignal<string>(props.presetStage || 'All');
    const [filterCluster, setFilterCluster] = createSignal<string>('All');
    const [activeSiteId, setActiveSiteId] = createSignal<string | null>(null);

    // Keep reactivity in sync if props change
    createEffect(() => {
        if (props.presetStage) setFilterStage(props.presetStage);
    });

    const filteredSitesBase = createMemo(() => {
        return siteMasterRecords.filter(site => {
            if (filterType() !== 'All' && site.project_type !== filterType()) return false;
            if (filterStage() !== 'All' && site.stage !== filterStage()) return false;
            if (filterCluster() !== 'All' && site.cluster !== filterCluster()) return false;
            return true;
        });
    });

    const validMapSites = createMemo(() => {
        return filteredSitesBase().filter(site => site.latitude != null && site.longitude != null);
    });

    const missingCoordsCount = createMemo(() => filteredSitesBase().length - validMapSites().length);

    const availableStages = createMemo(() => {
        const stages = new Set<string>();
        siteMasterRecords.forEach(s => stages.add(s.stage));
        return Array.from(stages);
    });

    const availableClusters = createMemo(() => {
        const clusters = new Set<string>();
        siteMasterRecords.forEach(s => { if (s.cluster) clusters.add(s.cluster); });
        return Array.from(clusters).sort();
    });

    const activeSite = createMemo(() => {
        return validMapSites().find(s => s.id === activeSiteId()) || null;
    });

    const resetFilters = () => {
        setFilterType(props.presetType || 'All');
        setFilterStage('All');
        setFilterCluster('All');
        setActiveSiteId(null);
    };

    const defaultCenter: [number, number] = [-6.2, 106.8];
    let mapContainerRef!: HTMLDivElement;
    let mapInstance: L.Map | null = null;
    let markerClusterGroup: L.MarkerClusterGroup | null = null;

    onMount(() => {
        if (!mapContainerRef) return;

        // Initialize Map
        mapInstance = L.map(mapContainerRef, {
            center: defaultCenter,
            zoom: 9,
            zoomControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
            className: "map-tiles-custom"
        }).addTo(mapInstance);

        markerClusterGroup = L.markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 50,
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            iconCreateFunction: createClusterCustomIcon
        });

        mapInstance.addLayer(markerClusterGroup);

        onCleanup(() => {
            if (mapInstance) {
                mapInstance.remove();
                mapInstance = null;
            }
        });
    });

    // Handle marker updates when data changes
    createEffect(() => {
        if (!mapInstance || !markerClusterGroup) return;

        // Clear existing markers
        markerClusterGroup.clearLayers();

        const sites = validMapSites();
        const markers = sites.map(site => {
            const marker = L.marker([site.latitude!, site.longitude!], {
                icon: createCustomIcon(site.project_type, site.stage, site.stage_notes),
                // @ts-ignore
                siteData: site
            });

            const pinColor = getPinColor(site.stage as SiteStage, site.stage_notes);
            const pinLabel = getPinLabel(site.stage as SiteStage, site.stage_notes);

            const tooltipHtml = `
                <div class="custom-map-tooltip-content">
                    <div class="font-mono text-[10px] font-bold text-slate-500 leading-none">${site.site_id} <span class="bg-slate-100 text-[8px] px-1 rounded ml-1">${site.project_type}</span></div>
                    <div class="font-bold text-slate-800 text-[11px] leading-tight my-1">${site.site_name}</div>
                    <div class="text-slate-500 text-[10px] flex items-center gap-1 mb-1 leading-none"><svg style="width: 10px; height: 10px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> ${site.cluster || '—'}</div>
                    <div class="flex items-center gap-1 text-[10px] font-semibold text-slate-700 leading-none mb-1">
                        <div class="w-1.5 h-1.5 rounded-full" style="background-color: ${pinColor}"></div>
                        ${pinLabel}
                    </div>
                    <div class="text-[10px] text-slate-500 leading-none mt-1.5 pt-1.5 border-t border-slate-100">Team: ${site.team_assigned || '—'}</div>
                </div>
            `;

            marker.bindTooltip(tooltipHtml, {
                className: 'custom-map-tooltip',
                direction: 'top',
                offset: [0, -10],
                opacity: 1
            });

            marker.on('click', () => {
                setActiveSiteId(site.id);
            });

            return marker;
        });

        markerClusterGroup.addLayers(markers);

        // Auto-fit bounds logic
        const active = activeSite();
        if (active && active.latitude && active.longitude) {
            const pt = mapInstance.project([active.latitude, active.longitude], mapInstance.getZoom());
            pt.x -= 150;
            const latlng = mapInstance.unproject(pt, mapInstance.getZoom());
            mapInstance.flyTo(latlng, Math.max(mapInstance.getZoom(), 12), { duration: 0.5 });
        } else if (sites.length > 0) {
            const bounds = L.latLngBounds(sites.map(s => [s.latitude!, s.longitude!]));
            mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
    });

    const toggleLegend = (e: MouseEvent) => {
        const content = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
        content.classList.toggle('hidden');
    };

    return (
        <div class={`flex flex-col w-full bg-slate-50 ${props.className || ''}`} style={{ height: props.height || '100%' }}>

            {/* TOP BAR / COMPACT FILTER ROW */}
            <div class="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-sm z-[1010] shrink-0">
                <div class="flex items-center gap-2 overflow-x-auto">
                    <select
                        value={filterType()}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        disabled={!!props.presetType}
                        class="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none hover:border-blue-300 transition-colors disabled:opacity-50"
                    >
                        <option value="All">All Types</option>
                        <For each={PROJECT_TYPES}>
                            {(pt) => <option value={pt.id}>{pt.label}</option>}
                        </For>
                    </select>

                    <select
                        value={filterStage()}
                        onChange={(e) => setFilterStage(e.target.value)}
                        class="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none hover:border-blue-300 transition-colors capitalize"
                    >
                        <option value="All">All Stages</option>
                        <For each={availableStages()}>
                            {(s) => <option value={s}>{s.replace(/_/g, ' ')}</option>}
                        </For>
                    </select>

                    <select
                        value={filterCluster()}
                        onChange={(e) => setFilterCluster(e.target.value)}
                        class="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-700 outline-none hover:border-blue-300 transition-colors"
                    >
                        <option value="All">All Clusters</option>
                        <For each={availableClusters()}>
                            {(c) => <option value={c}>{c}</option>}
                        </For>
                    </select>

                    <button
                        onClick={resetFilters}
                        class="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md transition-colors"
                    >
                        Reset
                    </button>
                </div>

                <div class="flex items-center gap-3 text-xs">
                    <span class="font-semibold text-slate-700">{validMapSites().length} sites ditampilkan</span>
                    <Show when={missingCoordsCount() > 0}>
                        <span class="text-slate-300">•</span>
                        <span
                            class="text-amber-600 hover:text-amber-700 font-bold cursor-pointer underline decoration-amber-300 hover:decoration-amber-500 underline-offset-2 transition-colors"
                        >
                            {missingCoordsCount()} tanpa koordinat
                        </span>
                    </Show>
                </div>
            </div>

            {/* MAP RENDERER & OVERLAYS */}
            <div class="flex-1 w-full relative z-0">

                {/* FLOATING RIGHT PANEL FOR SITE DETAILS */}
                <Show when={activeSite()}>
                    {(site) => (
                        <div class="absolute top-4 right-4 bottom-4 w-80 bg-white/95 backdrop-blur shadow-2xl rounded-xl z-[1000] border border-slate-200 animate-in slide-in-from-right-8 fade-in overflow-hidden flex flex-col pointer-events-auto">
                            <div class="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50">
                                <div>
                                    <div class="font-mono text-sm font-bold text-slate-600 mb-1 leading-none">{site().site_id} <span class="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] bg-slate-200 text-slate-700 ml-1 leading-none align-middle">{site().project_type}</span></div>
                                    <div class="font-bold text-slate-800 text-base leading-tight">{site().site_name}</div>
                                </div>
                                <button onClick={() => setActiveSiteId(null)} class="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                                    <div class="w-4 h-4"><XIcon /></div>
                                </button>
                            </div>
                            <div class="p-4 space-y-3 flex-1 overflow-y-auto">
                                <div class="grid grid-cols-3 gap-1">
                                    <span class="text-xs text-slate-500">Stage:</span>
                                    <span class="col-span-2 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                                        <span class="w-2 h-2 rounded-full" style={{ "background-color": getPinColor(site().stage as SiteStage, site().stage_notes) }}></span>
                                        {getPinLabel(site().stage as SiteStage, site().stage_notes)}
                                    </span>
                                </div>
                                <div class="grid grid-cols-3 gap-1">
                                    <span class="text-xs text-slate-500">Cluster:</span>
                                    <span class="col-span-2 text-xs font-semibold text-slate-800">{site().cluster || '—'}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-1">
                                    <span class="text-xs text-slate-500">Region:</span>
                                    <span class="col-span-2 text-xs font-semibold text-slate-800">{site().region || '—'}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-1">
                                    <span class="text-xs text-slate-500">Sector:</span>
                                    <span class="col-span-2 text-xs font-semibold text-slate-800">{site().sector || '—'}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-1">
                                    <span class="text-xs text-slate-500">Team:</span>
                                    <span class="col-span-2 text-xs font-semibold text-slate-800">{site().team_assigned || '— Belum ditugaskan'}</span>
                                </div>
                                <div class="grid grid-cols-3 gap-1">
                                    <span class="text-xs text-slate-500">Updated:</span>
                                    <span class="col-span-2 text-xs font-semibold text-slate-800">
                                        {site().stage_updated_at ? new Date(site().stage_updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </span>
                                </div>
                            </div>
                            <div class="p-4 border-t border-slate-100 bg-slate-50">
                                <button
                                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2 rounded-lg text-center transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <div class="w-4 h-4"><ArrowRightIcon /></div> Lihat Detail Site
                                </button>
                            </div>
                        </div>
                    )}
                </Show>

                {/* LEGEND (Bottom Left) */}
                <div class="absolute bottom-4 left-4 z-[1000] pointer-events-auto flex flex-col gap-2">
                    <div class="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-md overflow-hidden">
                        <div class="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer" onClick={toggleLegend}>
                            <span class="text-[10px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                                <div class="w-3 h-3 text-slate-400"><LayersIcon /></div>
                                Legenda
                            </span>
                            <div class="w-3 h-3 text-slate-400"><ChevronDownIcon /></div>
                        </div>

                        <div class="p-3 text-xs space-y-3">
                            <div>
                                <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Shapes (Type)</div>
                                <div class="grid grid-cols-2 gap-x-4 gap-y-1.5 min-w-[200px]">
                                    <div class="flex items-center gap-2 text-[10px] font-medium text-slate-600"><div style={{ width: '12px', height: '12px', "border-radius": '50%', "background-color": '#CBD5E1', border: '1px solid #94A3B8' }}></div> FILTER</div>
                                    <div class="flex items-center gap-2 text-[10px] font-medium text-slate-600"><div style={{ width: '10px', height: '10px', "background-color": '#CBD5E1', border: '1px solid #94A3B8' }}></div> COMBAT</div>
                                    <div class="flex items-center gap-2 text-[10px] font-medium text-slate-600"><div style={{ width: '12px', height: '12px', "background-color": '#CBD5E1', border: '1px solid #94A3B8', transform: 'rotate(45deg) scale(0.8)' }}></div> BLACKSITE</div>
                                    <div class="flex items-center gap-2 text-[10px] font-medium text-slate-600">
                                        <div style={{ width: '0', height: '0', "border-left": '6px solid transparent', "border-right": '6px solid transparent', "border-bottom": '12px solid #CBD5E1' }}></div> L2H
                                    </div>
                                    <div class="flex items-center gap-2 text-[10px] font-medium text-slate-600"><div style={{ width: '12px', height: '12px', "background-color": '#CBD5E1', border: '1px solid #94A3B8' }}></div> REFINEN</div>
                                </div>
                            </div>
                            <div class="pt-2 border-t border-slate-100">
                                <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Colors (Stage)</div>
                                <div class="grid grid-cols-1 gap-1.5">
                                    <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full" style={{ "background-color": STAGE_COLORS['imported'] }}></div> <span class="text-[10px] text-slate-600">Imported / Assigned</span></div>
                                    <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full" style={{ "background-color": STAGE_COLORS['permit_process'] }}></div> <span class="text-[10px] text-slate-600">Permit Process</span></div>
                                    <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full" style={{ "background-color": STAGE_COLORS['permit_ready'] }}></div> <span class="text-[10px] text-slate-600">Permit Ready</span></div>
                                    <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full" style={{ "background-color": STAGE_COLORS['akses_process'] }}></div> <span class="text-[10px] text-slate-600">Akses Process/Ready</span></div>
                                    <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full" style={{ "background-color": STAGE_COLORS['implementasi'] }}></div> <span class="text-[10px] text-slate-600">Implementasi</span></div>
                                    <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full" style={{ "background-color": STAGE_COLORS['bast'] }}></div> <span class="text-[10px] text-slate-600">BAST / Invoice</span></div>
                                    <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full" style={{ "background-color": STAGE_COLORS['issue_hold'] }}></div> <span class="text-[10px] text-slate-600">Issue / Hold</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAP */}
                <div ref={mapContainerRef} style={{ height: '100%', width: '100%', "z-index": '0' }}></div>
            </div>

            <style>{`
                .custom-map-tooltip {
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid #E2E8F0;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                    border-radius: 8px;
                    padding: 8px 10px;
                }
                .custom-map-tooltip::before {
                    border-top-color: #E2E8F0 !important;
                }
                .map-tiles-custom {
                    filter: saturate(0.8) contrast(1.1) brightness(1.05);
                }
                .leaflet-cluster-anim .leaflet-marker-icon, .leaflet-cluster-anim .leaflet-marker-shadow {
                    -webkit-transition: -webkit-transform 0.3s ease-out, opacity 0.3s ease-in;
                    -moz-transition: -moz-transform 0.3s ease-out, opacity 0.3s ease-in;
                    -o-transition: -o-transform 0.3s ease-out, opacity 0.3s ease-in;
                    transition: transform 0.3s ease-out, opacity 0.3s ease-in;
                }
                .leaflet-cluster-spider-leg {
                    -webkit-transition: -webkit-stroke-dashoffset 0.3s ease-out, -webkit-stroke-opacity 0.3s ease-in;
                    -moz-transition: -moz-stroke-dashoffset 0.3s ease-out, -moz-stroke-opacity 0.3s ease-in;
                    -o-transition: -o-stroke-dashoffset 0.3s ease-out, -o-stroke-opacity 0.3s ease-in;
                    transition: stroke-dashoffset 0.3s ease-out, stroke-opacity 0.3s ease-in;
                }
                .leaflet-marker-pane, .leaflet-shadow-pane, .leaflet-overlay-pane {
                    z-index: 10;
                }
            `}</style>
        </div>
    );
};

export default MapWidget;
