import { createSignal, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { Team } from '../../../../domain/entities/team.entity';
import { teamRepository } from '../../../../infrastructure/repositories/team.repository.impl';
import { GetTeamsInteractor } from '../../../../application/use-cases/get-teams.use-case';
import { UploadTeamsInteractor } from '../../../../application/use-cases/upload-teams.use-case';

const getTeamsUseCase = new GetTeamsInteractor(teamRepository);
const uploadTeamsUseCase = new UploadTeamsInteractor(teamRepository);

const TeamsPage: Component = () => {
    const [teams, setTeams] = createSignal<Team[]>([]);
    const [loading, setLoading] = createSignal(false);
    const [uploading, setUploading] = createSignal(false);
    const [showUploadModal, setShowUploadModal] = createSignal(false);
    const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
    const [uploadResult, setUploadResult] = createSignal<string>('');

    const loadTeams = async () => {
        try {
            setLoading(true);
            const teamsData = await getTeamsUseCase.execute();
            setTeams(teamsData);
        } catch (error) {
            console.error('Failed to load teams:', error);
        } finally {
            setLoading(false);
        }
    };

    onMount(() => {
        loadTeams();
    });

    const handleFileSelect = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            setSelectedFile(input.files[0]);
        }
    };

    const handleUpload = async () => {
        const file = selectedFile();
        if (!file) {
            alert('Please select a file');
            return;
        }

        try {
            setUploading(true);
            const response = await uploadTeamsUseCase.execute({ file });

            setUploadResult(`${response.message}\nTotal: ${response.data.total_rows}, Success: ${response.data.success_count}, Failed: ${response.data.failed_count}`);

            // Reload teams after successful upload
            await loadTeams();

            // Reset form
            setSelectedFile(null);

            // Close modal after 2 seconds
            setTimeout(() => {
                setShowUploadModal(false);
                setUploadResult('');
            }, 2000);
        } catch (error: any) {
            console.error('Failed to upload teams:', error);
            setUploadResult(`Error: ${error.message || 'Upload failed'}`);
        } finally {
            setUploading(false);
        }
    };

    const columnDefs: ColDef[] = [
        {
            headerName: 'No',
            width: 70,
            valueGetter: (params) => {
                return params.node?.rowIndex != null ? params.node.rowIndex + 1 : 0;
            }
        },
        { field: 'nik', headerName: 'NIK', width: 120 },
        { field: 'nama_karyawan', headerName: 'Nama', flex: 1, minWidth: 200 },
        { field: 'jabatan_kerja', headerName: 'Jabatan', flex: 1, minWidth: 150 },
        { field: 'regional', headerName: 'Regional', width: 120 },
        { field: 'no_hp', headerName: 'No HP', width: 140 },
        { field: 'alamat_email', headerName: 'Email', flex: 1, minWidth: 200 },
        {
            field: 'tanggal_lahir',
            headerName: 'Tanggal Lahir',
            width: 130,
            valueFormatter: (params) => {
                if (!params.value) return '';
                const date = new Date(params.value);
                return date.toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            }
        },
        { field: 'tempat_lahir', headerName: 'Tempat Lahir', width: 130 },
        { field: 'jenis_kelamin', headerName: 'Jenis Kelamin', width: 130 },
        { field: 'agama', headerName: 'Agama', width: 100 },
        {
            field: 'active',
            headerName: 'Status',
            width: 100,
            cellRenderer: (params: any) => {
                const isActive = params.value;
                const badge = document.createElement('span');
                badge.className = `px-2 py-1 rounded text-xs font-semibold ${isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`;
                badge.textContent = isActive ? 'Active' : 'Inactive';
                return badge;
            }
        },
    ];

    return (
        <div class="space-y-6 pb-16">
            {/* Header */}
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Teams</h1>
                    <p class="text-slate-500 mt-2">Manage team members and their information</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload Teams
                </button>
            </div>

            {/* Teams Table */}
            <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div class="p-4 border-b border-slate-200">
                    <h3 class="text-lg font-bold text-slate-900">Team Members ({teams().length})</h3>
                </div>
                <Show
                    when={!loading()}
                    fallback={
                        <div class="p-8 text-center text-slate-500">Loading teams...</div>
                    }
                >
                    <div class="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
                        <AgGridSolid
                            columnDefs={columnDefs}
                            rowData={teams()}
                            pagination={true}
                            paginationPageSize={20}
                            paginationPageSizeSelector={[10, 20, 50, 100]}
                        />
                    </div>
                </Show>
            </div>

            {/* Upload Modal */}
            <Show when={showUploadModal()}>
                <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div class="p-6 border-b border-slate-200">
                            <h2 class="text-xl font-bold text-slate-900">Upload Teams</h2>
                            <p class="text-sm text-slate-500 mt-1">Upload Excel file with team members data</p>
                        </div>

                        <div class="p-6 space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-2">
                                    Select Excel File
                                </label>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileSelect}
                                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Show when={selectedFile()}>
                                    <p class="text-sm text-slate-600 mt-2">
                                        Selected: {selectedFile()?.name}
                                    </p>
                                </Show>
                            </div>

                            <Show when={uploadResult()}>
                                <div class={`p-4 rounded-lg ${uploadResult().includes('Error') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                    <p class="text-sm whitespace-pre-line">{uploadResult()}</p>
                                </div>
                            </Show>
                        </div>

                        <div class="p-6 border-t border-slate-200 flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setUploadResult('');
                                }}
                                disabled={uploading()}
                                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile() || uploading()}
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Show when={uploading()}>
                                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </Show>
                                {uploading() ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default TeamsPage;
