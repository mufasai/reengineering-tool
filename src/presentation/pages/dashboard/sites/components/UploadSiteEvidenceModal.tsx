import { createSignal, Show, For } from 'solid-js';
import type { Component } from 'solid-js';
import type { UploadSiteEvidenceRequest } from '../../../../../domain/entities/site-evidence.entity';
import { SiteRepositoryImpl } from '../../../../../infrastructure/repositories/site.repository.impl';
import { UploadSiteEvidenceInteractor } from '../../../../../application/use-cases/upload-site-evidence.use-case';
import { authStore } from '../../../../store/auth.store';

// Icons
const XIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>;
const UploadIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>;
const AlertCircleIcon = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>;

interface UploadSiteEvidenceModalProps {
    isOpen: boolean;
    siteId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const UploadSiteEvidenceModal: Component<UploadSiteEvidenceModalProps> = (props) => {
    const [title, setTitle] = createSignal('');
    const [keterangan, setKeterangan] = createSignal('');
    const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal('');

    const handleFileChange = (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            setSelectedFile(target.files[0]);
        }
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setError('');

        if (!selectedFile()) {
            setError('File harus dipilih');
            return;
        }

        if (!title().trim()) {
            setError('Title harus diisi');
            return;
        }

        if (!keterangan().trim()) {
            setError('Keterangan harus diisi');
            return;
        }

        try {
            setLoading(true);

            // Get uploaded_by from auth store automatically
            const uploadedBy = authStore.user()?.name || authStore.user()?.email || 'Unknown User';

            const request: UploadSiteEvidenceRequest = {
                file: selectedFile()!,
                title: title(),
                keterangan: keterangan(),
                uploaded_by: uploadedBy
            };

            const siteRepository = new SiteRepositoryImpl();
            const uploadUseCase = new UploadSiteEvidenceInteractor(siteRepository);
            await uploadUseCase.execute(props.siteId, request);

            // Reset form
            setTitle('');
            setKeterangan('');
            setSelectedFile(null);

            props.onSuccess();
            props.onClose();
        } catch (err: any) {
            console.error('Failed to upload evidence:', err);
            setError(err.message || 'Gagal mengupload evidence. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading()) {
            setTitle('');
            setKeterangan('');
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
        <Show when={props.isOpen}>
            <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <UploadIcon class="w-5 h-5" />
                            </div>
                            <div>
                                <h2 class="text-lg font-bold text-slate-900">Upload Field Evidence</h2>
                                <p class="text-xs text-slate-500 font-medium">Dokumentasi foto atau evidence lapangan</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={loading()}
                            class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50"
                        >
                            <XIcon class="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} class="p-6 space-y-5">
                        <Show when={error()}>
                            <div class="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
                                <AlertCircleIcon class="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p class="font-medium">{error()}</p>
                            </div>
                        </Show>

                        {/* Title */}
                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-slate-700">
                                Title <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={title()}
                                onInput={(e) => setTitle(e.currentTarget.value)}
                                placeholder="Contoh: Foto Lapangan"
                                required
                                disabled={loading()}
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 disabled:bg-slate-100"
                            />
                        </div>

                        {/* Keterangan */}
                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-slate-700">
                                Keterangan <span class="text-red-500">*</span>
                            </label>
                            <textarea
                                value={keterangan()}
                                onInput={(e) => setKeterangan(e.currentTarget.value)}
                                placeholder="Contoh: Pemasangan tiang ODC area Menteng"
                                required
                                disabled={loading()}
                                rows={3}
                                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 disabled:bg-slate-100 resize-none"
                            />
                        </div>

                        {/* File Upload */}
                        <div class="space-y-2">
                            <label class="block text-sm font-semibold text-slate-700">
                                Pilih File <span class="text-red-500">*</span>
                            </label>
                            <div class="relative group">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    required
                                    disabled={loading()}
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                                />
                                <div class={clsx(
                                    "px-4 py-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all",
                                    selectedFile() ? "border-blue-200 bg-blue-50/30" : "border-slate-200 bg-slate-50 group-hover:bg-slate-100/50 group-hover:border-slate-300"
                                )}>
                                    <div class={clsx(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                                        selectedFile() ? "bg-blue-100 text-blue-600" : "bg-white text-slate-400 shadow-sm"
                                    )}>
                                        <UploadIcon class="w-5 h-5" />
                                    </div>
                                    <div class="text-center">
                                        <p class="text-xs font-semibold text-slate-900 truncate max-w-[200px]">
                                            {selectedFile() ? selectedFile()!.name : 'Klik atau drag file ke sini'}
                                        </p>
                                        <p class="text-[10px] text-slate-500 mt-1">
                                            {selectedFile() ? formatFileSize(selectedFile()!.size) : 'JPG, PNG, atau PDF (Maks. 5MB)'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div class="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading()}
                                class="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading()}
                                class="flex-[2] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                <Show when={loading()} fallback={<><UploadIcon class="w-4 h-4" /> Upload Evidence</>}>
                                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Mengupload...
                                </Show>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Show>
    );
};

// Helper for conditional classes
const clsx = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default UploadSiteEvidenceModal;
