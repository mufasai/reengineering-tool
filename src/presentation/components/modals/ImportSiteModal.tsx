import { createSignal, createEffect, Show, Switch, Match, For } from 'solid-js';
import type { Component } from 'solid-js';

// Helper for classes
const clsx = (...classes: any[]) => classes.flat().filter(Boolean).join(' ');

const XIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
);
import { ImportProjectInteractor } from '../../../application/use-cases/import-project.use-case';
import { projectRepository } from '../../../infrastructure/repositories/project.repository.impl';

const importProject = new ImportProjectInteractor(projectRepository);
const UploadIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
);
const PlusIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
);
const FileSpreadsheetIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
);
const AlertTriangleIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
);
const CheckCircle2Icon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
);
const ListChecksIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg>
);
const ArrowRightIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" x2="19" y1="12" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const Loader2Icon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /></svg>
);

interface ImportSiteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportExcel: (parsedData: any[], fileName: string) => void;
    onAddManual: () => void;
}

// MOCK: Generate some conflict data when parsing
const generateMockConflicts = () => {
    return [
        { unique_key: 'BKS598', site_id: 'BKS598', field: 'site_name', oldVal: 'CIPINANGJAYALAMA', newVal: 'CIPINANGJAYA_NEW', accepted: true },
        { unique_key: 'JKT001', site_id: 'JKT001', field: 'longitude', oldVal: '106.820', newVal: '106.822', accepted: true },
        { unique_key: 'BDO123', site_id: 'BDO123', field: 'tower_provider', oldVal: 'Mitratel', newVal: 'Tower Bersama', accepted: false },
        { unique_key: 'SBY999', site_id: 'SBY999', field: 'po_tsel', oldVal: '4200052176', newVal: '4200088888', accepted: true },
    ];
};

