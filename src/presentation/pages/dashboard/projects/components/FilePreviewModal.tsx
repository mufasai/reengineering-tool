import { Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { ProjectFile } from '../../../../../domain/entities/project-file.entity';

interface FilePreviewModalProps {
    show: boolean;
    file: ProjectFile | null;
    onClose: () => void;
    onDownload: (file: ProjectFile) => void;
}

const FilePreviewModal: Component<FilePreviewModalProps> = (props) => {
    const getFileIcon = (mimeType: string) => {
        if (mimeType.includes('pdf')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                </svg>
            );
        }
        if (mimeType.includes('image')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            );
        }
        if (mimeType.includes('word') || mimeType.includes('document')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                </svg>
            );
        }
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M9 13h6" />
                    <path d="M9 17h6" />
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
            </svg>
        );
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPreviewUrl = (file: ProjectFile): string => {
        const fileId = file.id.includes(':') ? file.id.split(':').pop()! : file.id;
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/project-files/${fileId}/download`;
    };

    const canPreviewInline = (mimeType: string): boolean => {
        return mimeType.includes('image') || mimeType.includes('pdf');
    };

    return (
        <Show when={props.show && props.file}>
            {(file) => (
                <div class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                            <div class="flex items-center gap-3">
                                <div class="p-2 bg-white rounded-lg shadow-sm">
                                    {getFileIcon(file().mime_type)}
                                </div>
                                <div>
                                    <h2 class="text-lg font-bold text-slate-900">{file().title}</h2>
                                    <p class="text-sm text-slate-500">{file().original_name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => props.onClose()}
                                class="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-200 rounded-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div class="flex-1 overflow-y-auto p-6">
                            {/* File Info */}
                            <div class="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <p class="text-xs text-slate-500 mb-1">File Size</p>
                                    <p class="text-sm font-semibold text-slate-900">{formatFileSize(file().size)}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Type</p>
                                    <p class="text-sm font-semibold text-slate-900">{file().mime_type}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Uploaded At</p>
                                    <p class="text-sm font-semibold text-slate-900">{formatDate(file().uploaded_at)}</p>
                                </div>
                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Uploaded By</p>
                                    <p class="text-sm font-semibold text-slate-900">{file().uploaded_by || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Preview */}
                            <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                {canPreviewInline(file().mime_type) ? (
                                    <div class="min-h-[400px] flex items-center justify-center">
                                        {file().mime_type.includes('image') ? (
                                            <img
                                                src={getPreviewUrl(file())}
                                                alt={file().title}
                                                class="max-w-full max-h-[500px] object-contain"
                                            />
                                        ) : file().mime_type.includes('pdf') ? (
                                            <iframe
                                                src={getPreviewUrl(file())}
                                                class="w-full h-[500px]"
                                                title={file().title}
                                            />
                                        ) : null}
                                    </div>
                                ) : (
                                    <div class="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                                        {getFileIcon(file().mime_type)}
                                        <p class="mt-4 text-slate-600 font-medium">Preview not available</p>
                                        <p class="text-sm text-slate-500 mt-2">This file type cannot be previewed in the browser.</p>
                                        <p class="text-sm text-slate-500">Please download the file to view it.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
                            <button
                                onClick={() => props.onClose()}
                                class="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => props.onDownload(file())}
                                class="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Show>
    );
};

export default FilePreviewModal;
