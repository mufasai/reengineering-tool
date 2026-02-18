import { createSignal, For, Match, Switch, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { ProjectType } from '../../../../domain/entities/work-order.entity';

interface TerminSubmissionProps {
    projectType: ProjectType;
}

const TerminSubmission: Component<TerminSubmissionProps> = (props) => {
    const [currentStage, setCurrentStage] = createSignal(1);
    const [isSubmitting, setIsSubmitting] = createSignal(false);

    // Workflow configurations
    const getWorkflow = () => {
        if (props.projectType === 'COMBAT') {
            return [
                { id: 1, title: 'Term-1: SITAC', max: 35000000, subs: ['Operasional Cash', 'Sewa Lahan', 'Izin Warga', 'Izin Aparat/Pejabat/Ormas'] },
                { id: 2, title: 'Term-2: Dimentle', max: 38500000, subs: ['DP 30%', 'Instalasi 50%', 'BAST 20%'] },
                { id: 3, title: 'Term-3: Towing', max: 5550000, subs: ['Pengajuan 100%'] },
                { id: 4, title: 'Term-4: PSB PLN', max: 11000000, subs: ['Pengajuan 100%'] },
                { id: 5, title: 'Term-5: Instalasi', max: 21000000, subs: ['DP 30%', 'Selesai 50%', 'BAST 20%'] },
                { id: 6, title: 'Term-6: OPTIM', max: 4500000, subs: ['Pengajuan 100%'] },
            ];
        }
        return [
            { id: 1, title: 'Term-1', per: '30%', desc: 'Instalasi & Site Selection' },
            { id: 2, title: 'Term-2', per: '50%', desc: 'Work Finished & Evidence' },
            { id: 3, title: 'Term-3', per: '10%', desc: 'Confirmation' },
            { id: 4, title: 'Term-4', per: '10%', desc: 'BAST & PO Update' },
        ];
    };

    const workflow = getWorkflow();
    const currentStageInfo = () => workflow.find(s => s.id === currentStage());

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            if (currentStage() < workflow.length) setCurrentStage(prev => prev + 1);
        }, 1500);
    };

    return (
        <div class="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            {/* Dynamic Progress Tracker */}
            <div class="bg-white/5 border border-white/10 p-8 rounded-[32px] overflow-hidden">
                <div class="flex items-center justify-between px-4 overflow-x-auto pb-4 gap-8">
                    <For each={workflow}>
                        {(stage) => (
                            <div class="flex flex-col items-center gap-4 relative z-10 min-w-[100px] group">
                                <div
                                    onClick={() => setCurrentStage(stage.id)}
                                    class={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all cursor-pointer border-2 ${currentStage() === stage.id
                                            ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/30'
                                            : currentStage() > stage.id
                                                ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
                                                : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                                        }`}
                                >
                                    {currentStage() > stage.id ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    ) : stage.id}
                                </div>
                                <div class="text-center">
                                    <p class={`text-[10px] font-bold uppercase tracking-tight ${currentStage() === stage.id ? 'text-white' : 'text-gray-500'}`}>{stage.title}</p>
                                </div>
                                {/* Connector Line */}
                                {stage.id < workflow.length && (
                                    <div class={`absolute h-0.5 w-[calc(100%+32px)] left-[calc(50%+24px)] top-6 -z-10 ${currentStage() > stage.id ? 'bg-emerald-600/30' : 'bg-white/5'}`}></div>
                                )}
                            </div>
                        )}
                    </For>
                </div>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                {/* Main Content Areas */}
                <div class="lg:col-span-2 space-y-8">
                    <div class="bg-white/5 border border-white/10 rounded-[32px] p-10 space-y-8 relative overflow-hidden">
                        <header class="flex justify-between items-start">
                            <div>
                                <h3 class="text-2xl font-bold text-white leading-tight">
                                    {currentStageInfo()?.title}
                                    <span class="text-blue-400 ml-2">
                                        {props.projectType === 'COMBAT' ? `(Max Rp ${currentStageInfo()?.max?.toLocaleString()})` : `(${currentStageInfo()?.per})`}
                                    </span>
                                </h3>
                                <p class="text-gray-400 mt-2">Required documentation and workflow for this stage.</p>
                            </div>
                            <div class="px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-full">
                                <span class="text-xs font-bold text-blue-400 uppercase tracking-widest">Stage {currentStage()}</span>
                            </div>
                        </header>

                        <div class="space-y-8 pt-4">
                            {/* COMBAT Sub-Termins Logic */}
                            <Show when={props.projectType === 'COMBAT' && currentStageInfo()?.subs}>
                                <div class="space-y-6">
                                    <label class="text-sm font-semibold text-gray-300 uppercase tracking-wider ml-1">Breakdown Sub-Stages</label>
                                    <div class="grid gap-4">
                                        <For each={currentStageInfo()?.subs}>
                                            {(sub, index) => (
                                                <div class="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer">
                                                    <div class="flex items-center gap-4">
                                                        <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 font-bold text-xs ring-1 ring-white/10 font-mono">
                                                            {currentStage()}.{index() + 1}
                                                        </div>
                                                        <div>
                                                            <p class="text-white font-bold group-hover:text-blue-400 transition-colors uppercase text-sm tracking-tight">{sub}</p>
                                                            <p class="text-[10px] text-gray-600 font-bold uppercase mt-0.5">Required: Photos & Docs</p>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center gap-4">
                                                        <div class="text-right">
                                                            <input type="number" placeholder="Value..." class="w-24 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-right text-white focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                                        </div>
                                                        <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-600 hover:text-white transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </For>
                                    </div>
                                </div>
                            </Show>

                            {/* Standard View Logic */}
                            <Show when={props.projectType !== 'COMBAT'}>
                                <div class="space-y-6 bg-white/[0.02] p-8 rounded-2xl border border-white/5">
                                    <p class="text-gray-400 text-center italic">Standard flow for {props.projectType} projects...</p>
                                </div>
                            </Show>

                            {/* Universal Evidence Area */}
                            <div class="grid grid-cols-2 gap-6 pt-6 opacity-80 border-t border-white/5">
                                <div class="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 cursor-pointer transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Batch PhotoEvidence</p>
                                </div>
                                <div class="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 cursor-pointer transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Work Files (PDF/XLS)</p>
                                </div>
                            </div>
                        </div>

                        <div class="pt-8 flex items-center justify-between border-t border-white/5">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                                </div>
                                <p class="text-[11px] font-bold text-amber-500/80 uppercase tracking-wider">Awaiting: Pak Dipo Approval</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting()}
                                class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-8 rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <Show when={isSubmitting()} fallback={<span>Submit Stage {currentStage()}</span>}>
                                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Syncing...</span>
                                </Show>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Workflow Logic */}
                <div class="space-y-8">
                    <div class="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6">
                        <h3 class="text-xl font-bold text-white tracking-tight">Stage Analytics</h3>
                        <div class="space-y-6">
                            <div class="flex justify-between items-end border-b border-white/5 pb-4">
                                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Phase Budget</p>
                                <p class="text-xl font-black text-white font-mono">
                                    Rp {props.projectType === 'COMBAT' ? '116.050.000' : '70.000.000'}
                                </p>
                            </div>

                            <div class="space-y-3">
                                <For each={workflow}>
                                    {(t) => (
                                        <div class={`flex justify-between items-center p-3.5 rounded-xl border transition-all ${currentStage() === t.id ? 'bg-blue-600/10 border-blue-500/30 ring-1 ring-blue-500/20' : 'bg-white/5 border-transparent'}`}>
                                            <div>
                                                <p class={`text-[10px] font-bold ${currentStage() === t.id ? 'text-blue-400' : 'text-gray-500'}`}>{t.title} {t.per ? `(${t.per})` : ''}</p>
                                                <p class={`text-xs font-bold mt-1 ${currentStage() === t.id ? 'text-white' : 'text-gray-500'}`}>
                                                    {t.max ? `Limit: Rp ${t.max.toLocaleString()}` : 'Budgeted'}
                                                </p>
                                            </div>
                                            <Show when={currentStage() > t.id}>
                                                <div class="text-emerald-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                </div>
                                            </Show>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-600 border border-blue-500 rounded-[32px] p-8 text-center shadow-lg shadow-blue-600/20">
                        <p class="text-xs font-bold text-blue-100 uppercase tracking-widest mb-2">Finance Hub</p>
                        <p class="text-sm font-black text-white leading-tight">Pak Dipo will specify final values during individual stage approval.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminSubmission;
