import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { UploadProjectFileRequest } from '../../../../../domain/entities/project-file.entity';
import { ProjectRepositoryImpl } from '../../../../../infrastructure/repositories/project.repository.impl';
import { UploadProjectFileInteractor } from '../../../../../application/use-cases/upload-project-file.use-case';

interface UploadProjectFileModalProps {
    show: boolean;
    projectId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const UploadProjectFileModal: Component<UploadProjectFileModalProps> = (props) => {
    const [title, setTitle] = createSignal('');
    const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal('');

    const handleFileChange = (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            setSelectedFile(target.files[0]);
            // Auto-fill title with filename if title is empty
            if (!title()) {
                const filename = target.files[0].name;
                const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
                setTitle(nameWithoutExt);
            }
        }
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setError('');

        if (!title().trim()) {
            setError('Title harus diisi');
            return;
        }

        if (!selectedFile()) {
            setError('File harus dipilih');
            return;
        }

        try {
            setLoading(true);

            const request: UploadProjectFileRequest = {
                file: selectedFile()!,
                title: title()
            };

            const projectRepository = new ProjectRepositoryImpl();
            const uploadUseCase = new UploadProjectFileInteractor(projectRepository);
            await uploadUseCase.execute(props.projectId, request);

            // Reset form
            setTitle('');
            setSelectedFile(null);

            props.onSuccess();
            props.onClose();
        } catch (err: any) {
            console.error('Failed to upload file:', err);
            setError(err.message || 'Gagal mengupload file. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading()) {
            setTitle('');
            setSelectedFile(null);
            setError('');
            props.onClose();
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <Show when={props.show}>
            <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full">
                    {/* Header */}
                    <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h2 class="text-xl font-bold text-slate-900">Upload Project File</h2>
                        <button
                            onClick={handleClose}
                            disabled={loading()}
                            class="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} class="p-6 space-y-5">
                        {error() && (
                            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error()}
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Title <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title()}
                                onInput={(e) => setTitle(e.currentTarget.value)}
                                placeholder="Project Document"
                                required
                                disabled={loading()}
                                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* File Upload */}
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                File <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    required
                                    disabled={loading()}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            <p class="mt-1 text-xs text-slate-500">
                                Supported: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 10MB)
                            </p>
                            {selectedFile() && (
                                <div class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-slate-900 truncate">{selectedFile()!.name}</p>
                                            <p class="text-xs text-slate-500">{formatFileSize(selectedFile()!.size)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div class="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading()}
                                class="flex-1 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                {loading() ? 'Uploading...' : 'Upload File'}
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading()}
                                class="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Show>
    );
};

export default UploadProjectFileModal;
