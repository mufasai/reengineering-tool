import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';

// Icons
const XIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>;
const AlertCircleIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>;
const CheckCircleIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const InfoIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="16" y2="12" /><line x1="12" x2="12.01" y1="8" y2="8" /></svg>;

interface AlertModalProps {
    isOpen: boolean;
    type?: 'error' | 'success' | 'info' | 'warning';
    title?: string;
    message: string;
    onClose: () => void;
    confirmText?: string;
}

const AlertModal: Component<AlertModalProps> = (props) => {
    const type = () => props.type || 'error';
    const title = () => props.title || (type() === 'error' ? 'Error' : type() === 'success' ? 'Success' : type() === 'warning' ? 'Warning' : 'Information');
    const confirmText = () => props.confirmText || 'OK';

    const getIcon = () => {
        switch (type()) {
            case 'success':
                return <CheckCircleIcon class="w-full h-full" />;
            case 'info':
                return <InfoIcon class="w-full h-full" />;
            case 'warning':
                return <AlertCircleIcon class="w-full h-full" />;
            default:
                return <AlertCircleIcon class="w-full h-full" />;
        }
    };

    const getColors = () => {
        switch (type()) {
            case 'success':
                return {
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                    icon: 'text-emerald-600',
                    iconBg: 'bg-emerald-100',
                    button: 'bg-emerald-600 hover:bg-emerald-700'
                };
            case 'info':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    icon: 'text-blue-600',
                    iconBg: 'bg-blue-100',
                    button: 'bg-blue-600 hover:bg-blue-700'
                };
            case 'warning':
                return {
                    bg: 'bg-amber-50',
                    border: 'border-amber-200',
                    icon: 'text-amber-600',
                    iconBg: 'bg-amber-100',
                    button: 'bg-amber-600 hover:bg-amber-700'
                };
            default:
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    icon: 'text-red-600',
                    iconBg: 'bg-red-100',
                    button: 'bg-red-600 hover:bg-red-700'
                };
        }
    };

    const colors = () => getColors();

    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div class={`px-6 py-4 border-b ${colors().border} ${colors().bg} flex items-center justify-between`}>
                        <div class="flex items-center gap-3">
                            <div class={`w-10 h-10 rounded-full ${colors().iconBg} flex items-center justify-center ${colors().icon}`}>
                                {getIcon()}
                            </div>
                            <h2 class="text-lg font-bold text-slate-900">{title()}</h2>
                        </div>
                        <button
                            onClick={props.onClose}
                            class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-all"
                        >
                            <XIcon class="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div class="p-6">
                        <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{props.message}</p>
                    </div>

                    {/* Footer */}
                    <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={props.onClose}
                            class={`px-6 py-2.5 ${colors().button} text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md`}
                        >
                            {confirmText()}
                        </button>
                    </div>
                </div>
            </div>
        </Show>
    );
};

export default AlertModal;
