import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { Site } from '../../../../domain/entities/work-order.entity';
import type { TerminSubmission } from '../../../../domain/entities/termin-submission.entity';
import InfoTerminCard from './components/InfoTerminCard';
import { TerminRepositoryImpl } from '../../../../infrastructure/repositories/termin.repository.impl';
import { ReviewTerminInteractor } from '../../../../application/use-cases/review-termin.use-case';
import { authStore } from '../../../../presentation/store/auth.store';

interface TerminReviewPageProps {
    site: Site;
    terminNumber: number;
    terminData?: TerminSubmission | null;
    onBack: () => void;
    onApprove?: () => void;
    onReject?: () => void;
}

const TerminReviewPage: Component<TerminReviewPageProps> = (props) => {
    const [catatanReview, setCatatanReview] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal('');

    const getTerminData = () => {
        if (props.terminData) {
            return {
                jumlah: props.terminData.jumlah,
                submitter: props.terminData.submitted_by,
                tanggalSubmit: new Date(props.terminData.submitted_at).toLocaleString('id-ID', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
        }
        return {
            jumlah: 400000000,
            submitter: 'N/A',
            tanggalSubmit: '20/02/2026 14:35'
        };
    };

    const terminData = getTerminData();

    const handleApprove = async () => {
        if (!catatanReview().trim()) {
            setError('Catatan review harus diisi');
            return;
        }

        if (!props.terminData) {
            setError('Data termin tidak ditemukan');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const reviewerName = authStore.user()?.name || 'Unknown Reviewer';

            const terminRepository = new TerminRepositoryImpl();
            const reviewTerminUseCase = new ReviewTerminInteractor(terminRepository);

            await reviewTerminUseCase.execute(props.terminData.id, {
                reviewer_name: reviewerName,
                catatan_review: catatanReview(),
                approve: true
            });

            console.log('Termin approved and forwarded to director');
            if (props.onApprove) {
                props.onApprove();
            }
        } catch (err: any) {
            console.error('Failed to approve termin:', err);
            setError(err.message || 'Gagal menyetujui termin. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!catatanReview().trim()) {
            setError('Catatan review harus diisi');
            return;
        }

        if (!props.terminData) {
            setError('Data termin tidak ditemukan');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const reviewerName = authStore.user()?.name || 'Unknown Reviewer';

            const terminRepository = new TerminRepositoryImpl();
            const reviewTerminUseCase = new ReviewTerminInteractor(terminRepository);

            await reviewTerminUseCase.execute(props.terminData.id, {
                reviewer_name: reviewerName,
                catatan_review: catatanReview(),
                approve: false
            });

            console.log('Termin rejected');
            if (props.onReject) {
                props.onReject();
            }
        } catch (err: any) {
            console.error('Failed to reject termin:', err);
            setError(err.message || 'Gagal menolak termin. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="min-h-screen bg-slate-50">
            <div class="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <p class="text-sm text-slate-500">Layouts / Layout 2</p>
                            <h1 class="text-3xl font-bold text-slate-900 mt-1">Review Termin TERMIN_{props.terminNumber}</h1>
                            <p class="text-sm text-slate-500 mt-1">Site B</p>
                        </div>
                        <button
                            onClick={() => props.onBack()}
                            class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all"
                        >
                            ← Kembali
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form Review */}
                    <div class="lg:col-span-2">
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h2 class="text-lg font-bold text-slate-900 mb-6">Form Review Field Head</h2>

                            {error() && (
                                <div class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error()}
                                </div>
                            )}

                            <div class="space-y-6">
                                {/* Jumlah Termin - Highlighted */}
                                <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                                    <p class="text-sm font-semibold text-slate-700 mb-2">Jumlah Termin: Rp {terminData.jumlah.toLocaleString('id-ID')}</p>
                                </div>

                                {/* Submitter */}
                                <div>
                                    <p class="text-sm text-slate-600">
                                        <span class="font-semibold">Submitter:</span> {terminData.submitter}
                                    </p>
                                </div>

                                {/* Tanggal Submit */}
                                <div>
                                    <p class="text-sm text-slate-600">
                                        <span class="font-semibold">Tanggal Submit:</span> {terminData.tanggalSubmit}
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
                                        disabled={loading()}
                                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                                        placeholder="review oleh head area"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div class="flex gap-3 pt-4">
                                    <button
                                        onClick={handleApprove}
                                        disabled={loading()}
                                        class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        {loading() ? 'Memproses...' : 'Setujui & Teruskan ke Direktur'}
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={loading()}
                                        class="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                        {loading() ? 'Memproses...' : 'Tolak (Kembali ke Draft)'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info & Workflow */}
                    <div class="lg:col-span-1 space-y-6">
                        {/* Info Termin */}
                        <InfoTerminCard
                            terminNumber={props.terminNumber}
                            type={`TERMIN_${props.terminNumber}`}
                            jumlah={terminData.jumlah}
                            site={props.site}
                            projectName="Example Project Fiber"
                        />

                        {/* Workflow */}
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 class="text-lg font-bold text-slate-900 mb-4">Workflow</h3>

                            <div class="space-y-3">
                                {/* Submit - Completed */}
                                <div class="flex items-start gap-3">
                                    <div class="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <div class="h-2 bg-emerald-500 rounded-full"></div>
                                        <p class="text-xs font-semibold text-slate-700 mt-1">Submit</p>
                                    </div>
                                </div>

                                {/* Field Head Review - Current */}
                                <div class="flex items-start gap-3">
                                    <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                                        <div class="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="h-2 bg-blue-500 rounded-full"></div>
                                        <p class="text-xs font-semibold text-blue-700 mt-1">Field Head Review</p>
                                        <p class="text-xs text-slate-500">Sedang direview oleh field head</p>
                                    </div>
                                </div>

                                {/* Director Approval - Pending */}
                                <div class="flex items-start gap-3">
                                    <div class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center mt-0.5">
                                        <div class="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="h-2 bg-slate-300 rounded-full"></div>
                                        <p class="text-xs font-semibold text-slate-500 mt-1">Director Approval</p>
                                    </div>
                                </div>

                                {/* Finance Payment - Pending */}
                                <div class="flex items-start gap-3">
                                    <div class="flex-shrink-0 w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center mt-0.5">
                                        <div class="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="h-2 bg-slate-300 rounded-full"></div>
                                        <p class="text-xs font-semibold text-slate-500 mt-1">Finance Payment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminReviewPage;
