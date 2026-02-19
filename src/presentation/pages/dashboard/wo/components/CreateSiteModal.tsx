import { createSignal, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { Site } from '../../../../../domain/entities/work-order.entity';
import type { Personnel } from '../../../../../domain/entities/team.entity';

interface CreateSiteModalProps {
    onSave: (site: Site) => void;
    onCancel: () => void;
}

const CreateSiteModal: Component<CreateSiteModalProps> = (props) => {
    const [siteName, setSiteName] = createSignal('');
    const [siteInfo, setSiteInfo] = createSignal('');
    const [pekerjaan, setPekerjaan] = createSignal('');
    const [lokasi, setLokasi] = createSignal('');
    const [nomorKontrak, setNomorKontrak] = createSignal('');
    const [startDate, setStartDate] = createSignal('');
    const [endDate, setEndDate] = createSignal('');
    const [maximalBudget, setMaximalBudget] = createSignal(0);
    const [costEstimated, setCostEstimated] = createSignal(0);
    const [pemberiTugas, setPemberiTugas] = createSignal('');
    const [penerimaTugas, setPenerimaTugas] = createSignal('');
    const [team, setTeam] = createSignal<Personnel[]>([]);

    const handleAddPersonnel = () => {
        // Mock adding personnel for now
        const newPerson: Personnel = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Personnel ${team().length + 1}`,
            ktpNumber: '1234567890',
            email: 'test@example.com',
            phoneNumber: '08123456789',
            role: 'Technician',
            verificationPhotos: {
                ktp: '',
                selfie: '',
                nda: ''
            }
        };
        setTeam([...team(), newPerson]);
    };

    const handleSave = () => {
        const newSite: Site = {
            id: Math.random().toString(36).substr(2, 9),
            siteName: siteName(),
            siteInfo: siteInfo(),
            pekerjaan: pekerjaan(),
            lokasi: lokasi(),
            nomorKontrak: nomorKontrak(),
            start: new Date(startDate()),
            end: new Date(endDate()),
            maximalBudget: maximalBudget(),
            costEstimated: costEstimated(),
            pemberiTugas: pemberiTugas(),
            penerimaTugas: penerimaTugas(),
            team: team()
        };
        props.onSave(newSite);
    };

    return (
        <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div class="bg-[#0f1425] border border-white/10 w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <header class="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-white uppercase tracking-tight">Create Site</h3>
                        <p class="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Site Parameters & Team Assignment</p>
                    </div>
                </header>

                <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1.5 col-span-2">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Site Name</label>
                            <input
                                type="text"
                                value={siteName()}
                                onInput={(e) => setSiteName(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5 col-span-2">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Site Info</label>
                            <input
                                type="text"
                                value={siteInfo()}
                                onInput={(e) => setSiteInfo(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Pekerjaan</label>
                            <input
                                type="text"
                                value={pekerjaan()}
                                onInput={(e) => setPekerjaan(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Lokasi</label>
                            <input
                                type="text"
                                value={lokasi()}
                                onInput={(e) => setLokasi(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5 col-span-2">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Nomor Kontrak</label>
                            <input
                                type="text"
                                value={nomorKontrak()}
                                onInput={(e) => setNomorKontrak(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Start</label>
                            <input
                                type="date"
                                value={startDate()}
                                onChange={(e) => setStartDate(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">End</label>
                            <input
                                type="date"
                                value={endDate()}
                                onChange={(e) => setEndDate(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Maximal Budget</label>
                            <input
                                type="number"
                                value={maximalBudget()}
                                onInput={(e) => setMaximalBudget(Number(e.currentTarget.value))}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-mono"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Cost Estimated</label>
                            <input
                                type="number"
                                value={costEstimated()}
                                onInput={(e) => setCostEstimated(Number(e.currentTarget.value))}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all font-mono"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Pemberi Tugas</label>
                            <input
                                type="text"
                                value={pemberiTugas()}
                                onInput={(e) => setPemberiTugas(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Penerima Tugas</label>
                            <input
                                type="text"
                                value={penerimaTugas()}
                                onInput={(e) => setPenerimaTugas(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <h4 class="text-sm font-bold text-white uppercase tracking-widest">Team</h4>
                            <button
                                onClick={handleAddPersonnel}
                                class="text-[10px] font-bold bg-white text-black px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-1.5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14" /></svg>
                                Add
                            </button>
                        </div>
                        <div class="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            <For each={team()}>
                                {(person) => (
                                    <div class="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-xs font-bold">
                                                {person.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p class="text-xs font-bold text-white tracking-tight">{person.name}</p>
                                                <p class="text-[9px] text-gray-500 uppercase font-black">{person.role}</p>
                                            </div>
                                        </div>
                                        <button class="text-gray-600 hover:text-red-400 p-1 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                )}
                            </For>
                            <Show when={team().length === 0}>
                                <div class="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl text-gray-600">
                                    <p class="text-[10px] font-bold uppercase tracking-widest">No personnel added</p>
                                </div>
                            </Show>
                        </div>
                    </div>
                </div>

                <footer class="p-6 border-t border-white/5 flex gap-3">
                    <button
                        onClick={props.onCancel}
                        class="flex-1 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-gray-400 transition-all border border-white/5 uppercase tracking-widest text-[10px]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        class="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
                    >
                        Save Site
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CreateSiteModal;
