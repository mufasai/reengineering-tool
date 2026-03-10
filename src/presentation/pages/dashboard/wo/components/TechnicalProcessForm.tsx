import { createSignal, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { Site } from '../../../../../domain/entities/work-order.entity';

interface TechnicalProcessFormProps {
    initialPoValue?: number;
}

const TechnicalProcessForm: Component<TechnicalProcessFormProps> = (props) => {
    const [teamType, setTeamType] = createSignal<'REGISTERED' | 'UNREGISTERED'>('REGISTERED');
    const [poValue, setPoValue] = createSignal(props.initialPoValue || 0);
    const [sites, setSites] = createSignal<Site[]>([]);
    const [isImporting, setIsImporting] = createSignal(false);

    const budgetTotal = () => poValue() * 0.7;

    const handleImport = () => {
        setIsImporting(true);
        // Simulate import delay
        setTimeout(() => {
            const mockSites: Site[] = [
                {
                    id: 'S1',
                    site_name: 'Site Alpha',
                    site_info: 'Information about Alpha',
                    pekerjaan: 'Installation',
                    lokasi: 'Jakarta',
                    nomor_kontrak: 'K-001',
                    start: new Date(),
                    end: new Date(),
                    maximal_budget: 10000000,
                    cost_estimated: 8000000,
                    pemberi_tugas: 'Telco A',
                    penerima_tugas: 'Smartelco',
                    site_document: null,
                    team: []
                },
                {
                    id: 'S2',
                    site_name: 'Site Bravo',
                    site_info: 'Information about Bravo',
                    pekerjaan: 'Maintenance',
                    lokasi: 'Surabaya',
                    nomor_kontrak: 'K-002',
                    start: new Date(),
                    end: new Date(),
                    maximal_budget: 15000000,
                    cost_estimated: 12000000,
                    pemberi_tugas: 'Telco B',
                    penerima_tugas: 'Smartelco',
                    site_document: null,
                    team: []
                },
                {
                    id: 'S3',
                    site_name: 'Site Charlie',
                    site_info: 'Information about Charlie',
                    pekerjaan: 'Survey',
                    lokasi: 'Bandung',
                    nomor_kontrak: 'K-003',
                    start: new Date(),
                    end: new Date(),
                    maximal_budget: 5000000,
                    cost_estimated: 4000000,
                    pemberi_tugas: 'Telco C',
                    penerima_tugas: 'Smartelco',
                    site_document: null,
                    team: []
                },
            ];
            setSites(mockSites);
            setIsImporting(false);
        }, 2000);
    };

    return (
        <div class="bg-white border border-slate-200 rounded-[32px] p-8 lg:p-12 space-y-10 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-700 max-w-5xl mx-auto">
            <header>
                <span class="text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-full border border-blue-100">Phase 1</span>
                <h2 class="text-3xl font-black mt-4 text-slate-900 uppercase tracking-tight italic">Technical Process</h2>
                <p class="text-slate-500 mt-2 font-medium">Initialize WO by assigning a team and importing site lists.</p>
            </header>

            <div class="grid lg:grid-cols-2 gap-12">
                {/* Left Column: Team & Budget */}
                <div class="space-y-8">
                    <section class="space-y-4">
                        <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest">Team Assignment</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setTeamType('REGISTERED')}
                                class={`p-6 rounded-2xl border transition-all text-left group ${teamType() === 'REGISTERED' ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                            >
                                <p class={`text-[10px] font-black uppercase tracking-widest ${teamType() === 'REGISTERED' ? 'text-blue-100' : 'text-slate-400'}`}>Type A</p>
                                <p class={`text-lg font-black mt-1 uppercase italic ${teamType() === 'REGISTERED' ? 'text-white' : 'text-slate-800'}`}>Registered</p>
                            </button>
                            <button
                                onClick={() => setTeamType('UNREGISTERED')}
                                class={`p-6 rounded-2xl border transition-all text-left group ${teamType() === 'UNREGISTERED' ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/20' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                            >
                                <p class={`text-[10px] font-black uppercase tracking-widest ${teamType() === 'UNREGISTERED' ? 'text-blue-100' : 'text-slate-400'}`}>Type B</p>
                                <p class={`text-lg font-black mt-1 uppercase italic ${teamType() === 'UNREGISTERED' ? 'text-white' : 'text-slate-800'}`}>Unregistered</p>
                            </button>
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 leading-none">Team Leader Name</label>
                            <input type="text" placeholder="Select or enter name..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 font-medium" />
                        </div>
                    </section>

                    <section class="space-y-6 pt-6 border-t border-slate-100">
                        <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest">Financial Overview</h3>
                        <div class="space-y-4">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 leading-none">PO Value (100%)</label>
                                <div class="relative">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                                    <input
                                        type="number"
                                        value={poValue()}
                                        onInput={(e) => setPoValue(Number(e.currentTarget.value))}
                                        placeholder="0"
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-bold"
                                    />
                                </div>
                            </div>
                            <div class="bg-blue-50 border border-blue-100 p-6 rounded-2xl shadow-sm">
                                <p class="text-[10px] font-black text-blue-600 uppercase tracking-widest">Calculated Budget (70%)</p>
                                <p class="text-3xl font-black text-blue-700 mt-1 font-mono tracking-tight">
                                    Rp {budgetTotal().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Site List Import */}
                <div class="space-y-6 bg-slate-50 border border-slate-100 p-8 rounded-[32px]">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-black text-slate-800 uppercase tracking-widest">Site Management</h3>
                        <button
                            onClick={handleImport}
                            disabled={isImporting()}
                            class="text-[10px] font-black bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <Show when={isImporting()} fallback={<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>}>
                                <div class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </Show>
                            Import Sites
                        </button>
                    </div>

                    <div class="min-h-[300px] border border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-white/50 shadow-inner">
                        <Show when={sites().length > 0} fallback={
                            <div class="space-y-4">
                                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                                </div>
                                <p class="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] max-w-[200px]">No sites imported yet</p>
                            </div>
                        }>
                            <div class="w-full space-y-3">
                                <For each={sites()}>
                                    {(site) => (
                                        <div class="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 text-left group hover:border-blue-500/30 transition-all shadow-sm">
                                            <div>
                                                <p class="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{site.site_name}</p>
                                                <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{site.lokasi}</p>
                                            </div>
                                            <button class="text-slate-300 hover:text-red-500 px-2 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </For>
                                <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest pt-2 mt-4 border-t border-slate-100">{sites().length} sites pending registration</p>
                            </div>
                        </Show>
                    </div>
                </div>
            </div>

            <div class="flex justify-end pt-8 border-t border-slate-100">
                <button class="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:translate-y-[-2px] active:translate-y-[0px] active:scale-95 uppercase tracking-widest text-xs italic">
                    Save & Proceed to Term-1
                </button>
            </div>
        </div>
    );
};

export default TechnicalProcessForm;
