import { createSignal, onMount, Show, For } from 'solid-js';
import type { Component } from 'solid-js';
import { authStore } from '../../../store/auth.store';
import { TerminRepositoryImpl } from '../../../../infrastructure/repositories/termin.repository.impl';
import { GetAllTerminsInteractor } from '../../../../application/use-cases/get-all-termins.use-case';
import type { TerminSubmission } from '../../../../domain/entities/termin-submission.entity';
import TerminReviewDetailPage from './TerminReviewDetailPage';
import TerminApprovalDetailPage from './TerminApprovalDetailPage';
import TerminPaymentDetailPage from './TerminPaymentDetailPage';

const TerminListPage: Component = () => {
    const [termins, setTermins] = createSignal<TerminSubmission[]>([]);
    const [loading, setLoading] = createSignal(true);
    const [selectedTermin, setSelectedTermin] = createSignal<TerminSubmission | null>(null);
    const [showReviewPage, setShowReviewPage] = createSignal(false);
    const [showApprovalPage, setShowApprovalPage] = createSignal(false);
    const [showPaymentPage, setShowPaymentPage] = createSignal(false);
    const [activeTab, setActiveTab] = createSignal<string>('pending');

    const user = authStore.user;
    const isFinance = () => user()?.role?.toLowerCase() === 'finance';
    const isHeadOffice = () => {
        const role = user()?.role?.toLowerCase().replace(/\s+/g, '_') || '';
        return role === 'head_office' || role === 'backoffice_admin';
    };
    const isDirector = () => {
        const role = user()?.role?.toLowerCase() || '';
        return role === 'management' || role === 'direktur';
    };

    const terminRepository = new TerminRepositoryImpl();
    const getAllTerminsUseCase = new GetAllTerminsInteractor(terminRepository);

    // Get tabs based on role
    const getTabs = () => {
        if (isFinance()) {
            return [
                { id: 'pending', label: 'Perlu Dibayar' },
                { id: 'completed', label: 'Sudah Dibayar' }
            ];
        } else if (isHeadOffice()) {
            return [
                { id: 'pending', label: 'Perlu Review' },
                { id: 'completed', label: 'Sudah Direview' }
            ];
        } else if (isDirector()) {
            return [
                { id: 'pending', label: 'Perlu Persetujuan' },
                { id: 'approved', label: 'Sudah Disetujui' },
                { id: 'paid', label: 'Sudah Dibayar' }
            ];
        }
        return [];
    };

    onMount(async () => {
        await loadTermins();
    });

    const loadTermins = async () => {
        setLoading(true);
        try {
            const data = await getAllTerminsUseCase.execute();
            setTermins(data);
        } catch (error) {
            console.error('Error loading termins:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; class: string }> = {
            'pending_review': { label: 'Perlu Review', class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
            'field_head_review': { label: 'Review Field Head', class: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
            'reviewed': { label: 'Perlu Persetujuan', class: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
            'director_approval': { label: 'Perlu Persetujuan', class: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
            'approved': { label: 'Perlu Pembayaran', class: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
            'paid': { label: 'Dibayarkan', class: 'bg-green-500/10 text-green-500 border-green-500/20' }
        };
        return statusMap[status] || { label: status, class: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
    };

    const filteredTermins = () => {
        const role = user()?.role;
        const tab = activeTab();
        let filtered = termins();

        if (isFinance()) {
            if (tab === 'pending') {
                // Perlu Dibayar
                filtered = filtered.filter(t => t.status === 'approved');
            } else {
                // Sudah Dibayar
                filtered = filtered.filter(t => t.status === 'paid');
            }
        } else if (isHeadOffice()) {
            if (tab === 'pending') {
                // Perlu Review
                filtered = filtered.filter(t =>
                    t.status === 'pending_review' ||
                    t.status === 'field_head_review'
                );
            } else {
                // Sudah Direview
                filtered = filtered.filter(t =>
                    t.status === 'reviewed' ||
                    t.status === 'director_approval' ||
                    t.status === 'approved' ||
                    t.status === 'paid'
                );
            }
        } else if (isDirector()) {
            if (tab === 'pending') {
                // Perlu Persetujuan
                filtered = filtered.filter(t =>
                    t.status === 'reviewed' ||
                    t.status === 'director_approval'
                );
            } else if (tab === 'approved') {
                // Sudah Disetujui (approved, belum dibayar)
                filtered = filtered.filter(t => t.status === 'approved');
            } else if (tab === 'paid') {
                // Sudah Dibayar
                filtered = filtered.filter(t => t.status === 'paid');
            }
        }

        return filtered;
    };

    const formatSiteId = (siteId: string | { site_name: string }) => {
        // If siteId is an object with site_name, return the site_name
        if (typeof siteId === 'object' && siteId.site_name) {
            return siteId.site_name;
        }
        // Otherwise, remove "sites:" prefix if exists
        return typeof siteId === 'string' ? siteId.replace('sites:', '') : '';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleViewDetail = (termin: TerminSubmission) => {
        console.log('handleViewDetail called with termin:', termin);
        setSelectedTermin(termin);

        // Determine which page to show based on status
        if (termin.status === 'pending_review' || termin.status === 'field_head_review') {
            setShowReviewPage(true);
            setShowApprovalPage(false);
            setShowPaymentPage(false);
        } else if (termin.status === 'reviewed' || termin.status === 'director_approval') {
            setShowApprovalPage(true);
            setShowReviewPage(false);
            setShowPaymentPage(false);
        } else if (termin.status === 'approved') {
            setShowPaymentPage(true);
            setShowReviewPage(false);
            setShowApprovalPage(false);
        } else if (termin.status === 'paid') {
            // For paid termins, show a simple detail view (read-only)
            // We can reuse the approval page but it will be read-only
            setShowApprovalPage(true);
            setShowReviewPage(false);
            setShowPaymentPage(false);
        }

        console.log('showReviewPage:', showReviewPage(), 'showApprovalPage:', showApprovalPage(), 'showPaymentPage:', showPaymentPage());
    };

    const handleBackToList = () => {
        console.log('handleBackToList called');
        setShowReviewPage(false);
        setShowApprovalPage(false);
        setShowPaymentPage(false);
        setSelectedTermin(null);
        loadTermins();
    };

    return (
        <Show
            when={!showReviewPage() && !showApprovalPage() && !showPaymentPage()}
            fallback={
                <Show when={selectedTermin()}>
                    {(termin) => (
                        <Show
                            when={showReviewPage()}
                            fallback={
                                <Show
                                    when={showApprovalPage()}
                                    fallback={
                                        <TerminPaymentDetailPage
                                            termin={termin()}
                                            onBack={handleBackToList}
                                        />
                                    }
                                >
                                    <TerminApprovalDetailPage
                                        termin={termin()}
                                        onBack={handleBackToList}
                                    />
                                </Show>
                            }
                        >
                            <TerminReviewDetailPage
                                termin={termin()}
                                onBack={handleBackToList}
                            />
                        </Show>
                    )}
                </Show>
            }
        >
            <div class="space-y-6">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Daftar Termin</h1>
                    <p class="text-sm text-slate-600 mt-1">
                        {isFinance() ? 'Kelola pembayaran termin' :
                            isHeadOffice() ? 'Review termin dari team leader' :
                                isDirector() ? 'Persetujuan termin' :
                                    'Daftar semua termin'}
                    </p>
                </div>

                {/* Tabs */}
                <div class="border-b border-slate-200">
                    <div class="flex gap-4">
                        <For each={getTabs()}>
                            {(tab) => (
                                <button
                                    onClick={() => setActiveTab(tab.id)}
                                    class={`px-4 py-2 text-sm font-semibold transition-all border-b-2 ${activeTab() === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            )}
                        </For>
                    </div>
                </div>

                <Show
                    when={!loading()}
                    fallback={
                        <div class="flex items-center justify-center py-12">
                            <div class="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    }
                >
                    <Show
                        when={filteredTermins().length > 0}
                        fallback={
                            <div class="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 11l3 3L22 4" />
                                        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                    </svg>
                                </div>
                                <h3 class="text-lg font-semibold text-slate-900 mb-2">Tidak Ada Termin</h3>
                                <p class="text-sm text-slate-600">Belum ada termin yang perlu ditindaklanjuti</p>
                            </div>
                        }
                    >
                        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead class="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Termin</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Site</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Jumlah</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Diajukan</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-200">
                                        <For each={filteredTermins()}>
                                            {(termin) => {
                                                const statusBadge = getStatusBadge(termin.status);
                                                return (
                                                    <tr class="hover:bg-slate-50 transition-colors">
                                                        <td class="px-6 py-4">
                                                            <div class="text-sm font-medium text-slate-900">Termin {termin.termin_ke}</div>
                                                            <div class="text-xs text-slate-500">{termin.type_termin}</div>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <div class="text-sm text-slate-900">{formatSiteId(termin.site_id)}</div>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <div class="text-sm font-semibold text-slate-900">{formatCurrency(termin.jumlah)}</div>
                                                            <div class="text-xs text-slate-500">{termin.percentage}%</div>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.class}`}>
                                                                {statusBadge.label}
                                                            </span>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <div class="text-sm text-slate-900">{termin.submitted_by || '-'}</div>
                                                            <div class="text-xs text-slate-500">
                                                                {termin.submitted_at ? formatDate(termin.submitted_at) : '-'}
                                                            </div>
                                                        </td>
                                                        <td class="px-6 py-4">
                                                            <button
                                                                onClick={() => handleViewDetail(termin)}
                                                                class="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                                            >
                                                                {termin.status === 'pending_review' || termin.status === 'field_head_review' ? 'Review' :
                                                                    termin.status === 'reviewed' || termin.status === 'director_approval' ? 'Setujui' :
                                                                        termin.status === 'approved' ? 'Bayar' :
                                                                            termin.status === 'paid' ? 'Lihat Detail' :
                                                                                'Lihat Detail'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            }}
                                        </For>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Show>
                </Show>
            </div>
        </Show>
    );
};

export default TerminListPage;
