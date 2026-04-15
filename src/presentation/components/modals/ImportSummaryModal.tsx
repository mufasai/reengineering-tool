import { Show, For } from 'solid-js';
import type { Component } from 'solid-js';

const clsx = (...classes: any[]) => classes.flat().filter(Boolean).join(' ');

const XIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
);

const CheckCircle2Icon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
);

const AlertCircleIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
);

interface ImportSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: {
        fileName: string;
        totalRows: number;
        sitesCreated: number;
        sitesFailed: number;
        errors: string[];
        projectName?: string;
        projectId?: string;
    };
}

const ImportSummaryModal: Component<ImportSummaryModalProps> = (props) => {
    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">
                    
                    {/* Header */}
                    <div class="px-6 py-4 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between">
                        <h2 class="text-lg font-bold text-slate-800">Import Summary</h2>
                        <button onClick={props.onClose} class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                            <XIcon class="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div class="flex-1 overflow-y-auto bg-slate-50/50 p-6">
                        <div class="space-y-6">
                            {/* Success Icon */}
                            <div class="flex flex-col items-center justify-center py-4">
                                <div class="w-16 h-16 bg-emerald-100 border-4 border-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2Icon class="w-8 h-8" />
                                </div>
                                <h3 class="text-2xl font-black text-slate-800 tracking-tight">Import Berhasil</h3>
                                <p class="text-slate-500 font-medium mt-1">{props.summary.fileName} telah diproses</p>
                            </div>

                            {/* Project Info */}
                            <Show when={props.summary.projectName}>
                                <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <h4 class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Project Created</h4>
                                    <p class="text-sm font-bold text-blue-900">{props.summary.projectName}</p>
                                    <Show when={props.summary.projectId}>
                                        <p class="text-xs text-blue-600 font-mono mt-1">ID: {props.summary.projectId}</p>
                                    </Show>
                                </div>
                            </Show>

                            {/* Stats Grid */}
                            <div class="grid grid-cols-3 gap-4">
                                <div class="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                                    <p class="text-3xl font-black text-blue-600 mb-1">{props.summary.totalRows}</p>
                                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Rows</p>
                                </div>
                                <div class="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                                    <p class="text-3xl font-black text-emerald-600 mb-1">{props.summary.sitesCreated}</p>
                                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Sites Created</p>
                                </div>
                                <div class="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                                    <p class="text-3xl font-black text-amber-500 mb-1">{props.summary.sitesFailed}</p>
                                    <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Sites Failed</p>
                                </div>
                            </div>

                            {/* Errors Section */}
                            <Show when={props.summary.errors.length > 0}>
                                <div class="bg-red-50 border border-red-100 rounded-xl p-4">
                                    <div class="flex items-start gap-3 mb-3">
                                        <AlertCircleIcon class="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 class="text-xs font-bold text-red-600 uppercase tracking-wider">Errors Detected</h4>
                                            <p class="text-xs text-red-700 mt-1">The following issues were encountered during import:</p>
                                        </div>
                                    </div>
                                    <ul class="text-xs text-red-700 space-y-1 list-disc pl-4 max-h-40 overflow-y-auto">
                                        <For each={props.summary.errors.slice(0, 10)}>
                                            {err => <li>{err}</li>}
                                        </For>
                                        <Show when={props.summary.errors.length > 10}>
                                            <li class="italic font-medium">... and {props.summary.errors.length - 10} more errors</li>
                                        </Show>
                                    </ul>
                                </div>
                            </Show>

                            {/* Success Message */}
                            <Show when={props.summary.sitesFailed === 0}>
                                <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                                    <p class="text-sm font-bold text-emerald-700">
                                        ✓ All sites imported successfully without errors
                                    </p>
                                </div>
                            </Show>
                        </div>
                    </div>

                    {/* Footer */}
                    <div class="px-6 py-4 border-t border-slate-200 bg-white shrink-0 flex justify-end">
                        <button 
                            onClick={props.onClose}
                            class="px-6 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-900 transition-colors"
                        >
                            Kembali ke Registri
                        </button>
                    </div>
                </div>
            </div>
        </Show>
    );
};

export default ImportSummaryModal;
