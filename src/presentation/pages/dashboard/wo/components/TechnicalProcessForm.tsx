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
                    siteName: 'Site Alpha',
                    siteInfo: 'Information about Alpha',
                    pekerjaan: 'Installation',
                    lokasi: 'Jakarta',
                    nomorKontrak: 'K-001',
                    start: new Date(),
                    end: new Date(),
                    maximalBudget: 10000000,
                    costEstimated: 8000000,
                    pemberiTugas: 'Telco A',
                    penerimaTugas: 'Smartelco',
                    team: []
                },
                {
                    id: 'S2',
                    siteName: 'Site Bravo',
                    siteInfo: 'Information about Bravo',
                    pekerjaan: 'Maintenance',
                    lokasi: 'Surabaya',
                    nomorKontrak: 'K-002',
                    start: new Date(),
                    end: new Date(),
                    maximalBudget: 15000000,
                    costEstimated: 12000000,
                    pemberiTugas: 'Telco B',
                    penerimaTugas: 'Smartelco',
                    team: []
                },
                {
                    id: 'S3',
                    siteName: 'Site Charlie',
                    siteInfo: 'Information about Charlie',
                    pekerjaan: 'Survey',
                    lokasi: 'Bandung',
                    nomorKontrak: 'K-003',
                    start: new Date(),
                    end: new Date(),
                    maximalBudget: 5000000,
                    costEstimated: 4000000,
                    pemberiTugas: 'Telco C',
                    penerimaTugas: 'Smartelco',
                    team: []
                },
            ];
            setSites(mockSites);
            setIsImporting(false);
        }, 2000);
    };

    return (
        <div class="bg-white/5 border border-white/10 rounded-[32px] p-8 lg:p-12 space-y-10 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700 max-w-5xl mx-auto">
            <header>
                <span class="text-blue-400 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-blue-600/10 rounded-full border border-blue-500/20">Phase 1</span>
                <h2 class="text-3xl font-bold mt-4 text-white">Technical Process</h2>
                <p class="text-gray-400 mt-2">Initialize WO by assigning a team and importing site lists.</p>
            </header>

            <div class="grid lg:grid-cols-2 gap-12">
                {/* Left Column: Team & Budget */}
                <div class="space-y-8">
                    <section class="space-y-4">
                        <h3 class="text-lg font-semibold text-gray-200">Team Assignment</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setTeamType('REGISTERED')}
                                class={`p-4 rounded-2xl border transition-all text-left ${teamType() === 'REGISTERED' ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                            >
                                <p class={`text-xs font-bold uppercase tracking-wider ${teamType() === 'REGISTERED' ? 'text-blue-100' : 'text-gray-500'}`}>Type A</p>
                                <p class="text-lg font-bold mt-1 text-white">Registered</p>
                            </button>
                            <button
                                onClick={() => setTeamType('UNREGISTERED')}
                                class={`p-4 rounded-2xl border transition-all text-left ${teamType() === 'UNREGISTERED' ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                            >
                                <p class={`text-xs font-bold uppercase tracking-wider ${teamType() === 'UNREGISTERED' ? 'text-blue-100' : 'text-gray-500'}`}>Type B</p>
                                <p class="text-lg font-bold mt-1 text-white">Unregistered</p>
                            </button>
                        </div>
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-400 ml-1">Team Leader Name</label>
                            <input type="text" placeholder="Select or enter name..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                        </div>
                    </section>

                    <section class="space-y-6 pt-4 border-t border-white/5">
                        <h3 class="text-lg font-semibold text-gray-200">Financial Overview</h3>
                        <div class="space-y-4">
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-400 ml-1">PO Value (100%)</label>
                                <div class="relative">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                                    <input
                                        type="number"
                                        value={poValue()}
                                        onInput={(e) => setPoValue(Number(e.currentTarget.value))}
                                        placeholder="0"
                                        class="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-mono"
                                    />
                                </div>
                            </div>
                            <div class="bg-blue-600/10 border border-blue-500/20 p-6 rounded-2xl">
                                <p class="text-xs font-bold text-blue-400 uppercase tracking-widest">Calculated Budget (70%)</p>
                                <p class="text-2xl font-black text-white mt-1 font-mono">
                                    Rp {budgetTotal().toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Site List Import */}
                <div class="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-[24px]">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-200">Site Management</h3>
                        <button
                            onClick={handleImport}
                            disabled={isImporting()}
                            class="text-xs font-bold bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            <Show when={isImporting()} fallback={<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>}>
                                <div class="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                            </Show>
                            Import Sites
                        </button>
                    </div>

                    <div class="min-h-[300px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-black/20">
                        <Show when={sites().length > 0} fallback={
                            <div class="space-y-4">
                                <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                                </div>
                                <p class="text-gray-500 max-w-[200px]">No sites imported yet. Use the template to add sites.</p>
                            </div>
                        }>
                            <div class="w-full space-y-3">
                                <For each={sites()}>
                                    {(site) => (
                                        <div class="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 text-left group hover:border-blue-500/30 transition-all">
                                            <div>
                                                <p class="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{site.siteName}</p>
                                                <p class="text-xs text-gray-500 uppercase">{site.lokasi}</p>
                                            </div>
                                            <button class="text-gray-600 hover:text-red-400 px-2 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </For>
                                <p class="text-xs text-gray-600 pt-2">{sites().length} sites pending registration</p>
                            </div>
                        </Show>
                    </div>
                </div>
            </div>

            <div class="flex justify-end pt-6 border-t border-white/5">
                <button class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-600/30 transition-all hover:translate-y-[-2px] active:translate-y-[0px] active:scale-95">
                    Save & Proceed to Term-1
                </button>
            </div>
        </div>
    );
};

export default TechnicalProcessForm;
