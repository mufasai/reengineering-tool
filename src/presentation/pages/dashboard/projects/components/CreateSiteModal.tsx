import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { CreateSiteRequest } from '../../../../../domain/entities/work-order.entity';
import { CreateSiteInteractor } from '../../../../../application/use-cases/create-site.use-case';
import { siteRepository } from '../../../../../infrastructure/repositories/site.repository.impl';

interface CreateSiteModalProps {
    projectId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const createSiteUseCase = new CreateSiteInteractor(siteRepository);

const CreateSiteModal: Component<CreateSiteModalProps> = (props) => {
    const [siteName, setSiteName] = createSignal('');
    const [siteInfo, setSiteInfo] = createSignal('');
    const [pekerjaan, setPekerjaan] = createSignal('');
    const [lokasi, setLokasi] = createSignal('');
    const [nomorKontrak, setNomorKontrak] = createSignal('');
    const [startDate, setStartDate] = createSignal('');
    const [endDate, setEndDate] = createSignal('');
    const [maximalBudget, setMaximalBudget] = createSignal(0);
    const [costEstimated, setCostEstimated] = createSignal(0);
    const [pemberiTugas, setPemberiTugas] = createSignal('');
    const [penerimaTugas, setPenerimaTugas] = createSignal('');
    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal('');

    const handleSave = async () => {
        setError('');

        // Validation
        if (!siteName() || !pekerjaan() || !lokasi() || !startDate() || !endDate()) {
            setError('Mohon lengkapi field yang wajib diisi');
            return;
        }

        setIsLoading(true);

        try {
            const requestData: CreateSiteRequest = {
                project_id: props.projectId,
                site_name: siteName(),
                site_info: siteInfo(),
                pekerjaan: pekerjaan(),
                lokasi: lokasi(),
                nomor_kontrak: nomorKontrak(),
                start: startDate(),
                end: endDate(),
                maximal_budget: maximalBudget(),
                cost_estimated: costEstimated(),
                pemberi_tugas: pemberiTugas(),
                penerima_tugas: penerimaTugas(),
                site_document: null,
                team_members: []
            };

            await createSiteUseCase.execute(requestData);
            props.onSuccess();
        } catch (err: any) {
            setError(err.message || 'Gagal membuat site');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div class="bg-white border border-slate-200 w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <header class="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 uppercase tracking-tight">Create Site</h3>
                        <p class="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Site Parameters & Information</p>
                    </div>
                </header>

                <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {error() && (
                        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                            {error()}
                        </div>
                    )}

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5 col-span-2">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                Site Name <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={siteName()}
                                onInput={(e) => setSiteName(e.currentTarget.value)}
                                placeholder="Site Menteng"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                            />
                        </div>

                        <div class="space-y-1.5 col-span-2">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Site Info</label>
                            <textarea
                                value={siteInfo()}
                                onInput={(e) => setSiteInfo(e.currentTarget.value)}
                                placeholder="Area Menteng Jakarta Pusat dengan 500 rumah"
                                rows="2"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium resize-none"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                Pekerjaan <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={pekerjaan()}
                                onInput={(e) => setPekerjaan(e.currentTarget.value)}
                                placeholder="Instalasi Fiber to Home"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                Lokasi <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={lokasi()}
                                onInput={(e) => setLokasi(e.currentTarget.value)}
                                placeholder="Menteng, Jakarta Pusat"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                            />
                        </div>

                        <div class="space-y-1.5 col-span-2">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nomor Kontrak</label>
                            <input
                                type="text"
                                value={nomorKontrak()}
                                onInput={(e) => setNomorKontrak(e.currentTarget.value)}
                                placeholder="KTR/2026/001"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                Start Date <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={startDate()}
                                onChange={(e) => setStartDate(e.currentTarget.value)}
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                End Date <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={endDate()}
                                onChange={(e) => setEndDate(e.currentTarget.value)}
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Maximal Budget</label>
                            <input
                                type="number"
                                value={maximalBudget()}
                                onInput={(e) => setMaximalBudget(Number(e.currentTarget.value))}
                                placeholder="500000000"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-bold"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cost Estimated</label>
                            <input
                                type="number"
                                value={costEstimated()}
                                onInput={(e) => setCostEstimated(Number(e.currentTarget.value))}
                                placeholder="450000000"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-bold"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pemberi Tugas</label>
                            <input
                                type="text"
                                value={pemberiTugas()}
                                onInput={(e) => setPemberiTugas(e.currentTarget.value)}
                                placeholder="PT Telkom Indonesia"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Penerima Tugas</label>
                            <input
                                type="text"
                                value={penerimaTugas()}
                                onInput={(e) => setPenerimaTugas(e.currentTarget.value)}
                                placeholder="PT SmartElco Solutions"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                <footer class="p-6 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={props.onCancel}
                        disabled={isLoading()}
                        class="flex-1 py-3 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all border border-slate-200 uppercase tracking-widest text-[10px] disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading()}
                        class="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-widest text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading() ? 'Saving...' : 'Save Site'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CreateSiteModal;
