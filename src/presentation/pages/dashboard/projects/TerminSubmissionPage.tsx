import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { Site } from '../../../../domain/entities/work-order.entity';

interface TerminSubmissionPageProps {
    site: Site;
    terminNumber: number;
    onBack: () => void;
    onSubmitSuccess?: () => void;
}

const TerminSubmissionPage: Component<TerminSubmissionPageProps> = (props) => {
    const [typeTermin, setTypeTermin] = createSignal(`termin_${props.terminNumber}`);
    const [tanggalTermin, setTanggalTermin] = createSignal('');
    const [jumlahTermin, setJumlahTermin] = createSignal('');
    const [keterangan, setKeterangan] = createSignal('');

    const handleSubmitForReview = () => {
        console.log('Submit for review:', {
            typeTermin: typeTermin(),
            tanggalTermin: tanggalTermin(),
            jumlahTermin: jumlahTermin(),
            keterangan: keterangan()
        });
        // Add submit logic here
        // After successful submit, navigate to detail page
        if (props.onSubmitSuccess) {
            props.onSubmitSuccess();
        }
    };

    const handleSaveDraft = () => {
        console.log('Save as draft');
        // Add save draft logic here
    };

    const calculateExpectedAmount = () => {
        const percentage = 100 / 4; // Assuming 4 termins
        return (props.site.maximal_budget * percentage / 100).toLocaleString('id-ID');
    };

    return (
        <div class="min-h-screen bg-slate-50">
            <div class="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div class="mb-6">
                    <h1 class="text-3xl font-bold text-slate-900">Ajukan Termin {props.terminNumber}</h1>
                    <p class="text-sm text-slate-500 mt-1">Step 1 | Upload Project Files</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form */}
                    <div class="lg:col-span-2">
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h2 class="text-lg font-bold text-slate-900 mb-6">Form Pengajuan Termin {props.terminNumber}</h2>

                            <div class="space-y-6">
                                {/* Type Termin */}
                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">
                                        Type Termin
                                    </label>
                                    <input
                                        type="text"
                                        value={typeTermin()}
                                        onInput={(e) => setTypeTermin(e.currentTarget.value)}
                                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="termin_2"
                                    />
                                </div>

                                {/* Tanggal Termin */}
                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">
                                        Tanggal Termin
                                    </label>
                                    <input
                                        type="date"
                                        value={tanggalTermin()}
                                        onInput={(e) => setTanggalTermin(e.currentTarget.value)}
                                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Jumlah Termin */}
                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">
                                        Jumlah Termin (Rp)
                                    </label>
                                    <div class="relative">
                                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                            Rp
                                        </span>
                                        <input
                                            type="text"
                                            value={jumlahTermin()}
                                            onInput={(e) => setJumlahTermin(e.currentTarget.value)}
                                            class="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="400000000"
                                        />
                                    </div>
                                    <p class="text-xs text-slate-500 mt-1">
                                        Expected: 25% dari Rp {props.site.maximal_budget.toLocaleString('id-ID')} = Rp {calculateExpectedAmount()}
                                    </p>
                                </div>

                                {/* Keterangan */}
                                <div>
                                    <label class="block text-sm font-semibold text-slate-700 mb-2">
                                        Keterangan
                                    </label>
                                    <textarea
                                        value={keterangan()}
                                        onInput={(e) => setKeterangan(e.currentTarget.value)}
                                        rows={5}
                                        class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="pengajuan termin 2"
                                    />
                                    <p class="text-xs text-slate-400 mt-1">
                                        ⓘ Jangan submit termin jika menunggu review final hasil
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div class="flex gap-3 pt-4">
                                    <button
                                        onClick={handleSubmitForReview}
                                        class="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="9 11 12 14 22 4"></polyline>
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                        </svg>
                                        Submit untuk Review
                                    </button>
                                    <button
                                        onClick={handleSaveDraft}
                                        class="px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                            <polyline points="7 3 7 8 15 8"></polyline>
                                        </svg>
                                        Simpan sebagai Draft
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

                    {/* Right Column - Info Site */}
                    <div class="lg:col-span-1">
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
                            <h3 class="text-lg font-bold text-slate-900 mb-4">Info Site</h3>

                            <div class="space-y-3">
                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Site Name</p>
                                    <p class="text-sm font-semibold text-slate-900">{props.site.site_name}</p>
                                </div>

                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Project</p>
                                    <p class="text-sm font-semibold text-slate-900">Example Project Fiber</p>
                                </div>

                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Max Value</p>
                                    <p class="text-sm font-semibold text-slate-900">Rp {props.site.maximal_budget.toLocaleString('id-ID')}</p>
                                </div>

                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Termin Ke</p>
                                    <p class="text-sm font-semibold text-slate-900">{props.terminNumber}</p>
                                </div>

                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Percentage</p>
                                    <p class="text-sm font-semibold text-slate-900">{(props.terminNumber / 4 * 100).toFixed(0)}%</p>
                                </div>

                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Expected Amount</p>
                                    <p class="text-sm font-semibold text-slate-900">Rp {calculateExpectedAmount()}</p>
                                </div>
                            </div>

                            <div class="mt-6 pt-6 border-t border-slate-200">
                                <h4 class="text-sm font-bold text-slate-900 mb-3">Progress Workflow</h4>
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs text-slate-600">Progress</span>
                                        <span class="text-xs font-semibold text-slate-900">{((props.terminNumber - 1) / 4 * 100).toFixed(0)}%</span>
                                    </div>
                                    <div class="w-full bg-slate-200 rounded-full h-2">
                                        <div class="bg-blue-500 h-2 rounded-full" style={{ width: `${((props.terminNumber - 1) / 4 * 100)}%` }} />
                                    </div>
                                    <div class="mt-3">
                                        <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                            Sedang Termin {props.terminNumber}
                                        </span>
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

export default TerminSubmissionPage;
