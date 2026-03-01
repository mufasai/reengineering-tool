import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { TerminSubmission } from '../../../../domain/entities/termin-submission.entity';
import { TerminRepositoryImpl } from '../../../../infrastructure/repositories/termin.repository.impl';
import { ApproveTerminInteractor } from '../../../../application/use-cases/approve-termin.use-case';
import { authStore } from '../../../store/auth.store';

interface TerminApprovalDetailPageProps {
    termin: TerminSubmission;
    onBack: () => void;
}

const TerminApprovalDetailPage: Component<TerminApprovalDetailPageProps> = (props) => {
    const [catatanApproval, setCatatanApproval] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal('');

    // Check if user is Director
    const isDirector = () => {
        const role = authStore.user()?.role;
        return role === 'management' || role === 'direktur';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatSiteId = (siteId: string | { site_name: string }) => {
        if (typeof siteId === 'object' && siteId.site_name) {
            return siteId.site_name;
        }
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
        if (!catatanApproval().trim()) {
            setError('Catatan approval harus diisi');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const approverName = authStore.user()?.name || 'Direktur';
            const terminRepository = new TerminRepositoryImpl();
            const approveTerminUseCase = new ApproveTerminInteractor(terminRepository);

            await approveTerminUseCase.execute(props.termin.id, {
                approver_name: approverName,
                catatan_approval: catatanApproval(),
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
        if (!catatanApproval().trim()) {
            setError('Catatan approval harus diisi');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const approverName = authStore.user()?.name || 'Direktur';
            const terminRepository = new TerminRepositoryImpl();
            const approveTerminUseCase = new ApproveTerminInteractor(terminRepository);

            await approveTerminUseCase.execute(props.termin.id, {
                approver_name: approverName,
                catatan_approval: catatanApproval(),
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
                    <h1 class="text-2xl font-bold text-slate-900">Persetujuan Termin {props.termin.type_termin}</h1>
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
                {/* Left Column - Form Approval */}
                <div class="lg:col-span-2">
                    <div class="bg-white border border-slate-200 rounded-xl p-6">
                        <h2 class="text-lg font-bold text-slate-900 mb-6">Form Persetujuan Direktur</h2>

                        <Show when={error()}>
                            <div class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error()}
                            </div>
                        </Show>

                        <Show when={!isDirector()}>
                            <div class="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                                <p class="font-semibold">Akses Terbatas</p>
                                <p>Hanya Direktur yang dapat melakukan persetujuan termin.</p>
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
                                    <span class="font-semibold">Diajukan oleh:</span> {props.termin.submitted_by || 'N/A'}
                                </p>
                            </div>

                            {/* Tanggal Submit */}
                            <div>
                                <p class="text-sm text-slate-600">
                                    <span class="font-semibold">Tanggal Pengajuan:</span>{' '}
                                    {props.termin.submitted_at ? formatDate(props.termin.submitted_at) : 'N/A'}
                                </p>
                            </div>

                            {/* Reviewer Info */}
                            <Show when={props.termin.reviewed_by}>
                                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p class="text-sm font-semibold text-slate-700 mb-2">Review Finance</p>
                                    <p class="text-sm text-slate-600">
                                        <span class="font-semibold">Direview oleh:</span> {props.termin.reviewed_by}
                                    </p>
                                    <Show when={props.termin.catatan_review}>
                                        <p class="text-sm text-slate-600 mt-2">
                                            <span class="font-semibold">Catatan:</span> {props.termin.catatan_review}
                                        </p>
                                    </Show>
                                </div>
                            </Show>

                            {/* Catatan Approval */}
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">
                                    Catatan Persetujuan
                                </label>
                                <textarea
                                    value={catatanApproval()}
                                    onInput={(e) => setCatatanApproval(e.currentTarget.value)}
                                    rows={6}
                                    disabled={loading() || !isDirector()}
                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-slate-100"
                                    placeholder={isDirector() ? "Catatan persetujuan dari direktur" : "Hanya Direktur yang dapat mengisi catatan persetujuan"}
                                />
                            </div>

                            {/* Action Buttons - Only show for Director */}
                            <Show when={isDirector()}>
                                <div class="flex gap-3 pt-4">
                                    <button
                                        onClick={handleApprove}
                                        disabled={loading()}
                                        class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all disabled:bg-slate-300"
                                    >
                                        {loading() ? 'Memproses...' : 'Setujui Termin'}
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        disabled={loading()}
                                        class="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:bg-slate-300"
                                    >
                                        {loading() ? 'Memproses...' : 'Tolak Termin'}
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
                                <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-semibold text-slate-700">Field Head Review</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                    <div class="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <div class="flex-1">
                                    <p class="text-xs font-semibold text-blue-700">Director Approval</p>
                                    <p class="text-xs text-slate-500">Menunggu persetujuan</p>
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

export default TerminApprovalDetailPage;
