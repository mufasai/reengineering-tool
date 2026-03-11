import { createSignal, createEffect, onCleanup, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { SiteFile } from '../../../../../domain/entities/site-file.entity';

interface SiteFilePreviewModalProps {
    show: boolean;
    file: SiteFile | null;
    onClose: () => void;
}

const SiteFilePreviewModal: Component<SiteFilePreviewModalProps> = (props) => {
    const getFileIcon = (mimeType: string) => {
        if (!mimeType) return (
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
            </svg>
        );

        if (mimeType.includes('pdf')) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
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

    const [previewBlobUrl, setPreviewBlobUrl] = createSignal<string | null>(null);
    const [isLoadingPreview, setIsLoadingPreview] = createSignal(false);

    const getPreviewUrl = (file: SiteFile): string => {
        const fileId = file.id.includes(':') ? file.id.split(':').pop()! : file.id;
        return `${import.meta.env.VITE_API_URL}/api/site-files/${fileId}/download`;
    };

    const fetchFileBlob = async (file: SiteFile) => {
        setIsLoadingPreview(true);
        try {
            const url = getPreviewUrl(file);
            const token = localStorage.getItem('auth_token');
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error('Failed to fetch file');

            const blob = await response.blob();
            // Use the mime type from the response if available, otherwise fallback to the entity's mime type
            const blobWithCorrectType = new Blob([blob], { type: blob.type || file.mime_type });
            const objectUrl = URL.createObjectURL(blobWithCorrectType);
            setPreviewBlobUrl(objectUrl);
        } catch (error) {
            console.error('Error fetching preview blob:', error);
            setPreviewBlobUrl(null);
        } finally {
            setIsLoadingPreview(false);
        }
    };

    createEffect(() => {
        if (props.show && props.file && canPreviewInline(props.file.mime_type || props.file.original_name || '')) {
            fetchFileBlob(props.file);
        } else {
            if (previewBlobUrl()) {
                URL.revokeObjectURL(previewBlobUrl()!);
                setPreviewBlobUrl(null);
            }
        }
    });

    onCleanup(() => {
        if (previewBlobUrl()) {
            URL.revokeObjectURL(previewBlobUrl()!);
        }
    });

    const canPreviewInline = (mimeOrFilename: string): boolean => {
        const lower = mimeOrFilename.toLowerCase();
        return lower.includes('image') ||
            lower.includes('pdf') ||
            lower.endsWith('.pdf') ||
            lower.endsWith('.jpg') ||
            lower.endsWith('.jpeg') ||
            lower.endsWith('.png');
    };

    const handleDownload = () => {
        if (!props.file) return;
        const url = getPreviewUrl(props.file);
        // Create a temporary link and click it to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = props.file.original_name || props.file.title || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Show when={props.show && props.file}>
            {(file) => (
                <div class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div class="bg-white rounded-[32px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                                    {getFileIcon(file().mime_type)}
                                </div>
                                <div>
                                    <h2 class="text-xl font-bold text-slate-900 tracking-tight">{file().title}</h2>
                                    <p class="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{file().original_name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => props.onClose()}
                                class="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div class="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                            {/* File Info Grid */}
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">File Size</p>
                                    <p class="text-sm font-bold text-slate-800">{formatFileSize(file().size)}</p>
                                </div>
                                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                                    <p class="text-sm font-bold text-slate-800 truncate">{file().mime_type}</p>
                                </div>
                                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Uploaded At</p>
                                    <p class="text-sm font-bold text-slate-800">{formatDate(file().uploaded_at)}</p>
                                </div>
                                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Uploaded By</p>
                                    <p class="text-sm font-bold text-slate-800">{file().uploaded_by || 'System'}</p>
                                </div>
                            </div>

                            <div class="border border-slate-200 rounded-[24px] overflow-hidden bg-white shadow-inner min-h-[400px]">
                                <Show when={isLoadingPreview()}>
                                    <div class="flex flex-col items-center justify-center p-16 gap-4">
                                        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p class="text-slate-500 font-medium">Memuat pratinjau...</p>
                                    </div>
                                </Show>

                                <Show when={!isLoadingPreview()}>
                                    {canPreviewInline(file().mime_type || file().original_name || '') && previewBlobUrl() ? (
                                        <div class="flex items-center justify-center bg-slate-800/10 min-h-[450px]">
                                            {file().mime_type?.includes('image') || (file().original_name?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) ? (
                                                <img
                                                    src={previewBlobUrl()!}
                                                    alt={file().title}
                                                    class="max-w-full max-h-[600px] object-contain shadow-2xl rounded-lg"
                                                />
                                            ) : (file().mime_type?.includes('pdf') || file().original_name?.toLowerCase().endsWith('.pdf')) ? (
                                                <iframe
                                                    src={previewBlobUrl()!}
                                                    class="w-full h-[600px] border-none"
                                                    title={file().title}
                                                />
                                            ) : null}
                                        </div>
                                    ) : (
                                        <div class="flex flex-col items-center justify-center p-16 text-center">
                                            <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                                {getFileIcon(file().mime_type)}
                                            </div>
                                            <h4 class="text-xl font-bold text-slate-900 mb-2">Pratinjau Tidak Tersedia</h4>
                                            <p class="text-slate-500 max-w-sm font-medium">Format file ini ({file().mime_type}) tidak dapat ditampilkan langsung di browser.</p>
                                            <p class="text-slate-400 text-sm mt-1 mb-8">Silakan unduh file untuk melihat kontennya.</p>

                                            <button
                                                onClick={handleDownload}
                                                class="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                                </svg>
                                                Download File
                                            </button>
                                        </div>
                                    )}
                                </Show>
                            </div>
                        </div>

                        {/* Footer */}
                        <div class="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                            <button
                                onClick={() => props.onClose()}
                                class="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl transition-all uppercase tracking-widest text-xs"
                            >
                                Tutup
                            </button>
                            <Show when={canPreviewInline(file().mime_type || file().original_name || '')}>
                                <button
                                    onClick={handleDownload}
                                    class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                    </svg>
                                    Download
                                </button>
                            </Show>
                        </div>
                    </div>
                </div>
            )}
        </Show>
    );
};

export default SiteFilePreviewModal;
