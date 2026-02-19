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
            <section class="bg-[#161b2b] border border-white/10 rounded-[32px] p-8 space-y-6 shadow-xl">
                <header>
                    <h3 class="text-xl font-bold text-white uppercase tracking-tight">Project Details</h3>
                    <p class="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">Main Project Information</p>
                </header>

                <div class="space-y-6 max-w-2xl">
                    <div class="grid grid-cols-[140px_1fr] items-center gap-6">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Name</label>
                        <input
                            type="text"
                            value={projectName()}
                            onInput={(e) => setProjectName(e.currentTarget.value)}
                            class="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        />
                    </div>

                    <div class="grid grid-cols-[140px_1fr] items-center gap-6">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Location</label>
                        <input
                            type="text"
                            value={lokasi()}
                            onInput={(e) => setLokasi(e.currentTarget.value)}
                            class="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        />
                    </div>

                    <div class="grid grid-cols-[140px_1fr] items-center gap-6">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Budget</label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                            <input
                                type="number"
                                value={budget()}
                                onInput={(e) => setBudget(Number(e.currentTarget.value))}
                                class="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-[140px_1fr] items-center gap-6">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Type</label>
                        <select
                            value={projectType()}
                            onChange={(e) => setProjectType(e.currentTarget.value as ProjectType)}
                            class="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none"
                        >
                            <For each={['COMBAT', 'L2H', 'BLACK SITE', 'REFINEN', 'FILTER', 'BEBAN OPERASIONAL'] as const}>
                                {(type) => <option value={type} class="bg-[#161b2b]">{type}</option>}
                            </For>
                        </select>
                    </div>

                    <div class="grid grid-cols-[140px_1fr] items-center gap-6">
                        <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                        <input
                            type="text"
                            value={keterangan()}
                            onInput={(e) => setKeterangan(e.currentTarget.value)}
                            class="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* Document Project Section */}
            <section class="bg-[#161b2b] border border-white/10 rounded-[32px] p-8 space-y-6 shadow-xl">
                <header>
                    <h3 class="text-xl font-bold text-white uppercase tracking-tight">Document Project</h3>
                </header>

                <div class="grid lg:grid-cols-[140px_1fr] gap-6">
                    <label class="text-xs font-bold text-gray-500 uppercase tracking-widest pt-4">Project File</label>
                    <div class="space-y-6">
                        <label class="cursor-pointer w-full py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 group">
                            <input type="file" class="hidden" onChange={handleFileUpload} />
                            <span class="text-xs font-bold text-white uppercase tracking-widest">Upload</span>
                        </label>

                        <div class="bg-black/20 border border-white/5 rounded-2xl p-6 min-h-[140px]">
                            <p class="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-4">Preview</p>
                            <div class="flex flex-wrap gap-4">
                                <For each={files()}>
                                    {(_, index) => (
                                        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 w-28 flex flex-col items-center gap-3 relative group">
                                            <div class="w-12 h-16 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                            </div>
                                            <p class="text-[10px] font-bold text-gray-400 uppercase text-center truncate w-full">doc{index() + 1}</p>
                                        </div>
                                    )}
                                </For>
                                <Show when={files().length === 0}>
                                    <div class="flex-1 flex items-center justify-center text-gray-700 italic text-[10px] tracking-widest uppercase">No documents uploaded</div>
                                </Show>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sites Section */}
            <section class="bg-[#161b2b] border border-white/10 rounded-[32px] p-8 space-y-6 shadow-xl">
                <header class="flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-bold text-white uppercase tracking-tight">Sites</h3>
                        <p class="text-[10px] text-gray-500 mt-0.5 uppercase font-bold tracking-widest">List of sites in this project</p>
                    </div>
                    <button
                        onClick={() => setShowSiteModal(true)}
                        class="text-[10px] font-bold bg-white text-black px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14" /></svg>
                        Add
                    </button>
                </header>

                <div class="min-h-[200px] border-2 border-white/5 rounded-[24px] bg-black/20 overflow-hidden">
                    <Show when={sites().length > 0} fallback={
                        <div class="h-full flex flex-col items-center justify-center p-12 text-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-4 opacity-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                            <p class="text-[10px] font-bold uppercase tracking-[0.2em]">No sites added yet</p>
                        </div>
                    }>
                        <div class="p-6 space-y-3">
                            <For each={sites()}>
                                {(site) => (
                                    <div class="flex items-center justify-between bg-white/[0.03] p-4 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                                        <div>
                                            <p class="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{site.siteName}</p>
                                            <p class="text-[10px] text-gray-500 uppercase font-bold mt-0.5">{site.lokasi} • {site.pekerjaan}</p>
                                        </div>
                                        <div class="flex items-center gap-4">
                                            <div class="px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                                                <span class="text-[9px] font-bold text-gray-400 uppercase">{site.team.length} Team Members</span>
                                            </div>
                                            <button class="text-gray-600 hover:text-red-400 transition-colors">
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

            <footer class="flex items-center justify-between pt-10 border-t border-white/5">
                <button
                    onClick={props.onCancel}
                    class="py-4 px-10 rounded-2xl font-bold bg-white/5 hover:bg-white/10 text-gray-400 transition-all border border-white/5 uppercase tracking-widest text-[10px]"
                >
                    Discard
                </button>
                <button
                    onClick={handleSave}
                    class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-16 rounded-2xl shadow-xl shadow-blue-600/30 transition-all active:scale-95 uppercase tracking-widest text-[11px]"
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
