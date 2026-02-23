import { createSignal, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { ProjectType, Site, ProjectFile } from '../../../../../domain/entities/work-order.entity';
import CreateSiteModal from './CreateSiteModal';

interface CreateWorkOrderFormProps {
    onSave: (data: any) => void;
    onCancel: () => void;
}

const CreateWorkOrderForm: Component<CreateWorkOrderFormProps> = (props) => {
    // 1. Project Info State
    const [projectName, setProjectName] = createSignal('');
    const [lokasi, setLokasi] = createSignal('');
    const [budget, setBudget] = createSignal(0);
    const [projectType, setProjectType] = createSignal<ProjectType>('COMBAT');
    const [keterangan, setKeterangan] = createSignal('');

    // 2. Sites State
    const [sites, setSites] = createSignal<Site[]>([]);
    const [showSiteModal, setShowSiteModal] = createSignal(false);

    // 3. Files State
    const [files, setFiles] = createSignal<ProjectFile[]>([]);

    const handleFileUpload = (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files) {
            const newFile: ProjectFile = {
                id: Math.random().toString(36).substr(2, 9),
                name: input.files[0].name,
                url: '#',
                type: 'OTHER',
                createdAt: new Date()
            };
            setFiles([...files(), newFile]);
        }
    };

    const handleSaveSite = (site: Site) => {
        setSites([...sites(), site]);
        setShowSiteModal(false);
    };

    const handleSave = () => {
        props.onSave({
            projectName: projectName(),
            lokasi: lokasi(),
            budget: budget(),
            projectType: projectType(),
            keterangan: keterangan(),
            sites: sites(),
            files: files()
        });
    };

    return (
        <div class="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Project Details Section */}
            <section class="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 shadow-sm">
                <header>
                    <h3 class="text-xl font-bold text-slate-900 uppercase tracking-tight">Project Details</h3>
                    <p class="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Main Project Information</p>
                </header>

                <div class="space-y-6 max-w-2xl">
                    <div class="grid grid-cols-[140px_1fr] items-center gap-6">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Project Name</label>
                        <input
                            type="text"
                            value={projectName()}
                            onInput={(e) => setProjectName(e.currentTarget.value)}
                            class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                        />
                    </div>

                    <div class="grid grid-cols-[140px_1fr] items-center gap-6">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Location</label>
                        <input
                            type="text"
                            value={lokasi()}
                            onInput={(e) => setLokasi(e.currentTarget.value)}
                            class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                        />
                    </div>

                    <div class="grid grid-cols-[140px_1fr] items-center gap-6">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Budget</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                            <input
                                type="number"
                                value={budget()}
                                onInput={(e) => setBudget(Number(e.currentTarget.value))}
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-bold"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-[140px_1fr] items-center gap-6">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Type</label>
                        <select
                            value={projectType()}
                            onChange={(e) => setProjectType(e.currentTarget.value as ProjectType)}
                            class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none font-bold"
                        >
                            <For each={['COMBAT', 'L2H', 'BLACK SITE', 'REFINEN', 'FILTER', 'BEBAN OPERASIONAL'] as const}>
                                {(type) => <option value={type} class="bg-white">{type}</option>}
                            </For>
                        </select>
                    </div>

                    <div class="grid grid-cols-[140px_1fr] items-center gap-6">
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Description</label>
                        <input
                            type="text"
                            value={keterangan()}
                            onInput={(e) => setKeterangan(e.currentTarget.value)}
                            class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                        />
                    </div>
                </div>
            </section>

            {/* Document Project Section */}
            <section class="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 shadow-sm">
                <header>
                    <h3 class="text-xl font-bold text-slate-900 uppercase tracking-tight">Document Project</h3>
                </header>

                <div class="grid lg:grid-cols-[140px_1fr] gap-6">
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest pt-4">Project File</label>
                    <div class="space-y-6">
                        <label class="cursor-pointer w-full py-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group border-dashed border-2">
                            <input type="file" class="hidden" onChange={handleFileUpload} />
                            <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Upload Files</span>
                        </label>

                        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-6 min-h-[140px]">
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Preview</p>
                            <div class="flex flex-wrap gap-4">
                                <For each={files()}>
                                    {(_, index) => (
                                        <div class="bg-white border border-slate-200 rounded-2xl p-4 w-28 flex flex-col items-center gap-3 relative group shadow-sm">
                                            <div class="w-12 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                            </div>
                                            <p class="text-[10px] font-bold text-slate-500 uppercase text-center truncate w-full">doc{index() + 1}</p>
                                        </div>
                                    )}
                                </For>
                                <Show when={files().length === 0}>
                                    <div class="flex-1 flex items-center justify-center text-slate-300 italic text-[10px] font-bold tracking-widest uppercase">No documents uploaded</div>
                                </Show>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sites Section */}
            <section class="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 shadow-sm">
                <header class="flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 uppercase tracking-tight">Sites</h3>
                        <p class="text-[10px] text-slate-400 mt-0.5 uppercase font-bold tracking-widest">List of sites in this project</p>
                    </div>
                    <button
                        onClick={() => setShowSiteModal(true)}
                        class="text-[10px] font-bold bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14" /></svg>
                        Add Site
                    </button>
                </header>

                <div class="min-h-[200px] border border-slate-100 rounded-[24px] bg-slate-50/50 overflow-hidden">
                    <Show when={sites().length > 0} fallback={
                        <div class="h-full flex flex-col items-center justify-center p-12 text-center text-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-4 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            <p class="text-[10px] font-bold uppercase tracking-[0.2em]">No sites added yet</p>
                        </div>
                    }>
                        <div class="p-6 space-y-3">
                            <For each={sites()}>
                                {(site) => (
                                    <div class="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 group hover:border-blue-500/30 transition-all shadow-sm">
                                        <div>
                                            <p class="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{site.siteName}</p>
                                            <p class="text-[10px] text-slate-400 uppercase font-bold mt-0.5">{site.lokasi} • {site.pekerjaan}</p>
                                        </div>
                                        <div class="flex items-center gap-4">
                                            <div class="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                                <span class="text-[9px] font-bold text-slate-500 uppercase">{site.team.length} Team Members</span>
                                            </div>
                                            <button class="text-slate-300 hover:text-red-500 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </section>

            <footer class="flex items-center justify-between pt-10 border-t border-slate-100">
                <button
                    onClick={props.onCancel}
                    class="py-4 px-10 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all border border-slate-200 uppercase tracking-widest text-[10px]"
                >
                    Discard Changes
                </button>
                <button
                    onClick={handleSave}
                    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-16 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-widest text-[11px]"
                >
                    Submit Project
                </button>
            </footer>

            {/* Nested Site Modal */}
            <Show when={showSiteModal()}>
                <CreateSiteModal
                    onSave={handleSaveSite}
                    onCancel={() => setShowSiteModal(false)}
                />
            </Show>
        </div>
    );
};

export default CreateWorkOrderForm;
