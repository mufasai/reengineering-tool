import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { projectRepository } from '../../../../../infrastructure/repositories/project.repository.impl';
import { ImportProjectInteractor } from '../../../../../application/use-cases/import-project.use-case';

const importProjectUseCase = new ImportProjectInteractor(projectRepository);

interface ImportProjectModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ImportProjectModal: Component<ImportProjectModalProps> = (props) => {
    const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
    const [uploading, setUploading] = createSignal(false);
    const [result, setResult] = createSignal<string>('');
    const [error, setError] = createSignal<string>('');

    const handleFileSelect = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            setSelectedFile(input.files[0]);
            setError('');
            setResult('');
        }
    };

    const handleImport = async () => {
        const file = selectedFile();
        if (!file) {
            setError('Please select an Excel file');
            return;
        }

        try {
            setUploading(true);
            setError('');
            setResult('');

            const response = await importProjectUseCase.execute({ file });

            if (response.success) {
                const summary = response.data.summary;
                setResult(
                    `Import successful!\n\n` +
                    `Project: ${summary.project_name}\n` +
                    `Total Budget: Rp ${summary.total_budget.toLocaleString('id-ID')}\n` +
                    `Sites Created: ${response.data.sites_created} of ${response.data.total_rows}\n` +
                    `Sites Failed: ${response.data.sites_failed}\n\n` +
                    `${summary.message}`
                );

                // Close modal and refresh list after 3 seconds
                setTimeout(() => {
                    props.onSuccess();
                    props.onClose();
                    resetForm();
                }, 3000);
            } else {
                setError(response.message || 'Import failed');
            }
        } catch (err: any) {
            console.error('Import error:', err);
            setError(err.message || 'Failed to import project');
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setResult('');
        setError('');
    };

    const handleClose = () => {
        if (!uploading()) {
            resetForm();
            props.onClose();
        }
    };

    return (
        <Show when={props.show}>
            <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div class="p-6 border-b border-slate-200">
                        <h2 class="text-xl font-bold text-slate-900">Import Project from Excel</h2>
                        <p class="text-sm text-slate-500 mt-1">
                            Upload Excel file to create project with multiple sites
                        </p>
                    </div>

                    {/* Body */}
                    <div class="p-6 space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-700 mb-2">
                                Select Excel File (.xlsx, .xls)
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileSelect}
                                disabled={uploading()}
                                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                            <Show when={selectedFile()}>
                                <p class="text-sm text-slate-600 mt-2 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                    {selectedFile()?.name}
                                </p>
                            </Show>
                        </div>

                        {/* Success Result */}
                        <Show when={result()}>
                            <div class="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                                <div class="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    <p class="text-sm text-emerald-700 whitespace-pre-line">{result()}</p>
                                </div>
                            </div>
                        </Show>

                        {/* Error Message */}
                        <Show when={error()}>
                            <div class="p-4 rounded-lg bg-red-50 border border-red-200">
                                <div class="flex items-start gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <p class="text-sm text-red-700">{error()}</p>
                                </div>
                            </div>
                        </Show>

                        {/* Info */}
                        <div class="p-4 rounded-lg bg-blue-50 border border-blue-200">
                            <p class="text-xs text-blue-700">
                                <strong>Note:</strong> The Excel file should contain project information and site details.
                                The system will automatically create the project and all associated sites.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div class="p-6 border-t border-slate-200 flex gap-3 justify-end">
                        <button
                            onClick={handleClose}
                            disabled={uploading()}
                            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {result() ? 'Close' : 'Cancel'}
                        </button>
                        <Show when={!result()}>
                            <button
                                onClick={handleImport}
                                disabled={!selectedFile() || uploading()}
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Show when={uploading()}>
                                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </Show>
                                {uploading() ? 'Importing...' : 'Import Project'}
                            </button>
                        </Show>
                    </div>
                </div>
            </div>
        </Show>
    );
};

export default ImportProjectModal;
