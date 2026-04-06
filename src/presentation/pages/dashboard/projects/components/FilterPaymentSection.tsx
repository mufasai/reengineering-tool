import { createSignal, createMemo, For, Show } from 'solid-js';
import type { Component } from 'solid-js';

interface TerminPengajuan {
    id: string;
    site_id: string;
    termin_key: 'T1' | 'T2a' | 'T2b' | 'T2c' | 'T3' | 'T4';
    nominal: number;
    catatan?: string;
    status: 'submitted' | 'approved' | 'paid' | 'rejected';
    submitted_by: string;
    submitted_at: string;
    documents?: string[];
}

interface SiteFile {
    id: string;
    filename: string;
    stage_context?: string;
}

interface FilterPaymentSectionProps {
    localStage: string;
    localPengajuan: TerminPengajuan[];
    localFiles: SiteFile[];
    onAjukan: (terminKey: 'T1' | 'T2a' | 'T2b' | 'T2c' | 'T3' | 'T4', nominal: number, contextKeys: string[]) => void;
    onApprove: (pengajuanId: string, nominal: number, terminKey: string, e: MouseEvent) => void;
    onReject: (pengajuanId: string, e: MouseEvent) => void;
}

const STAGE_TERMIN_MAP = [
    { stage: 'permit_ready', terminKey: 'T1' as const, percentage: 30, label: 'T1', contextKeys: ['permit'] },
    { stage: 'akses_ready', terminKey: 'T2a' as const, percentage: 15, label: 'T2a', contextKeys: ['akses'] },
    { stage: 'implementasi', terminKey: 'T2b' as const, percentage: 20, label: 'T2b', contextKeys: ['implementasi', 'rfi'] },
    { stage: 'rfi_done', terminKey: 'T2c' as const, percentage: 15, label: 'T2c', contextKeys: ['rfi', 'rfs'] },
    { stage: 'bast', terminKey: 'T3' as const, percentage: 10, label: 'T3', contextKeys: ['bast'] },
    { stage: 'invoice', terminKey: 'T4' as const, percentage: 10, label: 'T4', contextKeys: ['invoice'] }
];

const STAGE_ORDER_IDX = [
    'imported', 'assigned', 'permit_process', 'permit_ready', 'akses_process', 'akses_ready',
    'implementasi', 'rfi_done', 'rfs_done', 'dokumen_done', 'bast', 'invoice', 'completed'
];

