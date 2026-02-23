import { createSignal, createMemo, Show, createResource } from 'solid-js';
import type { Component } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import { authStore } from '../../../store/auth.store';
import CreateProjectForm from './components/CreateProjectForm';
import { projectRepository } from '../../../../infrastructure/repositories/project.repository.impl';
import type { Project } from '../../../../domain/entities/project.entity';

const ProjectListPage: Component = () => {
    const { user } = authStore;
    const [searchTerm, setSearchTerm] = createSignal('');
    const [statusFilter, setStatusFilter] = createSignal('');
    const [showModal, setShowModal] = createSignal(false);
    const [submitting, setSubmitting] = createSignal(false);

    // Fetch projects from API
    const [projectsResource, { refetch }] = createResource(async () => {
        try {
            return await projectRepository.findAll();
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            return [];
        }
    });

    const projects = () => projectsResource() || [];

    const filteredData = createMemo(() => {
        const currentUser = user();
        if (!currentUser) return [];

        let baseProjects = projects();

        // RBAC logic
        if (currentUser.role === 'engineer') {
            return [];
        }

        // Search & Status filtering
        return baseProjects.filter((p: Project) => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm().toLowerCase()) ||
                p.tipe.toLowerCase().includes(searchTerm().toLowerCase());
            const matchesStatus = statusFilter() ? p.status === statusFilter() : true;
            return matchesSearch && matchesStatus;
        });
    });

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-slate-50 text-slate-400 border-slate-100';
        }
    };

    const getTypeStyles = (type: string) => {
        switch (type.toUpperCase()) {
            case 'COMBAT': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'FILTER': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'BLACK SITE': return 'bg-red-50 text-red-600 border-red-100';
            case 'L2H': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        }
    };

    const columnDefs = [
        {
            field: 'name',
            headerName: 'Project Name',
            flex: 2,
            minWidth: 250,
            cellRenderer: (params: any) => (
                <div class="flex flex-col justify-center h-full text-sm">
                    <span class="text-blue-600 hover:underline cursor-pointer">
                        {params.value}
                    </span>
                    <span class="text-[10px] text-slate-400 uppercase tracking-widest">
                        {params.data.keterangan?.substring(0, 40)}...
                    </span>
                </div>
            )
        },
        {
            field: 'lokasi',
            headerName: 'Location',
            width: 150,
            cellClass: 'text-slate-500'
        },
        {
            field: 'value',
            headerName: 'Value',
            width: 150,
            cellClass: 'text-slate-700',
            valueFormatter: (params: any) => params.value ? `Rp ${params.value.toLocaleString('id-ID')}` : '-'
        },
        {
            field: 'cost',
            headerName: 'Cost',
            width: 150,
            cellClass: 'text-slate-700',
            valueFormatter: (params: any) => params.value ? `Rp ${params.value.toLocaleString('id-ID')}` : 'Rp 0'
        },
        {
            field: 'tipe',
            headerName: 'Type',
            width: 120,
            cellRenderer: (params: any) => (
                <div class="flex items-center h-full">
                    <span class={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wide border ${getTypeStyles(params.value)}`}>
                        {params.value}
                    </span>
                </div>
            )
        },
        {
            field: 'tgi_start',
            headerName: 'Start Date',
            width: 130,
            cellClass: 'text-slate-500 text-xs'
        },
        {
            field: 'tgi_end',
            headerName: 'End Date',
            width: 130,
            cellClass: 'text-slate-500 text-xs'
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 130,
            cellRenderer: (params: any) => (
                <div class="flex items-center h-full">
                    <span class={`px-3 py-1 rounded-full border text-[10px] uppercase tracking-tight flex items-center gap-1.5 ${getStatusStyles(params.value)}`}>
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {params.value}
                    </span>
                </div>
            )
        },
        {
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filter: false,
            cellRenderer: () => (
                <div class="flex items-center gap-2 h-full">
                    <button class="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>
                    <button class="p-2 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                    </button>
                </div>
            )
        }
    ];

    const handleCreateProject = async (data: any) => {
        setSubmitting(true);
        try {
            await projectRepository.create(data);
            await refetch();
            setShowModal(false);
        } catch (error) {
            console.error('Failed to create project:', error);
            alert('Gagal membuat project: ' + (error as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div class="space-y-8 animate-in fade-in duration-500">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 class="text-4xl font-bold tracking-tight text-slate-900 font-display">All Projects</h1>
                    <p class="text-slate-500 mt-2 font-normal">Manage and monitor all reengineering projects.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95 translate-y-0 hover:translate-y-[-2px]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7v14" /></svg>
                    New Project
                </button>
            </header>

            <div class="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm p-8 space-y-6">
                <div class="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div class="flex flex-1 gap-4 w-full lg:w-auto">
                        <div class="flex-1 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                            <input
                                type="text"
                                placeholder="Cari project..."
                                class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-normal text-slate-800 transition-all"
                                value={searchTerm()}
                                onInput={(e) => setSearchTerm(e.currentTarget.value)}
                            />
                        </div>
                        <select
                            class="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-slate-600 transition-all uppercase text-[10px] tracking-widest min-w-[140px]"
                            value={statusFilter()}
                            onChange={(e) => setStatusFilter(e.currentTarget.value)}
                        >
                            <option value="">All Status</option>
                            <option value="TECHNICAL_PROCESS">Active</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    <div class="flex items-center gap-3 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                        {/* Date Range Picker (Mock) */}
                        <div class="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-500 text-[10px] tracking-widest uppercase whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                            <span>Tgl Start</span>
                            <span class="text-slate-300">—</span>
                            <span>Tgl End</span>
                        </div>

                        {/* Export Buttons */}
                        <div class="flex items-center gap-2">
                            {[
                                { icon: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z', label: 'Copy' },
                                { icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8', label: 'CSV' },
                                { icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3', label: 'Excel' },
                                { icon: 'M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z', label: 'Print' }
                            ].map(item => (
                                <button
                                    title={item.label}
                                    class="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d={item.icon} />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div class="ag-theme-alpine w-full h-[600px]" style={{
                    '--ag-background-color': 'transparent',
                    '--ag-odd-row-background-color': '#f8fafc',
                    '--ag-header-background-color': '#ffffff',
                    '--ag-border-color': '#f1f5f9',
                    '--ag-row-hover-color': '#eff6ff',
                    '--ag-selected-row-background-color': '#dbeafe',
                    '--ag-font-family': "'Poppins', sans-serif",
                    '--ag-font-size': '14px',
                    '--ag-header-foreground-color': '#64748b',
                    '--ag-header-font-weight': '400',
                    '--ag-header-cell-hover-background-color': '#f8fafc',
                }}>
                    <AgGridSolid
                        columnDefs={columnDefs}
                        rowData={filteredData()}
                        defaultColDef={{
                            sortable: true,
                            filter: true,
                            resizable: true,
                        }}
                        rowHeight={80}
                        headerHeight={60}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                    />
                </div>
            </div>

            {/* Create Project Modal */}
            <Show when={showModal()}>
                <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div class="bg-white border border-slate-200 w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl scale-in-center overflow-hidden flex flex-col">
                        <header class="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div>
                                <h2 class="text-3xl font-black text-blue-600 italic tracking-tight uppercase">Create Project</h2>
                                <p class="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-[0.2em]">Project • Sites</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                class="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center border border-slate-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                            </button>
                        </header>

                        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <CreateProjectForm
                                onSave={handleCreateProject}
                                onCancel={() => setShowModal(false)}
                                submitting={submitting()}
                            />
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default ProjectListPage;
