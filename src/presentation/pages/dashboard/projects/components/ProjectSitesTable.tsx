import { createSignal, createMemo, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { Site } from '../../../../../domain/entities/work-order.entity';
import { authStore } from '../../../../store/auth.store';

interface ProjectSitesTableProps {
    sites: Site[];
    onEdit: (site: Site) => void;
    onDelete: (id: string) => void;
    onViewDetail: (site: Site) => void;
}

const ProjectSitesTable: Component<ProjectSitesTableProps> = (props) => {
    const [searchTerm, setSearchTerm] = createSignal('');
    const [currentPage, setCurrentPage] = createSignal(1);
    const [itemsPerPage] = createSignal(10);
    const [expandedRowId, setExpandedRowId] = createSignal<string | null>(null);

    const user = () => authStore.user();
    const canEdit = () => {
        const role = user()?.role || '';
        return ['admin', 'backoffice admin', 'management'].includes(role);
    };

    const toggleRow = (id: string, e: MouseEvent) => {
        e.stopPropagation();
        setExpandedRowId(prev => prev === id ? null : id);
    };

    const formatRelativeDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace('.', ':');
    };

    const getLatestUpdate = (site: Site) => {
        const updated = site.updated_at || site.created_at;
        if (!updated) return { text: '—', daysAgo: 0 };

        const daysAgo = Math.floor((new Date().getTime() - new Date(updated).getTime()) / (1000 * 3600 * 24));
        return { text: formatRelativeDate(updated), daysAgo };
    };

    // Filtered sites
    const filteredSites = createMemo(() => {
        return props.sites.filter(site =>
            site.site_name.toLowerCase().includes(searchTerm().toLowerCase()) ||
            (site.site_id || '').toLowerCase().includes(searchTerm().toLowerCase())
        );
    });

    // Pagination
    const totalPages = createMemo(() => Math.ceil(filteredSites().length / itemsPerPage()));
    const paginatedSites = createMemo(() => {
        const start = (currentPage() - 1) * itemsPerPage();
        return filteredSites().slice(start, start + itemsPerPage());
    });

    const getStageProps = (stage: string) => {
        switch (stage) {
            case 'imported': return { color: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Imported' };
            case 'assigned': return { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Assigned' };
            case 'survey': return { color: 'bg-cyan-100 text-cyan-700 border-cyan-200', label: 'Survey' };
            case 'survey_nok': return { color: 'bg-red-100 text-red-700 border-red-300 shadow-[0_0_8px_rgba(239,68,68,0.4)]', label: 'Survey NOK' };
            case 'erfin_process': return { color: 'bg-teal-100 text-teal-700 border-teal-200', label: 'ERFIN Process' };
            case 'erfin_ready': return { color: 'bg-teal-100 text-teal-700 border-teal-200', label: 'ERFIN Ready' };
            case 'permit_process': return { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Permit' };
            case 'permit_ready': return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Permit Ready' };
            case 'akses_process': return { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Akses' };
            case 'akses_ready': return { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Akses Ready' };
            case 'implementasi': return { color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200', label: 'Implementasi' };
            case 'rfi_done': return { color: 'bg-teal-100 text-teal-700 border-teal-200', label: 'RFI Done' };
            case 'rfs_done': return { color: 'bg-teal-100 text-teal-700 border-teal-200', label: 'RFS Done' };
            case 'dokumen_done': return { color: 'bg-teal-100 text-teal-700 border-teal-200', label: 'Docs Done' };
            case 'bast': return { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'BAST' };
            case 'invoice': return { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Invoice' };
            case 'completed': return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: '✓ Selesai' };
            default: return { color: 'bg-slate-100 text-slate-700 border-slate-200', label: stage || '-' };
        }
    };

    const renderTerminDots = (site: Site) => {
        // Simplified version - you can expand this based on your termin logic
        return (
            <div class="flex items-center gap-1 text-slate-300 font-bold" title="Status Termin">
                <span class="text-slate-400">●</span>
                <span class="text-[10px]">·</span>
                <span class="text-blue-500">●</span>
                <span class="text-[10px]">·</span>
                <span class="text-emerald-500">✓</span>
                <span class="text-[10px]">·</span>
                <span class="text-slate-400">🔒</span>
            </div>
        );
    };

    const renderBool = (val: boolean | null | undefined) => {
        if (val === true) return <span class="text-emerald-500 font-bold">✓</span>;
        if (val === false) return <span class="text-red-500 font-bold">✗</span>;
        return <span class="text-slate-400">—</span>;
    };

    return (
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Search Bar */}
            <div class="p-4 border-b border-slate-200 flex gap-4">
                <input
                    type="text"
                    placeholder="Cari site..."
                    class="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                    value={searchTerm()}
                    onInput={(e) => { setSearchTerm(e.currentTarget.value); setCurrentPage(1); }}
                />
            </div>

            {/* Table */}
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-24">Site ID</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Site Name</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Region</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stage</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-20">Termin</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Updated</th>
                            <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-10"></th>
                            <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                        <Show when={paginatedSites().length === 0}>
                            <tr>
                                <td colspan="8" class="px-4 py-8 text-center text-slate-500">
                                    {searchTerm() ? 'Tidak ada site ditemukan' : 'Belum ada site'}
                                </td>
                            </tr>
                        </Show>
                        <For each={paginatedSites()}>
                            {(site) => {
                                const stageProps = getStageProps(site.stage || '');
                                const updateInfo = getLatestUpdate(site);
                                const isStale = updateInfo.daysAgo > 14;
                                const isExpanded = expandedRowId() === site.id;
                                const isSurveyNok = site.stage === 'survey_nok';

                                return (
                                    <>
                                        <tr class={`hover:bg-slate-50 transition-colors ${isSurveyNok ? 'bg-red-50/20 border-l-[3px] border-l-red-500' : (isStale ? 'bg-amber-50/30' : '')} ${isExpanded ? 'border-b-0' : ''}`}>
                                            <td class="px-4 py-3 font-mono font-bold text-slate-800 text-sm">
                                                {site.site_id || '—'}
                                            </td>
                                            <td class="px-4 py-3">
                                                <button
                                                    onClick={() => props.onViewDetail(site)}
                                                    class="font-medium text-blue-600 hover:underline text-left max-w-[200px] truncate block"
                                                    title={site.site_name}
                                                >
                                                    {site.site_name}
                                                </button>
                                            </td>
                                            <td class="px-4 py-3">
                                                <span class="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                                    {site.region || '—'}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3">
                                                <span class={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border whitespace-nowrap ${stageProps.color}`}>
                                                    {stageProps.label}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3">
                                                {renderTerminDots(site)}
                                            </td>
                                            <td class="px-4 py-3 text-xs font-medium text-slate-600">
                                                {updateInfo.text}
                                            </td>
                                            <td class="px-4 py-3 text-center">
                                                <button
                                                    onClick={(e) => toggleRow(site.id, e)}
                                                    class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                                                    title={isExpanded ? "Collapse Details" : "Expand Details"}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="m6 9 6 6 6-6" />
                                                    </svg>
                                                </button>
                                            </td>
                                            <td class="px-4 py-3 text-right">
                                                <div class="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => props.onViewDetail(site)}
                                                        class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="View"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>
                                                    </button>
                                                    <Show when={canEdit()}>
                                                        <button
                                                            onClick={() => props.onEdit(site)}
                                                            class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                            title="Edit"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => props.onDelete(site.id)}
                                                            class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                            </svg>
                                                        </button>
                                                    </Show>
                                                </div>
                                            </td>
                                        </tr>
                                        <Show when={isExpanded}>
                                            <tr class="bg-slate-50">
                                                <td colspan="8" class="p-0 border-b border-slate-200">
                                                    <div class="flex w-full overflow-hidden">
                                                        {/* Colored left border */}
                                                        <div class={`w-[3px] shrink-0 ${stageProps.color.split(' ')[0].replace('bg-', 'bg-').replace('-100', '-500')}`} />
                                                        <div class="flex-1 p-4 px-6">
                                                            <div class="grid grid-cols-4 gap-6 text-sm">
                                                                {/* PERMIT COLUMN */}
                                                                <div class="space-y-2">
                                                                    <h4 class="font-bold text-slate-700 text-xs tracking-wider flex items-center gap-1.5 mb-3 border-b border-slate-200 pb-1">
                                                                        📋 PERMIT
                                                                    </h4>
                                                                    <div class="grid grid-cols-[60px_1fr] gap-x-2 gap-y-1 text-xs">
                                                                        <span class="text-slate-500">TPAS:</span>
                                                                        <span>{renderBool(null)}</span>
                                                                        <span class="text-slate-500">TP:</span>
                                                                        <span>{renderBool(null)}</span>
                                                                        <span class="text-slate-500">CAF:</span>
                                                                        <span>{renderBool(null)}</span>
                                                                    </div>
                                                                </div>

                                                                {/* AKSES COLUMN */}
                                                                <div class="space-y-2">
                                                                    <h4 class="font-bold text-slate-700 text-xs tracking-wider flex items-center gap-1.5 mb-3 border-b border-slate-200 pb-1">
                                                                        🔑 AKSES
                                                                    </h4>
                                                                    <div class="grid grid-cols-[60px_1fr] gap-x-2 gap-y-1 text-xs">
                                                                        <span class="text-slate-500">Provider:</span>
                                                                        <span class="text-slate-700 font-medium">—</span>
                                                                        <span class="text-slate-500">PIC:</span>
                                                                        <span class="text-slate-700">—</span>
                                                                    </div>
                                                                </div>

                                                                {/* IMPLEMENTASI COLUMN */}
                                                                <div class="space-y-2">
                                                                    <h4 class="font-bold text-slate-700 text-xs tracking-wider flex items-center gap-1.5 mb-3 border-b border-slate-200 pb-1">
                                                                        🔧 IMPLEMENTASI
                                                                    </h4>
                                                                    <div class="grid grid-cols-[45px_1fr] gap-x-2 gap-y-1 text-xs">
                                                                        <span class="text-slate-500">RFI:</span>
                                                                        <span>{renderBool(null)}</span>
                                                                        <span class="text-slate-500">RFS:</span>
                                                                        <span>{renderBool(null)}</span>
                                                                        <span class="text-slate-500">Dok:</span>
                                                                        <span>{renderBool(null)}</span>
                                                                    </div>
                                                                </div>

                                                                {/* INFO COLUMN */}
                                                                <div class="space-y-2 relative">
                                                                    <h4 class="font-bold text-slate-700 text-xs tracking-wider flex items-center gap-1.5 mb-3 border-b border-slate-200 pb-1">
                                                                        ℹ INFO
                                                                    </h4>
                                                                    <div class="grid grid-cols-[50px_1fr] gap-x-2 gap-y-1 text-xs">
                                                                        <span class="text-slate-500">Region:</span>
                                                                        <span class="text-slate-700">{site.region || '—'}</span>
                                                                        <span class="text-slate-500">Lokasi:</span>
                                                                        <span class="text-slate-700">{site.lokasi || '—'}</span>
                                                                    </div>
                                                                    <div class="absolute bottom-0 right-0">
                                                                        <button
                                                                            onClick={() => props.onViewDetail(site)}
                                                                            class="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-md transition-colors border border-blue-100 shadow-sm"
                                                                        >
                                                                            Lihat Detail Penuh
                                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 rotate-[-90deg]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                                <path d="m6 9 6 6 6-6" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </Show>
                                    </>
                                );
                            }}
                        </For>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Show when={totalPages() > 1}>
                <div class="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                    <p class="text-sm text-slate-600">
                        Showing {((currentPage() - 1) * itemsPerPage()) + 1} to {Math.min(currentPage() * itemsPerPage(), filteredSites().length)} of {filteredSites().length} sites
                    </p>
                    <div class="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage() - 1))}
                            disabled={currentPage() === 1}
                            class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span class="px-3 py-1 text-sm font-medium text-slate-700">
                            Page {currentPage()} of {totalPages()}
                        </span>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages(), currentPage() + 1))}
                            disabled={currentPage() === totalPages()}
                            class="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default ProjectSitesTable;
