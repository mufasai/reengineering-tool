import { createSignal, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { ProjectType } from '../../../../../domain/entities/work-order.entity';

interface TerminSubmissionProps {
    projectType: ProjectType;
}

interface CombatStage {
    id: number;
    title: string;
    max: number;
    subs: string[];
}

interface StandardStage {
    id: number;
    title: string;
    per: string;
    desc: string;
}

type WorkflowStage = CombatStage | StandardStage;

const TerminSubmission: Component<TerminSubmissionProps> = (props) => {
    const [currentStage, setCurrentStage] = createSignal(1);
    const [isSubmitting, setIsSubmitting] = createSignal(false);

    // Workflow configurations
    const getWorkflow = (): WorkflowStage[] => {
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
        <div class="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20 font-sans">
            {/* Dynamic Progress Tracker */}
            <div class="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm overflow-hidden">
                <div class="flex items-center justify-between px-4 overflow-x-auto pb-4 gap-8">
                    <For each={workflow}>
                        {(stage) => (
                            <div class="flex flex-col items-center gap-4 relative z-10 min-w-[100px] group">
                                <div
                                    onClick={() => setCurrentStage(stage.id)}
                                    class={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all cursor-pointer border-2 ${currentStage() === stage.id
                                        ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-500/20 scale-110'
                                        : currentStage() > stage.id
                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                            : 'bg-slate-50 border-slate-100 text-slate-300 hover:border-slate-200 hover:text-slate-400'
                                        }`}
                                >
                                    {currentStage() > stage.id ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    ) : stage.id}
                                </div>
                                <div class="text-center">
                                    <p class={`text-[10px] font-black uppercase tracking-widest ${currentStage() === stage.id ? 'text-blue-600' : 'text-slate-400'}`}>{stage.title}</p>
                                </div>
                                {/* Connector Line */}
                                {stage.id < workflow.length && (
                                    <div class={`absolute h-1 w-[calc(100%+32px)] left-[calc(50%+24px)] top-6 -z-10 rounded-full ${currentStage() > stage.id ? 'bg-emerald-50' : 'bg-slate-50'}`}></div>
                                )}
                            </div>
                        )}
                    </For>
                </div>
            </div>

            <div class="grid lg:grid-cols-3 gap-8">
                {/* Main Content Areas */}
                <div class="lg:col-span-2 space-y-8">
                    <div class="bg-white border border-slate-200 rounded-[32px] p-10 space-y-8 relative overflow-hidden shadow-sm">
                        <header class="flex justify-between items-start">
                            <Show when={currentStageInfo()} keyed>
                                {(info) => (
                                    <div>
                                        <h3 class="text-2xl font-black text-slate-900 leading-tight uppercase italic tracking-tight">
                                            {info.title}
                                            <span class="text-blue-600 ml-2">
                                                {props.projectType === 'COMBAT' && 'max' in info ? `(Max Rp ${info.max.toLocaleString()})` : 'per' in info ? `(${info.per})` : ''}
                                            </span>
                                        </h3>
                                        <p class="text-slate-400 mt-2 font-medium">Required documentation and workflow for this stage.</p>
                                    </div>
                                )}
                            </Show>
                            <div class="px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full shadow-sm">
                                <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">Stage {currentStage()}</span>
                            </div>
                        </header>

                        <div class="space-y-8 pt-4">
                            {/* COMBAT Sub-Termins Logic */}
                            <Show when={props.projectType === 'COMBAT' && (currentStageInfo() as CombatStage)} keyed>
                                {(info) => (
                                    <Show when={info.subs} keyed>
                                        {(subs) => (
                                            <div class="space-y-6">
                                                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 leading-none">Breakdown Sub-Stages</label>
                                                <div class="grid gap-4">
                                                    <For each={subs}>
                                                        {(sub, index) => (
                                                            <div class="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer shadow-sm hover:shadow-md">
                                                                <div class="flex items-center gap-4">
                                                                    <div class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 font-black text-[10px] border border-slate-100 font-mono">
                                                                        {currentStage()}.{index() + 1}
                                                                    </div>
                                                                    <div>
                                                                        <p class="text-slate-800 font-black group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{sub}</p>
                                                                        <p class="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Required: Photos & Documents</p>
                                                                    </div>
                                                                </div>
                                                                <div class="flex items-center gap-4">
                                                                    <div class="text-right">
                                                                        <input type="number" placeholder="Value..." class="w-32 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-right text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold" />
                                                                    </div>
                                                                    <div class="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-blue-600 transition-all shadow-sm">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </For>
                                                </div>
                                            </div>
                                        )}
                                    </Show>
                                )}
                            </Show>

                            {/* Standard View Logic */}
                            <Show when={props.projectType !== 'COMBAT'}>
                                <div class="space-y-6 bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-inner">
                                    <p class="text-slate-400 text-center italic font-medium">Standard flow for {props.projectType} projects...</p>
                                </div>
                            </Show>

                            {/* Universal Evidence Area */}
                            <div class="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                                <div class="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 cursor-pointer transition-all bg-slate-50/30">
                                    <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                    </div>
                                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Batch PhotoEvidence</p>
                                </div>
                                <div class="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 cursor-pointer transition-all bg-slate-50/30">
                                    <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 border border-slate-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                    </div>
                                    <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Work Files (PDF/XLS)</p>
                                </div>
                            </div>
                        </div>

                        <div class="pt-8 flex items-center justify-between border-t border-slate-100">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                                </div>
                                <p class="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">Awaiting: Pak Dipo Approval</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting()}
                                class="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50 uppercase tracking-widest text-xs italic"
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
                    <div class="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 shadow-sm">
                        <h3 class="text-xl font-black text-slate-900 uppercase italic tracking-tight border-b border-slate-100 pb-4">Stage Analytics</h3>
                        <div class="space-y-6">
                            <div class="flex justify-between items-end pb-2">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Phase Budget</p>
                                <p class="text-xl font-black text-blue-600 font-mono tracking-tight leading-none">
                                    Rp {props.projectType === 'COMBAT' ? '116.050.000' : '70.000.000'}
                                </p>
                            </div>

                            <div class="space-y-3">
                                <For each={workflow}>
                                    {(t) => (
                                        <div class={`flex justify-between items-center p-4 rounded-2xl border transition-all ${currentStage() === t.id ? 'bg-blue-50 border-blue-200' : 'bg-slate-50/50 border-slate-100'}`}>
                                            <div>
                                                <p class={`text-[10px] font-black uppercase tracking-widest ${currentStage() === t.id ? 'text-blue-600' : 'text-slate-400'}`}>{t.title} {'per' in t ? `(${t.per})` : ''}</p>
                                                <p class={`text-xs font-black mt-1 ${currentStage() === t.id ? 'text-slate-800' : 'text-slate-400'}`}>
                                                    {'max' in t ? `Limit: Rp ${t.max.toLocaleString()}` : 'Budgeted Area'}
                                                </p>
                                            </div>
                                            <Show when={currentStage() > t.id}>
                                                <div class="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                </div>
                                            </Show>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-600 border border-blue-700 rounded-[32px] p-8 text-center shadow-lg shadow-blue-500/30">
                        <p class="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2 border-b border-blue-500/50 pb-2">Finance Hub</p>
                        <p class="text-sm font-black text-white leading-tight italic uppercase">Pak Dipo will specify final values during individual stage approval.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminSubmission;
