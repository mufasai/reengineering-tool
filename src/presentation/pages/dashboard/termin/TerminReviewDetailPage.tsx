import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { TerminSubmission } from '../../../../domain/entities/termin-submission.entity';
import { TerminRepositoryImpl } from '../../../../infrastructure/repositories/termin.repository.impl';
import { ReviewTerminInteractor } from '../../../../application/use-cases/review-termin.use-case';
import { authStore } from '../../../store/auth.store';

interface TerminReviewDetailPageProps {
    termin: TerminSubmission;
    onBack: () => void;
}

const TerminReviewDetailPage: Component<TerminReviewDetailPageProps> = (props) => {
    const [catatanReview, setCatatanReview] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal('');

    // Check if user is Head Office
    const isHeadOffice = () => {
        const role = authStore.user()?.role;
        return role === 'head_office' || role === 'backoffice_admin';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatSiteId = (siteId: string | { site_name: string }) => {
        // If siteId is an object with site_name, return the site_name
        if (typeof siteId === 'object' && siteId.site_name) {
            return siteId.site_name;
        }
        // Otherwise, remove "sites:" prefix if exists
        return typeof siteId === 'string' ? siteId.replace('sites:', '') : '';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleApprove = async () => {
        if (!catatanReview().trim()) {
            setError('Catatan review harus diisi');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const reviewerName = authStore.user()?.name || 'Finance Manager';
            const terminRepository = new TerminRepositoryImpl();
            const reviewTerminUseCase = new ReviewTerminInteractor(terminRepository);

            await reviewTerminUseCase.execute(props.termin.id, {
                reviewer_name: reviewerName,
                catatan_review: catatanReview(),
                approve: true
            });

            // Success - go back to list
            props.onBack();
        } catch (err: any) {
            console.error('Failed to approve termin:', err);
            setError(err.message || 'Gagal menyetujui termin');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!catatanReview().trim()) {
            setError('Catatan review harus diisi');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const reviewerName = authStore.user()?.name || 'Finance Manager';
            const terminRepository = new TerminRepositoryImpl();
            const reviewTerminUseCase = new ReviewTerminInteractor(terminRepository);

            await reviewTerminUseCase.execute(props.termin.id, {
                reviewer_name: reviewerName,
                catatan_review: catatanReview(),
                approve: false
            });

            // Success - go back to list
            props.onBack();
        } catch (err: any) {
            console.error('Failed to reject termin:', err);
            setError(err.message || 'Gagal menolak termin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="space-y-6">
            {/* Header */}
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Review Termin {props.termin.type_termin}</h1>
                    <p class="text-sm text-slate-600 mt-1">Site: {formatSiteId(props.termin.site_id)}</p>
                </div>
                <button
                    onClick={() => props.onBack()}
                    class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all"
                >
                    ← Kembali
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Form Review */}
                <div class="lg:col-span-2">
                    <div class="bg-white border border-slate-200 rounded-xl p-6">
                        <h2 class="text-lg font-bold text-slate-900 mb-6">Form Review Field Head</h2>

                        <Show when={error()}>
                            <div class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error()}
                            </div>
                        </Show>

                        <Show when={!isHeadOffice()}>
                            <div class="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                                <p class="font-semibold">Akses Terbatas</p>
                                <p>Hanya Head Office yang dapat melakukan review termin.</p>
                            </div>
                        </Show>

                        <div class="space-y-6">
                            {/* Jumlah Termin */}
                            <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                                <p class="text-sm font-semibold text-slate-700">
                                    Jumlah Termin: {formatCurrency(props.termin.jumlah)}
                                </p>
                            </div>

                            {/* Submitter */}
                            <div>
                                <p class="text-sm text-slate-600">
                                    <span class="font-semibold">Submitter:</span> {props.termin.submitted_by || 'N/A'}
                                </p>
                            </div>

                            {/* Tanggal Submit */}
                            <div>
                                <p class="text-sm text-slate-600">
                                    <span class="font-semibold">Tanggal Submit:</span>{' '}
                                    {props.termin.submitted_at ? formatDate(props.termin.submitted_at) : 'N/A'}
                                </p>
                            </div>

                            {/* Catatan Review */}
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">
                                    Catatan Review
                                </label>
                                <textarea
                                    value={catatanReview()}
                                    onInput={(e) => setCatatanReview(e.currentTarget.value)}
                                    rows={6}
                                    disabled={loading() || !isHeadOffice()}
                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-slate-100"
                                    placeholder={isHeadOffice() ? "review oleh head office" : "Hanya Head Office yang dapat mengisi catatan review"}
                                />
                            </div>

                            {/* Action Buttons - Only show for Head Office */}
                            <Show when={isHeadOffice()}>
                                <div class="flex gap-3 pt-4">
                                    <button
                                        onClick={handleApprove}
                                        disabled={loading()}
                                        class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all disabled:bg-slate-300"
                                    >
                                        {loading() ? 'Memproses...' : 'Setujui & Teruskan ke Direktur'}
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={loading()}
                                        class="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:bg-slate-300"
                                    >
                                        {loading() ? 'Memproses...' : 'Tolak (Kembali ke Draft)'}
                                    </button>
                                </div>
                            </Show>
                        </div>
                    </div>
                </div>

                {/* Right Column - Info */}
                <div class="lg:col-span-1 space-y-6">
                    {/* Info Termin */}
                    <div class="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 class="text-lg font-bold text-slate-900 mb-4">Info Termin</h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="text-slate-600">Type:</span>
                                <span class="font-semibold">{props.termin.type_termin}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-600">Jumlah:</span>
                                <span class="font-semibold">{formatCurrency(props.termin.jumlah)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-600">Percentage:</span>
                                <span class="font-semibold">{props.termin.percentage}%</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-600">Site:</span>
                                <span class="font-semibold">{formatSiteId(props.termin.site_id)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Workflow */}
                    <div class="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 class="text-lg font-bold text-slate-900 mb-4">Workflow</h3>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3">
                                <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-semibold text-slate-700">Submit</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                    <div class="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-semibold text-blue-700">Field Head Review</p>
                                    <p class="text-xs text-slate-500">Sedang direview</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center">
                                    <div class="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-semibold text-slate-500">Director Approval</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center">
                                    <div class="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-semibold text-slate-500">Finance Payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminReviewDetailPage;
