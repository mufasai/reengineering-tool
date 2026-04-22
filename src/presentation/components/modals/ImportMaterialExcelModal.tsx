import { createSignal, Show, For } from 'solid-js';
import type { Component } from 'solid-js';
import { useProjects } from '../../hooks/useProjects';

interface ImportMaterialExcelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (file: File, projectId: string) => Promise<void>;
}

const UploadIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const FileIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const XIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18" />
        <path d="M6 6l12 12" />
    </svg>
);

const DownloadIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-15" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

// Mock projects data - replace with actual API call
// const mockProjects = [
//     { id: '1', name: 'Project Alpha' },
//     { id: '2', name: 'Project Beta' },
//     { id: '3', name: 'Project Gamma' }
// ];

const ImportMaterialExcelModal: Component<ImportMaterialExcelModalProps> = (props) => {
    const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
    const [selectedProjectId, setSelectedProjectId] = createSignal('');
    const [isUploading, setIsUploading] = createSignal(false);
    const [dragActive, setDragActive] = createSignal(false);

    // Use projects hook
    const { projects, loading: projectsLoading } = useProjects();

    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert('File harus berformat Excel (.xlsx atau .xls)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('Ukuran file maksimal 10MB');
            return;
        }

        setSelectedFile(file);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleFileInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleImport = async () => {
        const file = selectedFile();
        const projectId = selectedProjectId();

        if (!file || !projectId) {
            alert('Pilih file Excel dan project terlebih dahulu');
            return;
        }

        setIsUploading(true);
        try {
            await props.onImport(file, projectId);
            // Reset form
            setSelectedFile(null);
            setSelectedProjectId('');
            props.onClose();
        } catch (error) {
            console.error('Import failed:', error);
            alert('Import gagal. Silakan coba lagi.');
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        // Create a simple CSV template
        const headers = [
            'kode_material',
            'nama_material',
            'kategori',
            'spesifikasi',
            'satuan',
            'harga_satuan'
        ];

        const sampleData = [
            'MT-001,Semen Portland,Sipil,50kg,ZAK,65000',
            'MT-002,Besi Beton D13,Sipil,Ulir 12m,Btg,115000'
        ];

        const csvContent = [headers.join(','), ...sampleData].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'template_material_master.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
                    {/* Header */}
                    <div class="flex items-center justify-between p-6 border-b border-slate-200">
                        <div>
                            <h3 class="text-lg font-bold text-slate-800">Import Material Excel</h3>
                            <p class="text-sm text-slate-500 mt-1">Upload file Excel untuk menambah material master</p>
                        </div>
                        <button
                            onClick={props.onClose}
                            class="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <XIcon class="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div class="p-6 space-y-6">


                        {/* Project Selection */}
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">
                                Pilih Project <span class="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedProjectId()}
                                onChange={(e) => setSelectedProjectId(e.currentTarget.value)}
                                class="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Pilih project...</option>
                                <Show when={!projectsLoading()} fallback={<option>Loading...</option>}>
                                    <For each={projects()}>
                                        {(project) => (
                                            <option value={project.id}>{project.name}</option>
                                        )}
                                    </For>
                                </Show>
                            </select>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">
                                Upload File Excel <span class="text-red-500">*</span>
                            </label>

                            <Show
                                when={selectedFile()}
                                fallback={
                                    <div
                                        class={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive()
                                            ? 'border-blue-400 bg-blue-50'
                                            : 'border-slate-300 hover:border-slate-400'
                                            }`}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                    >
                                        <UploadIcon class="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p class="text-slate-600 mb-2">
                                            Drag & drop file Excel atau{' '}
                                            <label class="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                                                pilih file
                                                <input
                                                    type="file"
                                                    accept=".xlsx,.xls"
                                                    onChange={handleFileInput}
                                                    class="hidden"
                                                />
                                            </label>
                                        </p>
                                        <p class="text-xs text-slate-500">
                                            Format: .xlsx, .xls (Maksimal 10MB)
                                        </p>
                                    </div>
                                }
                            >
                                <div class="border border-slate-300 rounded-lg p-4">
                                    <div class="flex items-center gap-3">
                                        <FileIcon class="w-8 h-8 text-green-600" />
                                        <div class="flex-1">
                                            <p class="font-medium text-slate-800">{selectedFile()?.name}</p>
                                            <p class="text-sm text-slate-500">
                                                {selectedFile() ? formatFileSize(selectedFile()!.size) : ''}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedFile(null)}
                                            class="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                        >
                                            <XIcon class="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Show>
                        </div>

                        {/* Format Info */}
                        <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <h4 class="font-medium text-slate-700 mb-2">Format Excel yang Diperlukan:</h4>
                            <ul class="text-sm text-slate-600 space-y-1">
                                <li>• <strong>kode_material:</strong> Kode unik material</li>
                                <li>• <strong>nama_material:</strong> Nama material</li>
                                <li>• <strong>kategori:</strong> Kategori material (Sipil/Telecom/dll)</li>
                                <li>• <strong>spesifikasi:</strong> Spesifikasi detail</li>
                                <li>• <strong>satuan:</strong> Satuan material</li>
                                <li>• <strong>harga_satuan:</strong> Harga per satuan (angka)</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer */}
                    <div class="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                        <button
                            onClick={props.onClose}
                            disabled={isUploading()}
                            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={!selectedFile() || !selectedProjectId() || isUploading()}
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading() ? 'Mengimport...' : 'Import Material'}
                        </button>
                    </div>
                </div>
            </div>
        </Show>
    );
};

export default ImportMaterialExcelModal;