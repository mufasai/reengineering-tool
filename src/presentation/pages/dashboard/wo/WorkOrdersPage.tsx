import { createSignal, Switch, Match, Show } from 'solid-js';
import type { Component } from 'solid-js';
import WorkOrderListPage from './WorkOrderListPage';
import TechnicalProcessForm from './components/TechnicalProcessForm';
import TerminSubmission from './components/TerminSubmission';

const WorkOrdersPage: Component = () => {
    const [view, setView] = createSignal<'LIST' | 'CREATE' | 'DETAILS'>('LIST');
    const [showModal, setShowModal] = createSignal(false);

    // Form state for new WO
    const [newWO, setNewWO] = createSignal({
        contractNumber: '',
        projectType: 'FILTER' as any, // Cast to any or the full ProjectType union
        poValue: 0
    });

    const handleCreateWO = () => {
        // Logic to "save" then move to technical process
        setShowModal(false);
        setView('CREATE');
    };

    return (
        <div class="min-h-screen bg-[#0a0f1d] text-white p-6 lg:p-12 font-sans relative">
            <div class="max-w-7xl mx-auto space-y-10">
                <nav class="flex items-center gap-4 text-sm font-medium">
                    <button
                        onClick={() => setView('LIST')}
                        class={`transition-colors flex items-center gap-2 ${view() === 'LIST' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Work Orders
                    </button>
                    <span class="text-gray-700">/</span>
                    <span class="text-gray-300">
                        {view() === 'LIST' ? 'Overview' : view() === 'CREATE' ? 'New WO' : 'WO Management'}
                    </span>
                </nav>

                <Switch>
                    <Match when={view() === 'LIST'}>
                        <div class="space-y-4">
                            <WorkOrderListPage
                                onCreateWO={() => setShowModal(true)}
                                onCreateTechnical={() => setView('CREATE')}
                            />
                        </div>
                    </Match>
                    <Match when={view() === 'CREATE'}>
                        <div class="space-y-6">
                            <button
                                onClick={() => setView('LIST')}
                                class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                Back to List
                            </button>
                            <TechnicalProcessForm initialPoValue={newWO().poValue} />
                            <div class="flex justify-center pt-8">
                                <button
                                    onClick={() => setView('DETAILS')}
                                    class="text-emerald-400 text-sm font-bold hover:underline flex items-center gap-2"
                                >
                                    Demo: View Termin Submission (Stage 1-4)
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>
                    </Match>
                    <Match when={view() === 'DETAILS'}>
                        <div class="space-y-6">
                            <button
                                onClick={() => setView('LIST')}
                                class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                Back to List
                            </button>
                            <TerminSubmission projectType={newWO().projectType} />
                        </div>
                    </Match>
                </Switch>
            </div>

            {/* Modal for Create New WO */}
            <Show when={showModal()}>
                <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div class="bg-[#161b2b] border border-white/10 w-full max-w-lg rounded-[32px] p-8 space-y-8 shadow-2xl scale-in-center overflow-hidden">
                        <header class="space-y-2">
                            <h2 class="text-2xl font-bold text-white">Initialize New WO</h2>
                            <p class="text-sm text-gray-400">Step 1: Define core contract details.</p>
                        </header>

                        <div class="space-y-5">
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Contract Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. CTR-2024-XXX"
                                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                    onInput={(e) => setNewWO({ ...newWO(), contractNumber: e.currentTarget.value })}
                                />
                            </div>

                            <div class="space-y-2">
                                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Project Type</label>
                                <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {(['COMBAT', 'L2H', 'BLACK SITE', 'REFINEN', 'FILTER', 'BEBAN OPERASIONAL'] as const).map((type) => (
                                        <button
                                            onClick={() => setNewWO({ ...newWO(), projectType: type })}
                                            class={`py-2.5 rounded-xl border font-bold text-[10px] transition-all uppercase tracking-tight ${newWO().projectType === type ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">PO Value (100%)</label>
                                <div class="relative">
                                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        class="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-mono"
                                        onInput={(e) => setNewWO({ ...newWO(), poValue: Number(e.currentTarget.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <footer class="flex items-center gap-4 pt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                class="flex-1 py-3.5 rounded-2xl font-bold bg-white/5 hover:bg-white/10 text-gray-400 transition-all border border-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateWO}
                                class="flex-1 py-3.5 rounded-2xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                            >
                                Create & Proceed
                            </button>
                        </footer>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default WorkOrdersPage;
