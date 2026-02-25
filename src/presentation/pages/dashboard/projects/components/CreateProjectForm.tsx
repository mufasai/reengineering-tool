import { createSignal, createEffect, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { Project } from '../../../../../domain/entities/project.entity';

interface CreateProjectFormProps {
    onSave: (data: any) => void;
    onCancel: () => void;
    submitting?: boolean;
    project?: Project | null;
}

const CreateProjectForm: Component<CreateProjectFormProps> = (props) => {
    const [name, setName] = createSignal('');
    const [lokasi, setLokasi] = createSignal('');
    const [value, setValue] = createSignal(0);
    const [cost, setCost] = createSignal(0);
    const [tipe, setTipe] = createSignal('COMBAT');
    const [keterangan, setKeterangan] = createSignal('');
    const [tStart, setTStart] = createSignal('');
    const [tEnd, setTEnd] = createSignal('');
    const [status, setStatus] = createSignal('active');

    const isEditing = () => !!props.project;

    // Pre-fill form when editing
    createEffect(() => {
        const p = props.project;
        if (p) {
            setName(p.name || '');
            setLokasi(p.lokasi || '');
            setValue(p.value || 0);
            setCost(p.cost || 0);
            setTipe(p.tipe || 'COMBAT');
            setKeterangan(p.keterangan || '');
            setTStart(p.tgi_start || '');
            setTEnd(p.tgi_end || '');
            setStatus(p.status || 'active');
        } else {
            setName('');
            setLokasi('');
            setValue(0);
            setCost(0);
            setTipe('COMBAT');
            setKeterangan('');
            setTStart('');
            setTEnd('');
            setStatus('active');
        }
    });

    const formatCurrency = (val: number | string) => {
        if (!val && val !== 0) return '';
        const num = typeof val === 'string' ? val.replace(/\D/g, '') : val.toString();
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const parseCurrency = (val: string) => {
        return Number(val.replace(/\./g, '')) || 0;
    };

    const handleSave = () => {
        props.onSave({
            name: name(),
            lokasi: lokasi(),
            value: value(),
            cost: cost(),
            tipe: tipe(),
            keterangan: keterangan(),
            tgi_start: tStart(),
            tgi_end: tEnd(),
            status: status()
        });
    };

    return (
        <div class="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Project Details Section */}
            <section class="bg-white border border-slate-200 rounded-[32px] p-8 space-y-6 shadow-sm">
                <header>
                    <h3 class="text-xl font-bold text-slate-900 uppercase tracking-tight">Project Information</h3>
                    <p class="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Basic project data</p>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Project Name</label>
                            <input
                                type="text"
                                value={name()}
                                onInput={(e) => setName(e.currentTarget.value)}
                                placeholder="e.g. L2H Project Surabaya"
                                class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 font-medium text-sm"
                            />
                        </div>

                        <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Location</label>
                            <input
                                type="text"
                                value={lokasi()}
                                onInput={(e) => setLokasi(e.currentTarget.value)}
                                placeholder="e.g. Surabaya"
                                class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 font-medium text-sm"
                            />
                        </div>

                        <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Type</label>
                            <select
                                value={tipe()}
                                onChange={(e) => setTipe(e.currentTarget.value)}
                                class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm appearance-none"
                            >
                                <option value="COMBAT">COMBAT</option>
                                <option value="L2H">L2H</option>
                                <option value="BLACK SITE">BLACK SITE</option>
                                <option value="REFINEN">REFINEN</option>
                                <option value="FILTER">FILTER</option>
                                <option value="BEBAN OPERASIONAL">BEBAN OPERASIONAL</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Status</label>
                            <select
                                value={status()}
                                onChange={(e) => setStatus(e.currentTarget.value)}
                                class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm appearance-none"
                            >
                                <option value="active">Active</option>
                                <option value="on_hold">On Hold</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Value (Rp)</label>
                            <div class="relative">
                                <input
                                    type="text"
                                    value={formatCurrency(value())}
                                    onInput={(e) => setValue(parseCurrency(e.currentTarget.value))}
                                    placeholder="0"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-medium text-sm"
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Cost (Rp)</label>
                            <div class="relative">
                                <input
                                    type="text"
                                    value={formatCurrency(cost())}
                                    onInput={(e) => setCost(parseCurrency(e.currentTarget.value))}
                                    placeholder="0"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-mono font-medium text-sm"
                                />
                            </div>
                        </div>

                        <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Tgl Start</label>
                            <input
                                type="date"
                                value={tStart()}
                                onInput={(e) => setTStart(e.currentTarget.value)}
                                class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm"
                            />
                        </div>

                        <div class="grid grid-cols-[120px_1fr] items-center gap-4">
                            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Tgl End</label>
                            <input
                                type="date"
                                value={tEnd()}
                                onInput={(e) => setTEnd(e.currentTarget.value)}
                                class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-[120px_1fr] gap-4 pt-4">
                    <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none pt-4">Description</label>
                    <textarea
                        value={keterangan()}
                        onInput={(e) => setKeterangan(e.currentTarget.value)}
                        placeholder="Enter project description..."
                        rows="3"
                        class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 font-medium text-sm resize-none"
                    />
                </div>
            </section>

            <footer class="flex items-center justify-between pt-10 border-t border-slate-100">
                <button
                    onClick={props.onCancel}
                    class="py-4 px-10 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all border border-slate-200 uppercase tracking-widest text-[10px]"
                >
                    Discard
                </button>
                <button
                    onClick={handleSave}
                    disabled={props.submitting}
                    class={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-16 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-widest text-[11px] flex items-center gap-2 ${props.submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Show when={props.submitting} fallback={isEditing() ? 'Update Project' : 'Create Project'}>
                        <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {isEditing() ? 'Updating...' : 'Creating...'}
                    </Show>
                </button>
            </footer>
        </div>
    );
};

export default CreateProjectForm;
