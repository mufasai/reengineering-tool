import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import type { WorkOrder } from '../../../../domain/entities/work-order.entity';
import AgGridSolid from 'ag-grid-solid';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface WorkOrderListPageProps {
    onCreateWO: () => void;
}

const WorkOrderListPage: Component<WorkOrderListPageProps> = (props) => {
    // Mock data for demonstration
    const [workOrders] = createSignal<WorkOrder[]>([
        {
            id: '1',
            projectName: 'Project Alpha',
            lokasi: 'Jakarta',
            budget: 70000000,
            projectType: 'COMBAT',
            status: 'TECHNICAL_PROCESS',
            woNumber: 'WO-2024-001',
            contractNumber: 'CTR-2024-001',
            keterangan: 'New site installation',
            poValue: 100000000,
            budgetTotal: 70000000,
            periodStart: new Date(),
            periodEnd: new Date(),
            siteList: [],
            files: [],
            siteProjects: [],
            createdAt: new Date(),
        },
        {
            id: '2',
            projectName: 'Project Beta',
            lokasi: 'Surabaya',
            budget: 175000000,
            projectType: 'L2H',
            status: 'TERMIN_1',
            woNumber: 'WO-2024-002',
            contractNumber: 'CTR-2024-002',
            keterangan: 'Maintenance work',
            poValue: 250000000,
            budgetTotal: 175000000,
            periodStart: new Date(),
            periodEnd: new Date(),
            siteList: [{ id: 'S1', name: 'Site Alpha', location: 'Jakarta' } as any],
            files: [],
            siteProjects: [],
            createdAt: new Date(),
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'TECHNICAL_PROCESS': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'TERMIN_1': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'TERMIN_2': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const columnDefs = [
        {
            field: 'projectName',
            headerName: 'Project Name',
            flex: 1.5,
            cellRenderer: (params: any) => {
                return (
                    <div class="py-2">
                        <div class="font-bold text-slate-800 leading-tight">{params.value}</div>
                        <div class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">ID: {params.data.id}</div>
                    </div>
                );
            }
        },
        {
            field: 'lokasi',
            headerName: 'Location',
            flex: 1,
            cellRenderer: (params: any) => {
                return (
                    <div class="flex items-center h-full">
                        <span class="text-xs font-semibold text-slate-600">
                            {params.value}
                        </span>
                    </div>
                );
            }
        },
        {
            field: 'projectType',
            headerName: 'Type',
            width: 130,
            cellRenderer: (params: any) => {
                return (
                    <div class="flex items-center h-full">
                        <span class="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-tighter">
                            {params.value}
                        </span>
                    </div>
                );
            }
        },
        {
            field: 'budget',
            headerName: 'Budget',
            width: 180,
            valueFormatter: (params: any) => `Rp ${params.value.toLocaleString()}`,
            cellStyle: { fontVariantNumeric: 'tabular-nums', color: '#2563eb', fontWeight: 'bold' }
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
                        <button class="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-slate-50">
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
                    <h1 class="text-3xl font-black tracking-tight text-slate-900 font-display italic uppercase leading-none">Work Orders</h1>
                    <p class="text-slate-500 mt-2 font-medium">Manage technical processes and budget submissions.</p>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        onClick={() => props.onCreateWO()}
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95 translate-y-0 hover:translate-y-[-2px]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7v14" /></svg>
                        Create New Project
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
                    <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <div class="flex items-center gap-4">
                            <div class="p-2.5 bg-blue-50 rounded-xl text-blue-600 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d={stat.icon} />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                                <p class="text-xl font-bold text-slate-800 mt-1.5">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AG Grid Section */}
            <div class="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm p-4">
                <div class="ag-theme-alpine w-full h-[500px]" style={{
                    '--ag-background-color': 'transparent',
                    '--ag-odd-row-background-color': '#f8fafc',
                    '--ag-header-background-color': '#ffffff',
                    '--ag-border-color': '#f1f5f9',
                    '--ag-row-hover-color': '#eff6ff',
                    '--ag-selected-row-background-color': '#dbeafe',
                    '--ag-font-family': "'Plus Jakarta Sans', sans-serif",
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