const ImportSiteModal: Component<ImportSiteModalProps> = (props) => {
    // Top-level Wizard State
    const [step, setStep] = createSignal<1 | 2 | 3 | 4>(1);
    
    // Step 1 State
    const [activeTab, setActiveTab] = createSignal<'excel' | 'manual'>('excel');
    let fileInputRef: HTMLInputElement | undefined;
    const [selectedFile, setSelectedFile] = createSignal<File | null>(null);

    // Step 3 State (Conflicts)
    const [conflicts, setConflicts] = createSignal<any[]>([]);
    
    // Step 4 State (Result)
    const [resultCounts, setResultCounts] = createSignal({ new: 0, updated: 0, skipped: 0, unchanged: 0, errors: [] as string[] });

    createEffect(() => {
        if (!props.isOpen) {
            // Reset state fully when modal closes
            const timer = setTimeout(() => {
                setStep(1);
                setActiveTab('excel');
                setSelectedFile(null);
                setConflicts([]);
            }, 300);
            return () => clearTimeout(timer);
        }
    });

    const handleFileChange = (e: Event) => {
        const target = e.currentTarget as HTMLInputElement;
        const file = target.files?.[0];
        setSelectedFile(file || null);
    };

    const handleNextToAnalyze = async () => {
        const file = selectedFile();
        if (!file) return;

        setStep(2);

        try {
            const response = await importProject.execute({ file });
            
            if (response.success) {
                // Map API response to result state
                setResultCounts({
                    new: response.data.sites_created,
                    updated: 0, // The API seems to create sites for a new project mostly
                    skipped: response.data.sites_failed,
                    unchanged: 0,
                    errors: response.data.errors || []
                });

                // Let the parent know
                props.onImportExcel(response.data.created_sites || [], file.name);
                
                // Since the API returns final results directly without a conflict review step
                // we'll skip Step 3 and go straight to Step 4
                setStep(4);
            } else {
                alert(`Import failed: ${response.message}`);
                setStep(1);
            }
        } catch (error: any) {
            console.error("Import error:", error);
            alert(`An error occurred: ${error.message || 'Unknown error'}`);
            setStep(1);
        }
    };

    const handleAcceptToggle = (key: string, field: string, val: boolean) => {
        setConflicts(prev => prev.map(c => 
            (c.unique_key === key && c.field === field) ? { ...c, accepted: val } : c
        ));
    };

    const handleBulkAccept = (val: boolean) => {
        setConflicts(prev => prev.map(c => ({ ...c, accepted: val })));
    };

    const handleFinishImport = () => {
        // Calculate result
        const acceptedCount = conflicts().filter(c => c.accepted).length;
        const skippedCount = conflicts().length - acceptedCount;
        setResultCounts({
            new: 12, // Mock 12 new sites
            updated: acceptedCount,
            skipped: skippedCount,
            unchanged: 45, // Mock 45 unchanged
            errors: []
        });
        
        // Let the parent know
        props.onImportExcel([], selectedFile()?.name || 'Import_Batch');
        
        setStep(4);
    };

    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                    
                    {/* Header with Steps */}
                    <div class="px-6 py-4 border-b border-slate-200 bg-white shrink-0 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <h2 class="text-lg font-bold text-slate-800">Add Site & Import</h2>
                            <div class="hidden sm:flex items-center gap-2">
                                <span class="text-slate-300">|</span>
                                <div class="flex flex-row gap-2 text-xs font-bold">
                                    <For each={[1, 2, 3, 4]}>
                                        {(s, idx) => (
                                            <div class="flex items-center gap-2">
                                                <span class={clsx(
                                                    "flex items-center justify-center w-5 h-5 rounded-full",
                                                    step() === s ? "bg-blue-600 text-white" : step() > s ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                                                )}>
                                                    <Show when={step() > s} fallback={s}>
                                                        <CheckCircle2Icon class="w-3 h-3" />
                                                    </Show>
                                                </span>
                                                <span class={clsx(step() === s ? "text-slate-800" : step() > s ? "text-emerald-600" : "text-slate-400")}>
                                                    {s === 1 ? 'Upload' : s === 2 ? 'Analysis' : s === 3 ? 'Review' : 'Result'}
                                                </span>
                                                {idx() < 3 && <div class="w-4 h-px bg-slate-200"></div>}
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </div>
                        </div>
                        <Show when={step() !== 2}>
                            <button onClick={props.onClose} class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                                <XIcon class="w-5 h-5" />
                            </button>
                        </Show>
                    </div>

                    {/* Body Area */}
                    <div class="flex-1 overflow-y-auto bg-slate-50/50 p-6 relative">
                        <Switch>
                            {/* STEP 1: UPLOAD */}
                            <Match when={step() === 1}>
                                <div class="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                                    <div class="flex border-b border-slate-200 bg-slate-50">
                                        <button onClick={() => setActiveTab('excel')} class={clsx("flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2", activeTab() === 'excel' ? "border-blue-600 text-blue-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100")}>
                                            <UploadIcon class="w-4 h-4" /> Upload Excel BoQ
                                        </button>
                                        <button onClick={() => setActiveTab('manual')} class={clsx("flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2", activeTab() === 'manual' ? "border-blue-600 text-blue-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100")}>
                                            <PlusIcon class="w-4 h-4" /> Entry Manual
                                        </button>
                                    </div>
                                    
                                    <div class="p-6">
                                        <Show when={activeTab() === 'excel'} fallback={
                                            <div class="space-y-5">
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div class="space-y-1.5"><label class="text-xs font-bold text-slate-700">SITE ID *</label><input type="text" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="e.g. BKS598" /></div>
                                                    <div class="space-y-1.5"><label class="text-xs font-bold text-slate-700">Project Type *</label>
                                                        <select class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"><option>COMBAT</option><option>FILTER</option></select>
                                                    </div>
                                                    <div class="space-y-1.5 col-span-2"><label class="text-xs font-bold text-slate-700">Site Name *</label><input type="text" class="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" placeholder="e.g. CIPINANGJAYA" /></div>
                                                </div>
                                                <div class="flex justify-end pt-4 border-t border-slate-100">
                                                    <button onClick={props.onAddManual} class="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm">
                                                        Simpan Site Baru
                                                    </button>
                                                </div>
                                            </div>
                                        }>
                                            <div class="space-y-6">
                                                <p class="text-sm text-slate-600 text-center">
                                                    Import file Excel Master List dari Telkomsel. Sistem akan memisahkan record baru dan mendeteksi perubahan data pada record lama.
                                                </p>
                                                <input type="file" class="hidden" ref={fileInputRef} accept=".xlsx, .xls" onChange={handleFileChange} />
                                                
                                                <div 
                                                    class={clsx(
                                                        "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group",
                                                        selectedFile() ? "border-blue-500 bg-blue-50/50" : "border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-400"
                                                    )}
                                                    onClick={() => fileInputRef?.click()}
                                                >
                                                    <Show when={selectedFile()} fallback={
                                                        <div>
                                                            <div class="w-14 h-14 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                                <UploadIcon class="w-7 h-7 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                            </div>
                                                            <h3 class="text-sm font-bold text-slate-800 mb-1">Klik atau Drop file disini</h3>
                                                            <p class="text-xs text-slate-500 font-medium tracking-wide">XLSX atau XLS (Max 20MB)</p>
                                                        </div>
                                                    }>
                                                        <div class="animate-in zoom-in duration-200">
                                                            <div class="w-14 h-14 bg-white border border-blue-200 shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <FileSpreadsheetIcon class="w-7 h-7 text-blue-600" />
                                                            </div>
                                                            <h3 class="text-sm font-bold text-slate-800 mb-1">{selectedFile()?.name}</h3>
                                                            <p class="text-xs text-slate-500 font-mono mb-4">{(selectedFile()!.size / 1024).toFixed(1)} KB</p>
                                                            <button class="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm">
                                                                Ganti File
                                                            </button>
                                                        </div>
                                                    </Show>
                                                </div>

                                                <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 flex gap-3 text-sm">
                                                    <AlertTriangleIcon class="w-5 h-5 text-amber-500 shrink-0" />
                                                    <div class="text-slate-700">
                                                        <p class="font-bold mb-1">Penting:</p>
                                                        <ul class="list-disc pl-4 space-y-1 text-xs">
                                                            <li>Header wajib ada: <code class="bg-white px-1 py-0.5 rounded border border-slate-200">SITE_ID</code>, <code class="bg-white px-1 py-0.5 rounded border border-slate-200">Site Name</code>, <code class="bg-white px-1 py-0.5 rounded border border-slate-200">Region</code></li>
                                                            <li>Record yang sudah ada di sistem dan tidak memiliki perubahan <strong>tidak akan diubah</strong>.</li>
                                                            <li>Data <strong>Operasional</strong> (Status/Stage/Tim) di sistem tidak akan tertimpa oleh Import.</li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div class="flex justify-end pt-4 border-t border-slate-100">
                                                    <button 
                                                        onClick={handleNextToAnalyze}
                                                        disabled={!selectedFile()}
                                                        class={clsx(
                                                            "px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm",
                                                            selectedFile() ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                        )}
                                                    >
                                                        Lanjut ke Analisis <ArrowRightIcon class="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </Show>
                                    </div>
                                </div>
                            </Match>

                            {/* STEP 2: ANALYZING (Spinner) */}
                            <Match when={step() === 2}>
                                <div class="flex flex-col items-center justify-center h-64 space-y-4 animate-in fade-in zoom-in duration-300">
                                    <div class="relative">
                                        <div class="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                                        <Loader2Icon class="w-12 h-12 text-blue-600 animate-spin relative" />
                                    </div>
                                    <div class="text-center">
                                        <h3 class="text-lg font-bold text-slate-800">Menganalisis Data Excel...</h3>
                                        <p class="text-sm text-slate-500 mt-1">Membandingkan baris excel dengan database operasional saat ini</p>
                                    </div>
                                </div>
                            </Match>

                            {/* STEP 3: REVIEW CONFLICTS */}
                            <Match when={step() === 3}>
                                <div class="h-full flex flex-col space-y-4 animate-in slide-in-from-right-8 duration-300">
                                    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
                                        <div class="p-2 bg-amber-100 text-amber-600 rounded-full mt-0.5"><ListChecksIcon class="w-5 h-5" /></div>
                                        <div>
                                            <h3 class="text-sm font-bold text-amber-800 mb-1">Ditemukan Perbedaan Data TI pada {conflicts().length} Site</h3>
                                            <p class="text-sm text-amber-700 mb-3">Tinjau dan pilih data baru yang ingin diupdate ke database. <strong>Data Operasional dan Stage tidak akan berubah.</strong></p>
                                            
                                            <div class="flex items-center gap-3">
                                                <button onClick={() => handleBulkAccept(true)} class="px-3 py-1.5 bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 rounded text-xs font-bold transition-colors">✓ Terima Semua</button>
                                                <button onClick={() => handleBulkAccept(false)} class="px-3 py-1.5 bg-white border border-amber-300 text-amber-700 hover:bg-amber-100 rounded text-xs font-bold transition-colors">✗ Tolak Semua</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col min-h-[300px]">
                                        <table class="w-full text-left text-sm whitespace-nowrap">
                                            <thead class="bg-slate-50 border-b border-slate-200 sticky top-0">
                                                <tr>
                                                    <th class="px-4 py-3 font-bold text-slate-600 w-16 text-center">Update?</th>
                                                    <th class="px-4 py-3 font-bold text-slate-600">SITE_ID</th>
                                                    <th class="px-4 py-3 font-bold text-slate-600">Kolom</th>
                                                    <th class="px-4 py-3 font-bold text-slate-600 w-1/3">Data Di Sistem</th>
                                                    <th class="px-4 py-3 font-bold text-slate-600 w-1/3">Data Dari Excel</th>
                                                </tr>
                                            </thead>
                                            <tbody class="divide-y divide-slate-100">
                                                <For each={conflicts()}>
                                                    {(c, i) => (
                                                        <tr class={clsx("transition-colors", c.accepted ? "bg-white" : "bg-slate-50")}>
                                                            <td class="px-4 py-3 text-center">
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={c.accepted} 
                                                                    onInput={(e) => handleAcceptToggle(c.unique_key, c.field, e.currentTarget.checked)}
                                                                    class="w-4 h-4 accent-blue-600 cursor-pointer"
                                                                />
                                                            </td>
                                                            <td class="px-4 py-3 font-mono font-bold text-slate-800">{c.site_id}</td>
                                                            <td class="px-4 py-3 text-slate-600 font-medium">
                                                                <span class="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 text-xs">{c.field}</span>
                                                            </td>
                                                            <td class="px-4 py-3">
                                                                <span class={clsx("transition-all duration-300", c.accepted ? "line-through text-slate-400" : "font-semibold text-slate-700")}>
                                                                    {c.oldVal}
                                                                </span>
                                                            </td>
                                                            <td class="px-4 py-3">
                                                                <span class={clsx("transition-all flex items-center gap-2 font-semibold duration-300", c.accepted ? "text-blue-600" : "text-slate-400")}>
                                                                    {c.accepted && <ArrowRightIcon class="w-3 h-3 text-blue-400" />} {c.newVal}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </For>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div class="flex items-center justify-between pt-2">
                                        <span class="text-sm font-medium text-slate-500">
                                            <strong class="text-blue-600">{conflicts().filter(x => x.accepted).length}</strong> / {conflicts().length} perubahan dipilih
                                        </span>
                                        <button 
                                            onClick={handleFinishImport}
                                            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm"
                                        >
                                            Lanjut Simpan ke Database
                                        </button>
                                    </div>
                                </div>
                            </Match>

                            {/* STEP 4: RESULT */}
                            <Match when={step() === 4}>
                                <div class="flex flex-col items-center justify-center space-y-6 animate-in slide-in-from-bottom-8 duration-300 py-8">
                                    <div class="w-16 h-16 bg-emerald-100 border-4 border-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                        <CheckCircle2Icon class="w-8 h-8" />
                                    </div>
                                    <div class="text-center space-y-1">
                                        <h3 class="text-2xl font-black text-slate-800 tracking-tight">Import Berhasil</h3>
                                        <p class="text-slate-500 font-medium">{selectedFile()?.name} telah masuk ke sistem.</p>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 w-full max-w-lg mt-4">
                                        <div class="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                                            <p class="text-3xl font-black text-blue-600 mb-1">{resultCounts().new}</p>
                                            <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Site Berhasil</p>
                                        </div>
                                        <div class="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-sm">
                                            <p class="text-3xl font-black text-amber-500 mb-1">{resultCounts().skipped}</p>
                                            <p class="text-xs font-bold text-slate-500 uppercase tracking-wide">Site Gagal</p>
                                        </div>
                                    </div>

                                    <Show when={resultCounts().errors.length > 0}>
                                        <div class="w-full max-w-lg mt-4 bg-red-50 border border-red-100 rounded-xl p-4">
                                            <h4 class="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Errors</h4>
                                            <ul class="text-xs text-red-700 space-y-1 list-disc pl-4">
                                                <For each={resultCounts().errors.slice(0, 5)}>
                                                    {err => <li>{err}</li>}
                                                </For>
                                                <Show when={resultCounts().errors.length > 5}>
                                                    <li class="italic font-medium">... and {resultCounts().errors.length - 5} more</li>
                                                </Show>
                                            </ul>
                                        </div>
                                    </Show>

                                    <button 
                                        onClick={props.onClose}
                                        class="mt-8 px-6 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-900 transition-colors w-full max-w-xs"
                                    >
                                        Kembali ke Registri
                                    </button>
                                </div>
                            </Match>
                        </Switch>
                    </div>
                </div>
            </div>
        </Show>
    );
};

export default ImportSiteModal;