const FilterPaymentSection: Component<FilterPaymentSectionProps> = (props) => {
    const [expandedHistory, setExpandedHistory] = createSignal(false);

    const getTerminStatus = (terminKey: string) => {
        const pengajuan = props.localPengajuan.find(p => p.termin_key === terminKey);
        if (!pengajuan) return 'locked';

        switch (pengajuan.status) {
            case 'paid':
                return 'paid';
            case 'approved':
                return 'approved';
            case 'submitted':
                return 'submitted';
            case 'rejected':
                return 'rejected';
            default:
                return 'ready';
        }
    };

    const isTerminUnlocked = (def: typeof STAGE_TERMIN_MAP[0]) => {
        const currentIdx = STAGE_ORDER_IDX.indexOf(props.localStage);
        const terminIdx = STAGE_ORDER_IDX.indexOf(def.stage);
        return currentIdx >= terminIdx;
    };

    const getTerminIcon = (status: string) => {
        switch (status) {
            case 'paid':
                return '✓';
            case 'approved':
            case 'submitted':
                return '●';
            case 'ready':
                return '⚡';
            default:
                return '🔒';
        }
    };

    const getTerminColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'text-emerald-500';
            case 'approved':
            case 'submitted':
                return 'text-blue-500';
            case 'ready':
                return 'text-amber-500';
            default:
                return 'text-slate-400';
        }
    };

    // Calculate progress percentage
    const progressPercentage = createMemo(() => {
        let total = 0;
        STAGE_TERMIN_MAP.forEach(def => {
            const status = getTerminStatus(def.terminKey);
            if (status === 'paid') {
                total += def.percentage;
            }
        });
        return total;
    });

    return (
        <div class="space-y-6">
            {/* Filter Payment Terms Progress */}
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div class="flex items-center gap-2 mb-6">
                    <div class="p-2 bg-emerald-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800">FILTER PAYMENT TERMS</h3>
                        <p class="text-xs text-slate-500">Sequential Payment Flow</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div class="relative mb-8">
                    {/* Background line */}
                    <div class="absolute top-6 left-0 right-0 h-0.5 bg-slate-200" />

                    {/* Progress line */}
                    <div
                        class="absolute top-6 left-0 h-0.5 bg-blue-500 transition-all duration-500"
                        style={{ width: `${progressPercentage()}%` }}
                    />

                    {/* Termin nodes */}
                    <div class="relative flex justify-between">
                        <For each={STAGE_TERMIN_MAP}>
                            {(def) => {
                                const status = getTerminStatus(def.terminKey);
                                const unlocked = isTerminUnlocked(def);
                                const pengajuan = props.localPengajuan.find(p => p.termin_key === def.terminKey);

                                return (
                                    <div class="flex flex-col items-center">
                                        {/* Node circle */}
                                        <div
                                            class={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-all ${status === 'paid' ? 'bg-emerald-500 border-emerald-500 text-white' :
                                                    status === 'approved' || status === 'submitted' ? 'bg-blue-50 border-blue-500 text-blue-600' :
                                                        status === 'ready' ? 'bg-amber-50 border-amber-500 text-amber-600' :
                                                            'bg-slate-50 border-slate-300 text-slate-400'
                                                }`}
                                        >
                                            <span class={getTerminColor(status)}>{getTerminIcon(status)}</span>
                                        </div>

                                        {/* Label */}
                                        <span class="text-xs font-bold text-slate-700 mt-2">{def.label}</span>
                                        <span class="text-[10px] text-slate-500">{def.percentage}%</span>
                                    </div>
                                );
                            }}
                        </For>
                    </div>
                </div>

                {/* Current Termin Info */}
                <Show when={STAGE_TERMIN_MAP.find(def => {
                    const unlocked = isTerminUnlocked(def);
                    const status = getTerminStatus(def.terminKey);
                    return unlocked && status === 'ready';
                })}>
                    {(currentDef) => {
                        const def = currentDef();
                        const pengajuan = props.localPengajuan.find(p => p.termin_key === def.terminKey);

                        return (
                            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <h4 class="font-bold text-blue-900 mb-1">
                                            {def.label} ({def.percentage}%)
                                        </h4>
                                        <p class="text-sm text-blue-700 mb-2">
                                            Permit sudah ready
                                        </p>
                                        <p class="text-xs text-blue-600">
                                            Diajukan 5 Mar 2024 • Rp 48.000.000 — Permit sudah turun sesuai standar operasional
                                        </p>
                                        <div class="flex gap-2 mt-3 text-xs">
                                            <span class="px-2 py-1 bg-white/60 rounded border border-blue-200 text-blue-700">
                                                📋 Terlampir
                                            </span>
                                            <span class="px-2 py-1 bg-white/60 rounded border border-blue-200 text-blue-700">
                                                📄 Siap Diajukan
                                            </span>
                                            <span class="px-2 py-1 bg-white/60 rounded border border-blue-200 text-blue-700">
                                                ✅ Selesai
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex gap-2">
                                        <button
                                            onClick={() => props.onAjukan(def.terminKey, 0, def.contextKeys)}
                                            class="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                        >
                                            ✓ Setujui
                                        </button>
                                        <button class="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                                            ✗ Tolak
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </Show>
            </div>

            {/* Riwayat Pengajuan */}
            <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                    onClick={() => setExpandedHistory(!expandedHistory())}
                    class="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                    <h3 class="font-bold text-slate-800">Riwayat Pengajuan</h3>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-slate-500">{props.localPengajuan.length} record</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class={`w-5 h-5 text-slate-400 transition-transform ${expandedHistory() ? 'rotate-180' : ''}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </div>
                </button>

                <Show when={expandedHistory()}>
                    <div class="border-t border-slate-200">
                        <For each={props.localPengajuan}>
                            {(pengajuan) => (
                                <div class="p-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-4">
                                            <div class="flex items-center gap-2">
                                                <span class="font-mono font-bold text-slate-800">{pengajuan.termin_key}</span>
                                            </div>
                                            <div>
                                                <p class="text-sm font-semibold text-slate-800">
                                                    Rp {pengajuan.nominal.toLocaleString('id-ID')}
                                                </p>
                                                <p class="text-xs text-slate-500">
                                                    Diajukan {new Date(pengajuan.submitted_at).toLocaleDateString('id-ID')} — {pengajuan.catatan || 'Permit sudah turun sesuai standar operasional'}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <Show when={pengajuan.status === 'submitted'}>
                                                <button
                                                    onClick={(e) => props.onApprove(pengajuan.id, pengajuan.nominal, pengajuan.termin_key, e)}
                                                    class="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded hover:bg-emerald-700 transition-colors"
                                                >
                                                    ✓ Approve
                                                </button>
                                                <button
                                                    onClick={(e) => props.onReject(pengajuan.id, e)}
                                                    class="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition-colors"
                                                >
                                                    ✗ Tolak
                                                </button>
                                            </Show>
                                            <Show when={pengajuan.status === 'approved'}>
                                                <span class="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded border border-emerald-200">
                                                    Approved
                                                </span>
                                            </Show>
                                            <Show when={pengajuan.status === 'paid'}>
                                                <span class="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded border border-green-200">
                                                    Paid
                                                </span>
                                            </Show>
                                            <Show when={pengajuan.status === 'rejected'}>
                                                <span class="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded border border-red-200">
                                                    Rejected
                                                </span>
                                            </Show>
                                            <button class="p-2 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="7 10 12 15 17 10" />
                                                    <line x1="12" x2="12" y1="15" y2="3" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </For>
                        <Show when={props.localPengajuan.length === 0}>
                            <div class="p-8 text-center text-slate-500">
                                Belum ada pengajuan termin
                            </div>
                        </Show>
                    </div>
                </Show>
            </div>
        </div>
    );
};

export default FilterPaymentSection;
