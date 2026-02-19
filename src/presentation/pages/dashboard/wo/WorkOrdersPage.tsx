import { createSignal, Switch, Match, Show } from 'solid-js';
import type { Component } from 'solid-js';
import WorkOrderListPage from './WorkOrderListPage';
import CreateWorkOrderForm from './components/CreateWorkOrderForm';

const WorkOrdersPage: Component = () => {
    const [view, setView] = createSignal<'LIST'>('LIST');
    const [showModal, setShowModal] = createSignal(false);

    const handleCreateWO = (data: any) => {
        console.log('Saving Unified WO from Modal:', data);
        setShowModal(false);
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
                        Overview
                    </span>
                </nav>

                <Switch>
                    <Match when={view() === 'LIST'}>
                        <div class="space-y-4">
                            <WorkOrderListPage
                                onCreateWO={() => setShowModal(true)}
                            />
                        </div>
                    </Match>
                </Switch>
            </div>

            {/* Unified Create WO Modal */}
            <Show when={showModal()}>
                <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div class="bg-[#0f1425] border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl scale-in-center overflow-hidden flex flex-col">
                        <header class="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div>
                                <h2 class="text-3xl font-black text-blue-400 italic tracking-tight uppercase">Create Project</h2>
                                <p class="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-[0.2em]">Project • Sites</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                class="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center border border-white/5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>
                        </header>

                        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <CreateWorkOrderForm
                                onSave={handleCreateWO}
                                onCancel={() => setShowModal(false)}
                            />
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default WorkOrdersPage;
