import { createMemo, For } from 'solid-js';
import type { Component } from 'solid-js';

const clsx = (...classes: any[]) => classes.flat().filter(Boolean).join(' ');

interface FilterFlowProps {
    sites: any[];
}

const FILTER_STAGES = [
    { id: 'assigned', label: 'ASSIGNED', color: 'text-slate-600', bgColor: 'bg-slate-100', borderColor: 'border-slate-300' },
    { id: 'permit', label: 'PERMIT', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-300' },
    { id: 'wait', label: 'WAIT', color: 'text-slate-600', bgColor: 'bg-slate-100', borderColor: 'border-slate-300' },
    { id: 'rfi', label: 'RFI', color: 'text-slate-600', bgColor: 'bg-slate-100', borderColor: 'border-slate-300' },
    { id: 'bast', label: 'BAST', color: 'text-slate-600', bgColor: 'bg-slate-100', borderColor: 'border-slate-300' },
    { id: 'invoice', label: 'INVOICE', color: 'text-slate-600', bgColor: 'bg-slate-100', borderColor: 'border-slate-300' },
    { id: 'selesai', label: 'SELESAI', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-400' }
];

const FilterFlow: Component<FilterFlowProps> = (props) => {
    const stageCounts = createMemo(() => {
        const counts: Record<string, number> = {
            assigned: 0,
            permit: 0,
            wait: 0,
            rfi: 0,
            bast: 0,
            invoice: 0,
            selesai: 0
        };

        props.sites.forEach((site: any) => {
            const stage = site.stage;
            
            // Map stages to flow categories
            if (stage === 'assigned') counts.assigned++;
            else if (stage === 'permit_process' || stage === 'permit_ready') counts.permit++;
            else if (stage === 'wait' || stage === 'akses_process' || stage === 'akses_ready') counts.wait++;
            else if (stage === 'rfi_done' || stage === 'implementasi') counts.rfi++;
            else if (stage === 'bast' || stage === 'dokumen_done') counts.bast++;
            else if (stage === 'invoice') counts.invoice++;
            else if (stage === 'completed') counts.selesai++;
        });

        return counts;
    });

    const totalSites = createMemo(() => props.sites.length);
    const totalAssigned = createMemo(() => totalSites() - stageCounts().assigned);
    const totalPending = createMemo(() => {
        return stageCounts().permit + stageCounts().wait + stageCounts().rfi + stageCounts().bast + stageCounts().invoice;
    });

    return (
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center justify-between">
                {/* Flow Stages */}
                <div class="flex items-center gap-0">
                    <For each={FILTER_STAGES}>
                        {(stage, index) => {
                            const count = stageCounts()[stage.id];
                            const isLast = index() === FILTER_STAGES.length - 1;
                            const isActive = count > 0;

                            return (
                                <>
                                    <div class={clsx(
                                        'flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all',
                                        isActive ? `${stage.bgColor} ${stage.borderColor}` : 'bg-slate-50 border-slate-200'
                                    )}>
                                        <span class={clsx(
                                            'text-[10px] font-bold uppercase tracking-wide',
                                            isActive ? stage.color : 'text-slate-400'
                                        )}>
                                            {stage.label}
                                        </span>
                                        <span class={clsx(
                                            'text-sm font-black',
                                            isActive ? stage.color : 'text-slate-400'
                                        )}>
                                            {count}
                                        </span>
                                    </div>
                                    {!isLast && (
                                        <div class="w-6 h-px bg-slate-300"></div>
                                    )}
                                </>
                            );
                        }}
                    </For>
                </div>

                {/* Summary Stats */}
                <div class="flex items-center gap-6 text-xs text-slate-500">
                    <span><strong class="text-slate-700">{totalSites()}</strong> sites total</span>
                    <span><strong class="text-slate-700">{totalAssigned()}</strong> assigned</span>
                    <span><strong class="text-slate-700">{totalPending()}</strong> menunggu/persetujuan termin</span>
                </div>
            </div>
        </div>
    );
};

export default FilterFlow;
