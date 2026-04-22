import { Show, For } from 'solid-js';
import type { Component } from 'solid-js';

interface ImportResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: {
        success: boolean;
        message: string;
        imported_count: number;
        failed_count: number;
        errors?: string[];
    } | null;
}

const CheckCircleIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const XCircleIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6" />
        <path d="M9 9l6 6" />
    </svg>
);

const AlertTriangleIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const XIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18" />
        <path d="M6 6l12 12" />
    </svg>
);

const ImportResultModal: Component<ImportResultModalProps> = (props) => {
    const getStatusIcon = () => {
        if (!props.result) return null;

        if (props.result.success && props.result.failed_count === 0) {
            return <CheckCircleIcon class="w-12 h-12 text-green-600" />;
        } else if (props.result.success && props.result.failed_count > 0) {
            return <AlertTriangleIcon class="w-12 h-12 text-yellow-600" />;
        } else {
            return <XCircleIcon class="w-12 h-12 text-red-600" />;
        }
    };

    const getStatusStyles = () => {
        if (!props.result) return {
            cardClass: 'bg-slate-50 border-slate-200',
            textClass: 'text-slate-700',
            buttonClass: 'bg-slate-600 hover:bg-slate-700'
        };

        if (props.result.success && props.result.failed_count === 0) {
            return {
                cardClass: 'bg-green-50 border-green-200',
                textClass: 'text-green-700',
                buttonClass: 'bg-green-600 hover:bg-green-700'
            };
        } else if (props.result.success && props.result.failed_count > 0) {
            return {
                cardClass: 'bg-yellow-50 border-yellow-200',
                textClass: 'text-yellow-700',
                buttonClass: 'bg-yellow-600 hover:bg-yellow-700'
            };
        } else {
            return {
                cardClass: 'bg-red-50 border-red-200',
                textClass: 'text-red-700',
                buttonClass: 'bg-red-600 hover:bg-red-700'
            };
        }
    };

    const getTitle = () => {
        if (!props.result) return 'Import Result';

        if (props.result.success && props.result.failed_count === 0) {
            return 'Import Berhasil!';
        } else if (props.result.success && props.result.failed_count > 0) {
            return 'Import Selesai dengan Peringatan';
        } else {
            return 'Import Gagal';
        }
    };

    return (
        <Show when={props.isOpen && props.result}>
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
                    {/* Header */}
                    <div class="flex items-center justify-between p-6 border-b border-slate-200">
                        <h3 class="text-lg font-bold text-slate-800">Hasil Import</h3>
                        <button
                            onClick={props.onClose}
                            class="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <XIcon class="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div class="p-6">
                        {/* Status Icon and Title */}
                        <div class="text-center mb-6">
                            <div class="flex justify-center mb-4">
                                {getStatusIcon()}
                            </div>
                            <h4 class="text-xl font-bold text-slate-800 mb-2">
                                {getTitle()}
                            </h4>
                            <p class="text-slate-600">
                                {props.result?.message}
                            </p>
                        </div>

                        {/* Statistics */}
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class={`${getStatusStyles().cardClass} border rounded-lg p-4 text-center`}>
                                <div class={`text-2xl font-bold ${getStatusStyles().textClass}`}>
                                    {props.result?.imported_count || 0}
                                </div>
                                <div class={`text-sm ${getStatusStyles().textClass}`}>
                                    Berhasil
                                </div>
                            </div>
                            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                                <div class="text-2xl font-bold text-slate-700">
                                    {props.result?.failed_count || 0}
                                </div>
                                <div class="text-sm text-slate-600">
                                    Gagal
                                </div>
                            </div>
                        </div>

                        {/* Error Details */}
                        <Show when={props.result?.errors && props.result.errors.length > 0}>
                            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h5 class="font-medium text-red-800 mb-2">Detail Error:</h5>
                                <ul class="text-sm text-red-700 space-y-1">
                                    <For each={props.result?.errors}>
                                        {(error) => (
                                            <li class="flex items-start gap-2">
                                                <span class="text-red-500 mt-0.5">•</span>
                                                <span>{error}</span>
                                            </li>
                                        )}
                                    </For>
                                </ul>
                            </div>
                        </Show>
                    </div>

                    {/* Footer */}
                    <div class="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                        <button
                            onClick={props.onClose}
                            class={`px-4 py-2 ${getStatusStyles().buttonClass} text-white font-medium rounded-lg transition-colors`}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </Show>
    );
};

export default ImportResultModal;