import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { WorkOrder } from '../../../../domain/entities/work-order.entity';
import AgGridSolid from 'ag-grid-solid';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface WorkOrderListPageProps {
    onCreateWO: () => void;
    onCreateTechnical: () => void;
}

const WorkOrderListPage: Component<WorkOrderListPageProps> = (props) => {
    // Mock data for demonstration
    const [workOrders] = createSignal<WorkOrder[]>([
        {
            id: '1',
            contractNumber: 'CTR-2024-001',
            projectType: 'COMBAT',
            poValue: 100000000,
            budgetTotal: 70000000,
            status: 'TECHNICAL_PROCESS',
            siteList: [],
            createdAt: new Date(),
        },
        {
            id: '2',
            contractNumber: 'CTR-2024-002',
            projectType: 'L2H',
            poValue: 250000000,
            budgetTotal: 175000000,
            status: 'TERMIN_1',
            siteList: [{ id: 'S1', name: 'Site Alpha', location: 'Jakarta' }],
            createdAt: new Date(),
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'TECHNICAL_PROCESS': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'TERMIN_1': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'TERMIN_2': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const columnDefs = [
        {
            field: 'contractNumber',
            headerName: 'Contract #',
            flex: 1,
            cellRenderer: (params: any) => {
                return (
                    <div class="py-2">
                        <div class="font-bold text-white leading-tight">{params.value}</div>
                        <div class="text-[10px] text-gray-500">ID: {params.data.id}</div>
                    </div>
                );
            }
        },
        {
            field: 'projectType',
            headerName: 'Project Type',
            width: 150,
            cellRenderer: (params: any) => {
                return (
                    <div class="flex items-center h-full">
                        <span class="text-[10px] font-bold text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-tighter">
                            {params.value}
                        </span>
                    </div>
                );
            }
        },
        {
            field: 'poValue',
            headerName: 'PO Value',
            width: 180,
            valueFormatter: (params: any) => `Rp ${params.value.toLocaleString()}`,
            cellStyle: { fontVariantNumeric: 'tabular-nums' }
        },
        {
            field: 'budgetTotal',
            headerName: 'Budget (70%)',
            width: 180,
            valueFormatter: (params: any) => `Rp ${params.value.toLocaleString()}`,
            cellStyle: { color: '#60a5fa', fontVariantNumeric: 'tabular-nums', fontWeight: '600' }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 180,
            cellRenderer: (params: any) => {
                return (
                    <div class="flex items-center h-full">
                        <span class={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-tight ${getStatusColor(params.value)}`}>
                            {params.value.replace('_', ' ')}
                        </span>
                    </div>
                );
            }
        },
        {
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filter: false,
            cellRenderer: () => {
                return (
                    <div class="flex items-center justify-center h-full">
                        <button class="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                        </button>
                    </div>
                );
            }
        }
    ];

    const gridOptions = {
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true,
        },
        rowHeight: 80,
        headerHeight: 60,
    };

    return (
        <div class="space-y-8 animate-in fade-in duration-500">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-white italic">Work Orders</h1>
                    <p class="text-gray-400 mt-1">Manage technical processes and budget submissions.</p>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        onClick={() => props.onCreateTechnical()}
                        class="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-semibold transition-all border border-white/10 flex items-center gap-2 active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                        Technical Process
                    </button>
                    <button
                        onClick={() => props.onCreateWO()}
                        class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7v14" /></svg>
                        Create New WO
                    </button>
                </div>
            </header>

            {/* Stats Summary */}
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active WOs', value: '24', icon: 'M12 2v20M2 12h20' },
                    { label: 'Pending Approval', value: '5', icon: 'M12 8v4l3 3' },
                    { label: 'Total PO Value', value: 'Rp 4.2B', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
                    { label: 'Total Budget (70%)', value: 'Rp 2.9B', icon: 'M12 1v22' },
                ].map(stat => (
                    <div class="bg-white/5 border border-white/10 p-6 rounded-2xl">
                        <div class="flex items-center gap-4">
                            <div class="p-2.5 bg-blue-600/10 rounded-xl text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d={stat.icon} />
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                <p class="text-xl font-bold text-white mt-0.5">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AG Grid Section */}
            <div class="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-xl p-4">
                <div class="ag-theme-alpine-dark w-full h-[500px]" style={{
                    '--ag-background-color': 'transparent',
                    '--ag-odd-row-background-color': 'rgba(255, 255, 255, 0.02)',
                    '--ag-header-background-color': 'rgba(255, 255, 255, 0.03)',
                    '--ag-border-color': 'rgba(255, 255, 255, 0.05)',
                    '--ag-row-hover-color': 'rgba(255, 255, 255, 0.05)',
                    '--ag-selected-row-background-color': 'rgba(59, 130, 246, 0.1)',
                    '--ag-font-family': "'Poppins', sans-serif",
                    '--ag-font-size': '14px',
                }}>
                    <AgGridSolid
                        columnDefs={columnDefs}
                        rowData={workOrders()}
                        gridOptions={gridOptions}
                    />
                </div>
            </div>
        </div>
    );
};

export default WorkOrderListPage;
