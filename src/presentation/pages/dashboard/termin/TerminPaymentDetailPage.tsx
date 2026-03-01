import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { TerminSubmission } from '../../../../domain/entities/termin-submission.entity';
import { authStore } from '../../../store/auth.store';
import { TerminRepositoryImpl } from '../../../../infrastructure/repositories/termin.repository.impl';
import { PayTerminInteractor } from '../../../../application/use-cases/pay-termin.use-case';

interface TerminPaymentDetailPageProps {
    termin: TerminSubmission;
    onBack: () => void;
}

const TerminPaymentDetailPage: Component<TerminPaymentDetailPageProps> = (props) => {
    const [referensiPembayaran, setReferensiPembayaran] = createSignal('');
    const [buktiPembayaran, setBuktiPembayaran] = createSignal<File | null>(null);
    const [catatanPembayaran, setCatatanPembayaran] = createSignal('');
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [error, setError] = createSignal('');

    // Check if user is Finance
    const isFinance = () => authStore.user()?.role === 'finance';

    const formatSiteId = (siteId: string | { site_name: string }) => {
        if (typeof siteId === 'object' && siteId.site_name) {
            return siteId.site_name;
        }
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
            month: 'long',
            year: 'numeric'
        });
    };

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            setBuktiPembayaran(target.files[0]);
        }
    };

    const handleConfirmPayment = async () => {
        setError('');

        // Validation
        if (!referensiPembayaran().trim()) {
            setError('Referensi pembayaran harus diisi');
            return;
        }

        if (!buktiPembayaran()) {
            setError('Bukti pembayaran harus diupload');
            return;
        }

        setIsSubmitting(true);

        try {
            const paidBy = authStore.user()?.name || 'Finance';

            const terminRepository = new TerminRepositoryImpl();
            const payTerminUseCase = new PayTerminInteractor(terminRepository);

            await payTerminUseCase.execute(props.termin.id, {
                approved_by: paidBy,
                jumlah_dibayar: props.termin.jumlah,
                referensi_pembayaran: referensiPembayaran(),
                catatan_pembayaran: catatanPembayaran(),
                bukti_pembayaran: buktiPembayaran()!
            });

            // Success - go back to list
            props.onBack();
        } catch (err: any) {
            setError(err.message || 'Gagal melakukan pembayaran');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div class="space-y-6">
            {/* Header */}
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900">Pembayaran Termin {props.termin.termin_ke}</h1>
                    <p class="text-sm text-slate-600 mt-1">
                        {formatSiteId(props.termin.site_id)} • {props.termin.type_termin}
                    </p>
                </div>
                <button
                    onClick={() => props.onBack()}
                    class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all"
                >
                    ← Kembali
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Form Pembayaran */}
                <div class="lg:col-span-2">
                    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h2 class="text-lg font-bold text-slate-900 mb-6">Form Pembayaran</h2>

                        {error() && (
                            <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p class="text-sm text-red-600">{error()}</p>
                            </div>
                        )}

                        {!isFinance() && (
                            <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p class="text-sm font-semibold text-yellow-700">Akses Terbatas</p>
                                <p class="text-sm text-yellow-600">Hanya Finance yang dapat melakukan pembayaran termin.</p>
                            </div>
                        )}

                        <div class="space-y-6">
                            {/* Jumlah yang dibayarkan - Highlighted */}
                            <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <p class="text-sm font-semibold text-slate-700">
                                    Jumlah yang dibayarkan: {formatCurrency(props.termin.jumlah)}
                                </p>
                            </div>

                            {/* Referensi Pembayaran */}
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">
                                    Referensi Pembayaran <span class="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={referensiPembayaran()}
                                    onInput={(e) => setReferensiPembayaran(e.currentTarget.value)}
                                    disabled={!isFinance()}
                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100"
                                    placeholder={isFinance() ? "TRF-123456" : "Hanya Finance yang dapat mengisi"}
                                />
                                <p class="text-xs text-slate-500 mt-1">
                                    Nomor referensi pembayaran (no. transfer, cek, dll)
                                </p>
                            </div>

                            {/* Upload Bukti Pembayaran */}
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">
                                    Upload Bukti Pembayaran <span class="text-red-500">*</span>
                                </label>
                                <div class="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-emerald-400 transition-colors">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf"
                                        disabled={!isFinance()}
                                        class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {buktiPembayaran() && (
                                        <p class="text-xs text-emerald-600 mt-2">
                                            ✓ File terpilih: {buktiPembayaran()!.name}
                                        </p>
                                    )}
                                </div>
                                <p class="text-xs text-slate-500 mt-1">
                                    Upload bukti transfer/screenshot pembayaran (Max: 10MB)
                                </p>
                            </div>

                            {/* Catatan Pembayaran */}
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">
                                    Catatan Pembayaran
                                </label>
                                <textarea
                                    value={catatanPembayaran()}
                                    onInput={(e) => setCatatanPembayaran(e.currentTarget.value)}
                                    rows={5}
                                    disabled={!isFinance()}
                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none disabled:bg-slate-100"
                                    placeholder={isFinance() ? "Dibayarkan oleh keuangan" : "Hanya Finance yang dapat mengisi"}
                                />
                            </div>

                            {/* Action Buttons - Only show for Finance */}
                            {isFinance() && (
                                <div class="flex gap-3 pt-4">
                                    <button
                                        onClick={handleConfirmPayment}
                                        disabled={isSubmitting()}
                                        class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                                    >
                                        {isSubmitting() ? (
                                            <>
                                                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                Konfirmasi Pembayaran
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => props.onBack()}
                                        disabled={isSubmitting()}
                                        class="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-700 font-semibold rounded-lg transition-all"
                                    >
                                        Batal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Info Termin */}
                <div class="lg:col-span-1">
                    <div class="sticky top-6 space-y-4">
                        {/* Informasi Termin */}
                        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <h3 class="text-sm font-bold text-slate-900 mb-4">Informasi Termin</h3>
                            <div class="space-y-3">
                                <div>
                                    <p class="text-xs text-slate-500">Termin</p>
                                    <p class="text-sm font-semibold text-slate-900">Termin {props.termin.termin_ke}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-500">Tipe</p>
                                    <p class="text-sm font-semibold text-slate-900">{props.termin.type_termin}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-500">Persentase</p>
                                    <p class="text-sm font-semibold text-slate-900">{props.termin.percentage}%</p>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-500">Jumlah</p>
                                    <p class="text-sm font-semibold text-emerald-600">{formatCurrency(props.termin.jumlah)}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-500">Site</p>
                                    <p class="text-sm font-semibold text-slate-900">{formatSiteId(props.termin.site_id)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Persetujuan */}
                        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <h3 class="text-sm font-bold text-slate-900 mb-4">Informasi Persetujuan</h3>
                            <div class="space-y-3">
                                <div>
                                    <p class="text-xs text-slate-500">Diajukan Oleh</p>
                                    <p class="text-sm font-semibold text-slate-900">{props.termin.submitted_by || '-'}</p>
                                    <p class="text-xs text-slate-500">{props.termin.submitted_at ? formatDate(props.termin.submitted_at) : '-'}</p>
                                </div>
                                {props.termin.reviewed_by && (
                                    <div>
                                        <p class="text-xs text-slate-500">Direview Oleh</p>
                                        <p class="text-sm font-semibold text-slate-900">{props.termin.reviewed_by}</p>
                                        {props.termin.catatan_review && (
                                            <p class="text-xs text-slate-600 mt-1 italic">"{props.termin.catatan_review}"</p>
                                        )}
                                    </div>
                                )}
                                {props.termin.approved_by && (
                                    <div>
                                        <p class="text-xs text-slate-500">Disetujui Oleh</p>
                                        <p class="text-sm font-semibold text-slate-900">{props.termin.approved_by}</p>
                                        {props.termin.catatan_approval && (
                                            <p class="text-xs text-slate-600 mt-1 italic">"{props.termin.catatan_approval}"</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Workflow Progress */}
                        <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <h3 class="text-sm font-bold text-slate-900 mb-4">Alur Persetujuan</h3>
                            <div class="space-y-3">
                                <div class="flex items-start gap-3">
                                    <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-slate-900">Pengajuan</p>
                                        <p class="text-xs text-slate-500">Team Leader</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-slate-900">Review</p>
                                        <p class="text-xs text-slate-500">Finance</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <div class="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-slate-900">Persetujuan</p>
                                        <p class="text-xs text-slate-500">Direktur</p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                        <div class="w-2 h-2 bg-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <p class="text-sm font-semibold text-blue-600">Pembayaran</p>
                                        <p class="text-xs text-slate-500">Finance (Sedang Diproses)</p>
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

export default TerminPaymentDetailPage;
