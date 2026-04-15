import { createSignal, createEffect, onCleanup, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { SiteEvidence } from '../../../../../domain/entities/site-evidence.entity';

interface SiteEvidencePreviewModalProps {
    show: boolean;
    evidence: SiteEvidence | null;
    onClose: () => void;
}

const SiteEvidencePreviewModal: Component<SiteEvidencePreviewModalProps> = (props) => {
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

    const getPreviewUrl = (evidence: SiteEvidence): string => {
        if (evidence.url && (evidence.url.startsWith('http') || evidence.url.startsWith('data:'))) return evidence.url;
        if (evidence.url) return `${import.meta.env.VITE_API_URL}${evidence.url}`;
        return `${import.meta.env.VITE_API_URL}/api/site-evidence/${evidence.id}/preview`;
    };

    const fetchFileBlob = async (evidence: SiteEvidence) => {
        // If it's already a data: URL, we can just use it directly without fetching
        if (evidence.url && evidence.url.startsWith('data:')) {
            setPreviewBlobUrl(evidence.url);
            return;
        }

        setIsLoadingPreview(true);
        try {
            const url = getPreviewUrl(evidence);
            const token = localStorage.getItem('auth_token');
            const headers: Record<string, string> = {};
            if (token && !url.startsWith('http') && !url.startsWith('data:')) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error('Failed to fetch file');

            const blob = await response.blob();
            const blobWithCorrectType = new Blob([blob], { type: blob.type || evidence.mime_type });
            const objectUrl = URL.createObjectURL(blobWithCorrectType);
            setPreviewBlobUrl(objectUrl);
        } catch (error) {
            console.error('Error fetching preview blob:', error);
            // Fallback for mock data or direct URLs
            if (evidence.url && (evidence.url.startsWith('http') || evidence.url.startsWith('/uploads'))) {
                setPreviewBlobUrl(getPreviewUrl(evidence));
            } else {
                setPreviewBlobUrl(null);
            }
        } finally {
            setIsLoadingPreview(false);
        }
    };

    createEffect(() => {
        if (props.show && props.evidence) {
            if (canPreviewInline(props.evidence.mime_type || props.evidence.filename || '')) {
                fetchFileBlob(props.evidence);
            }
        } else {
            if (previewBlobUrl() && previewBlobUrl()?.startsWith('blob:')) {
                URL.revokeObjectURL(previewBlobUrl()!);
                setPreviewBlobUrl(null);
            } else {
                setPreviewBlobUrl(null);
            }
        }
    });

    onCleanup(() => {
        if (previewBlobUrl() && previewBlobUrl()?.startsWith('blob:')) {
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
        if (!props.evidence) return;
        const url = getPreviewUrl(props.evidence);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = props.evidence.filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Show when={props.show && props.evidence}>
            {(evidence) => (
                <div class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div class="bg-white rounded-[32px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="text-xl font-bold text-slate-900 tracking-tight">Pratinjau Evidence</h2>
                                    <div class="flex items-center gap-2 mt-0.5">
                                        <span class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] uppercase font-bold tracking-widest border border-blue-100">
                                            {evidence().progress_tag}
                                        </span>
                                        <p class="text-xs font-semibold text-slate-400 truncate max-w-[300px]">{evidence().filename}</p>
                                    </div>
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
                            {/* Evidence Info Grid */}
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Keterangan</p>
                                    <p class="text-sm font-bold text-slate-800 line-clamp-1" title={evidence().keterangan || 'N/A'}>
                                        {evidence().keterangan || 'No description'}
                                    </p>
                                </div>
                                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Uploader</p>
                                    <p class="text-sm font-bold text-slate-800 truncate">{evidence().uploaded_by || 'Unknown'}</p>
                                </div>
                                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Upload</p>
                                    <p class="text-sm font-bold text-slate-800">{formatDate(evidence().uploaded_at)}</p>
                                </div>
                                <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Size / Type</p>
                                    <p class="text-sm font-bold text-slate-800 uppercase tracking-tighter">
                                        {evidence().size ? formatFileSize(evidence().size || 0) : 'Unknown Size'} · {(evidence().mime_type || 'application/octet-stream').split('/').pop() || 'Unknown'}
                                    </p>
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
                                    {canPreviewInline(evidence().mime_type || evidence().filename || '') && previewBlobUrl() ? (
                                        <div class="flex items-center justify-center bg-slate-800/10 min-h-[450px]">
                                            {(evidence().mime_type?.includes('image') || (evidence().filename?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/))) ? (
                                                <img
                                                    src={previewBlobUrl()!}
                                                    alt={evidence().filename}
                                                    class="max-w-full max-h-[600px] object-contain shadow-2xl rounded-lg"
                                                />
                                            ) : (evidence().mime_type?.includes('pdf') || evidence().filename?.toLowerCase().endsWith('.pdf')) ? (
                                                <iframe
                                                    src={previewBlobUrl()!}
                                                    class="w-full h-[600px] border-none"
                                                    title={evidence().filename}
                                                />
                                            ) : null}
                                        </div>
                                    ) : (
                                        <div class="flex flex-col items-center justify-center p-16 text-center">
                                            <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                                {getFileIcon(evidence().mime_type || '')}
                                            </div>
                                            <h4 class="text-xl font-bold text-slate-900 mb-2">Pratinjau Tidak Tersedia</h4>
                                            <p class="text-slate-500 max-w-sm font-medium">Format file ini ({evidence().mime_type || 'unknown'}) tidak dapat ditampilkan langsung di browser.</p>
                                            <p class="text-slate-400 text-sm mt-1 mb-8">Silakan unduh file untuk melihat kontennya.</p>

                                            <button
                                                onClick={handleDownload}
                                                class="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                                </svg>
                                                Download Evidence
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
                            <button
                                onClick={handleDownload}
                                class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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

export default SiteEvidencePreviewModal;
