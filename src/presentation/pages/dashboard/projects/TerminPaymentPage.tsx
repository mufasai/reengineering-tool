import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { Site } from '../../../../domain/entities/work-order.entity';
import InfoTerminCard from './components/InfoTerminCard';

interface TerminPaymentPageProps {
    site: Site;
    terminNumber: number;
    onBack: () => void;
    onPaymentSuccess?: () => void;
}

const TerminPaymentPage: Component<TerminPaymentPageProps> = (props) => {
    const [jumlahDibayarkan] = createSignal(400000000);
    const [referensiPembayaran, setReferensiPembayaran] = createSignal('');
    const [buktiPembayaran, setBuktiPembayaran] = createSignal<File | null>(null);
    const [catatanPembayaran, setCatatanPembayaran] = createSignal('');

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            setBuktiPembayaran(target.files[0]);
        }
    };

    const handleConfirmPayment = () => {
        console.log('Confirm payment:', {
            jumlah: jumlahDibayarkan(),
            referensi: referensiPembayaran(),
            bukti: buktiPembayaran()?.name,
            catatan: catatanPembayaran()
        });

        if (props.onPaymentSuccess) {
            props.onPaymentSuccess();
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
                            <h1 class="text-3xl font-bold text-slate-900 mt-1">Pembayaran Termin TERMIN_{props.terminNumber}</h1>
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
                    {/* Left Column - Form Pembayaran */}
                    <div class="lg:col-span-2">
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h2 class="text-lg font-bold text-slate-900 mb-6">Form Pembayaran</h2>

                            <div class="space-y-6">
                                {/* Jumlah yang dibayarkan - Highlighted */}
                                <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                                    <p class="text-sm font-semibold text-slate-700">
                                        Jumlah yang dibayarkan: Rp {jumlahDibayarkan().toLocaleString('id-ID')}
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
                                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="TRF-123456"
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
                                    <div class="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*,.pdf"
                                            class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
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
                                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Dibayarkan oleh keuangan"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div class="flex gap-3 pt-4">
                                    <button
                                        onClick={handleConfirmPayment}
                                        class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        Konfirmasi Pembayaran
                                    </button>
                                    <button
                                        onClick={() => props.onBack()}
                                        class="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-all"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info Termin */}
                    <div class="lg:col-span-1">
                        <div class="sticky top-6">
                            <InfoTerminCard
                                terminNumber={props.terminNumber}
                                type={`TERMIN_${props.terminNumber}`}
                                jumlah={jumlahDibayarkan()}
                                disetujui="John Doe"
                                tglApprove="20/02/2026"
                                site={props.site}
                                projectName="Example Project Fiber"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminPaymentPage;
