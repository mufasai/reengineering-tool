import type { Component } from 'solid-js';
import type { Site } from '../../../../../domain/entities/work-order.entity';

interface InfoTerminCardProps {
    terminNumber: number;
    type: string;
    jumlah: number;
    disetujui?: string;
    tglApprove?: string;
    site: Site;
    projectName?: string;
}

const InfoTerminCard: Component<InfoTerminCardProps> = (props) => {
    return (
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 class="text-xl font-bold text-slate-900 mb-6">Info Termin</h3>

            <div class="space-y-3">
                <div class="flex items-start">
                    <span class="text-sm text-slate-600 w-28 flex-shrink-0">Type</span>
                    <span class="text-sm font-bold text-slate-900">: {props.type}</span>
                </div>

                <div class="flex items-start">
                    <span class="text-sm text-slate-600 w-28 flex-shrink-0">Jumlah</span>
                    <span class="text-sm font-bold text-slate-900">: Rp {props.jumlah.toLocaleString('id-ID')}</span>
                </div>

                {props.disetujui && (
                    <div class="flex items-start">
                        <span class="text-sm text-slate-600 w-28 flex-shrink-0">Disetujui</span>
                        <span class="text-sm font-bold text-slate-900">: {props.disetujui}</span>
                    </div>
                )}

                {props.tglApprove && (
                    <div class="flex items-start">
                        <span class="text-sm text-slate-600 w-28 flex-shrink-0">Tgl Approve</span>
                        <span class="text-sm font-bold text-slate-900">: {props.tglApprove}</span>
                    </div>
                )}

                <div class="flex items-start">
                    <span class="text-sm text-slate-600 w-28 flex-shrink-0">Site</span>
                    <span class="text-sm font-bold text-slate-900">: {props.site.site_name}</span>
                </div>

                <div class="flex items-start">
                    <span class="text-sm text-slate-600 w-28 flex-shrink-0">Project</span>
                    <span class="text-sm font-bold text-slate-900">: {props.projectName || 'Example Project Fiber'}</span>
                </div>
            </div>
        </div>
    );
};

export default InfoTerminCard;
