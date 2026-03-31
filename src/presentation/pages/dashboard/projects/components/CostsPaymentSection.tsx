import { createSignal, createMemo, For, Show } from 'solid-js';
import type { Component } from 'solid-js';

interface SiteCost {
    id: string;
    siteId: string;
    typeTermin: string;
    status: 'pengajuan' | 'approved' | 'paid' | 'rejected';
    jumlahPengajuan: number;
    jumlahPembayaran: number;
}

interface CostsPaymentSectionProps {
    costs: SiteCost[];
    canSubmit: boolean;
    canUploadProof: boolean;
    canApprove: boolean;
    onSubmit: () => void;
    onUploadProof: (id: string) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const CostsPaymentSection: Component<CostsPaymentSectionProps> = (props) => {
    const [searchTerm, setSearchTerm] = createSignal('');
    const [statusFilter, setStatusFilter] = createSignal('');
    const [currentPage, setCurrentPage] = createSignal(1);
    const itemsPerPage = 5;

    const filteredCosts = createMemo(() => {
        return props.costs.filter(c => {
            const matchesSearch = c.typeTermin.toLowerCase().includes(searchTerm().toLowerCase());
            const matchesStatus = statusFilter() ? c.status === statusFilter() : true;
            return matchesSearch && matchesStatus;
        });
    });

    const paginatedCosts = createMemo(() => {
        const start = (currentPage() - 1) * itemsPerPage;
        return filteredCosts().slice(start, start + itemsPerPage);
    });

    const totalPages = createMemo(() => Math.ceil(filteredCosts().length / itemsPerPage));

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pengajuan':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'approved':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'paid':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 class="font-semibold text-slate-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    Cost & Payments
                </h3>
                <Show when={props.canSubmit}>
                    <button
                        onClick={() => props.onSubmit()}
                        class="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-sm font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                        </svg>
                        Submit Pengajuan
                    </button>
                </Show>
            </div>

            {/* Filter Bar */}
            <div class="p-4 border-b border-slate-200 flex gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search termin..."
                    class="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                    value={searchTerm()}
                    onInput={(e) => { setSearchTerm(e.currentTarget.value); setCurrentPage(1); }}
                />
                <select
                    class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                    value={statusFilter()}
                    onChange={(e) => { setStatusFilter(e.currentTarget.value); setCurrentPage(1); }}
                >
                    <option value="">All Status</option>
                    <option value="pengajuan">Pengajuan</option>
                    <option value="approved">Approved</option>
                    <option value="paid">Paid</option>
                    <option value="rejected">Rejected</option>
                </select>

                {/* Export Buttons */}
                <div class="flex gap-2">
                    <button
                        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Copy"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                    </button>
                    <button
                        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="CSV"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                            <path d="M16 13H8" />
                            <path d="M16 17H8" />
                            <path d="M10 9H8" />
                        </svg>
                    </button>
                    <button
                        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Download"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                    </button>
                    <button
                        class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Print"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9V2h12v7" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <path d="M6 14h12v8H6z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[200px]">Termin</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[120px]">Status</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[160px]">Pengajuan</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[160px]">Dibayar</th>
                            <th class="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[100px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                        <Show when={paginatedCosts().length === 0}>
                            <tr>
                                <td colspan="5" class="px-4 py-8 text-center text-slate-500">
                                    {searchTerm() || statusFilter() ? 'No costs found' : 'No costs recorded yet'}
                                </td>
                            </tr>
                        </Show>
                        <For each={paginatedCosts()}>
                            {(cost) => (
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-4 py-3 font-medium text-slate-700">{cost.typeTermin}</td>
                                    <td class="px-4 py-3">
                                        <span class={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(cost.status)}`}>
                                            {cost.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-slate-600">
                                        Rp {cost.jumlahPengajuan.toLocaleString('id-ID')}
                                    </td>
                                    <td class="px-4 py-3 font-semibold text-slate-800">
                                        Rp {cost.jumlahPembayaran.toLocaleString('id-ID')}
                                    </td>
                                    <td class="px-4 py-3 text-right">
                                        <div class="flex justify-end gap-2">
                                            <Show when={cost.status === 'approved' && props.canUploadProof}>
                                                <button
                                                    onClick={() => props.onUploadProof(cost.id)}
                                                    class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Upload Proof"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="17 8 12 3 7 8" />
                                                        <line x1="12" x2="12" y1="3" y2="15" />
                                                    </svg>
                                                </button>
                                            </Show>
                                            <Show when={cost.status === 'pengajuan' && props.canApprove}>
                                                <button
                                                    onClick={() => props.onApprove(cost.id)}
                                                    class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                    title="Approve"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M20 6 9 17l-5-5" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => props.onReject(cost.id)}
                                                    class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Reject"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M18 6 6 18" />
                                                        <path d="m6 6 12 12" />
                                                    </svg>
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

            {/* Pagination */}
            <Show when={totalPages() > 1}>
                <div class="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                    <p class="text-sm text-slate-600">
                        Showing {((currentPage() - 1) * itemsPerPage) + 1} to {Math.min(currentPage() * itemsPerPage, filteredCosts().length)} of {filteredCosts().length} costs
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

export default CostsPaymentSection;
