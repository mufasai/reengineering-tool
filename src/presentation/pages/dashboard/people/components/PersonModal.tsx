import { createSignal, createEffect, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { Person, CreatePersonRequest } from '../../../../../domain/entities/person.entity';

interface PersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    person: Person | null;
    onSave: (person: CreatePersonRequest) => void;
    saving: boolean;
}

const PersonModal: Component<PersonModalProps> = (props) => {
    const [name, setName] = createSignal('');
    const [tanggalLahir, setTanggalLahir] = createSignal('');
    const [tempatLahir, setTempatLahir] = createSignal('');
    const [agama, setAgama] = createSignal('');
    const [jenisKelamin, setJenisKelamin] = createSignal('');
    const [noKtp, setNoKtp] = createSignal('');
    const [noHp, setNoHp] = createSignal('');
    const [email, setEmail] = createSignal('');
    const [jabatanKerja, setJabatanKerja] = createSignal('');
    const [regional, setRegional] = createSignal('');
    const [lokasiKerja, setLokasiKerja] = createSignal('');
    const [pekerjaan, setPekerjaan] = createSignal('');

    createEffect(() => {
        if (props.person) {
            setName(props.person.name);
            setTanggalLahir(props.person.tanggal_lahir || '');
            setTempatLahir(props.person.tempat_lahir || '');
            setAgama(props.person.agama || '');
            setJenisKelamin(props.person.jenis_kelamin || '');
            setNoKtp(props.person.no_ktp || '');
            setNoHp(props.person.no_hp || '');
            setEmail(props.person.email || '');
            setJabatanKerja(props.person.jabatan_kerja || '');
            setRegional(props.person.regional || '');
            setLokasiKerja(props.person.lokasi_kerja || '');
            setPekerjaan(props.person.pekerjaan || '');
        } else {
            setName('');
            setTanggalLahir('');
            setTempatLahir('');
            setAgama('');
            setJenisKelamin('');
            setNoKtp('');
            setNoHp('');
            setEmail('');
            setJabatanKerja('');
            setRegional('');
            setLokasiKerja('');
            setPekerjaan('');
        }
    });

    const handleSubmit = (e: Event) => {
        e.preventDefault();
        const payload: CreatePersonRequest = {
            name: name(),
            tanggal_lahir: tanggalLahir() || undefined,
            tempat_lahir: tempatLahir() || undefined,
            agama: agama() || undefined,
            jenis_kelamin: jenisKelamin() || undefined,
            no_ktp: noKtp() || undefined,
            no_hp: noHp() || undefined,
            email: email() || undefined,
            jabatan_kerja: jabatanKerja() || undefined,
            regional: regional() || undefined,
            lokasi_kerja: lokasiKerja() || undefined,
            pekerjaan: pekerjaan() || undefined,
        };
        props.onSave(payload);
    };

    const agamaOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
    const jenisKelaminOptions = ['Laki-laki', 'Perempuan'];

    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium text-sm";
    const labelClass = "text-[10px] font-black text-slate-500 uppercase tracking-widest px-1";
    const selectClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm appearance-none";

    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                <div class="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
                    <header class="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                        <div>
                            <h2 class="text-2xl font-bold text-slate-800">
                                {props.person ? 'Edit Person' : 'Tambah Person Baru'}
                            </h2>
                            <p class="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Data Karyawan & Informasi Kerja</p>
                        </div>
                        <button
                            onClick={props.onClose}
                            class="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center border border-slate-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                    </header>

                    <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <form id="person-form" onSubmit={handleSubmit} class="space-y-10">
                            {/* Personal Info */}
                            <section class="space-y-6">
                                <header class="flex items-center gap-3 border-b border-slate-100 pb-3">
                                    <div class="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </div>
                                    <h3 class="text-sm font-black text-slate-500 uppercase tracking-widest">Data Pribadi</h3>
                                </header>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class={labelClass}>Nama Lengkap *</label>
                                        <input required value={name()} onInput={(e) => setName(e.currentTarget.value)} class={inputClass} placeholder="e.g. Budi Santoso" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class={labelClass}>No. KTP</label>
                                        <input value={noKtp()} onInput={(e) => setNoKtp(e.currentTarget.value)} class={inputClass} placeholder="16 digit NIK" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class={labelClass}>Tempat Lahir</label>
                                        <input value={tempatLahir()} onInput={(e) => setTempatLahir(e.currentTarget.value)} class={inputClass} placeholder="e.g. Jakarta" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class={labelClass}>Tanggal Lahir</label>
                                        <input type="date" value={tanggalLahir()} onInput={(e) => setTanggalLahir(e.currentTarget.value)} class={inputClass} />
                                    </div>
                                    <div class="space-y-2">
                                        <label class={labelClass}>Jenis Kelamin</label>
                                        <select value={jenisKelamin()} onChange={(e) => setJenisKelamin(e.currentTarget.value)} class={selectClass}>
                                            <option value="">-- Pilih --</option>
                                            {jenisKelaminOptions.map(jk => <option value={jk}>{jk}</option>)}
                                        </select>
                                    </div>
                                    <div class="space-y-2">
                                        <label class={labelClass}>Agama</label>
                                        <select value={agama()} onChange={(e) => setAgama(e.currentTarget.value)} class={selectClass}>
                                            <option value="">-- Pilih --</option>
                                            {agamaOptions.map(a => <option value={a}>{a}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Contact Info */}
                            <section class="space-y-6">
                                <header class="flex items-center gap-3 border-b border-slate-100 pb-3">
                                    <div class="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </div>
                                    <h3 class="text-sm font-black text-slate-500 uppercase tracking-widest">Kontak</h3>
                                </header>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class={labelClass}>Email</label>
                                        <input type="email" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} class={inputClass} placeholder="budi@smartelco.com" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class={labelClass}>No. Handphone</label>
                                        <input value={noHp()} onInput={(e) => setNoHp(e.currentTarget.value)} class={inputClass} placeholder="0812..." />
                                    </div>
                                </div>
                            </section>

                            {/* Work Info */}
                            <section class="space-y-6">
                                <header class="flex items-center gap-3 border-b border-slate-100 pb-3">
                                    <div class="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                    </div>
                                    <h3 class="text-sm font-black text-slate-500 uppercase tracking-widest">Informasi Kerja</h3>
                                </header>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-2">
                                        <label class={labelClass}>Jabatan Kerja</label>
                                        <input value={jabatanKerja()} onInput={(e) => setJabatanKerja(e.currentTarget.value)} class={inputClass} placeholder="e.g. Teknisi Senior" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class={labelClass}>Pekerjaan</label>
                                        <input value={pekerjaan()} onInput={(e) => setPekerjaan(e.currentTarget.value)} class={inputClass} placeholder="e.g. Instalasi Fiber" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class={labelClass}>Regional</label>
                                        <input value={regional()} onInput={(e) => setRegional(e.currentTarget.value)} class={inputClass} placeholder="e.g. Jakarta" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class={labelClass}>Lokasi Kerja</label>
                                        <input value={lokasiKerja()} onInput={(e) => setLokasiKerja(e.currentTarget.value)} class={inputClass} placeholder="e.g. Jakarta Pusat" />
                                    </div>
                                </div>
                            </section>
                        </form>
                    </div>

                    <footer class="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                        <button type="button" onClick={props.onClose} class="py-4 px-10 rounded-2xl font-bold bg-white text-slate-500 hover:bg-slate-50 transition-all border border-slate-200 uppercase tracking-widest text-[10px]">
                            Batal
                        </button>
                        <button
                            form="person-form"
                            type="submit"
                            disabled={props.saving}
                            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-16 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 uppercase tracking-widest text-[11px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                        >
                            <Show when={props.saving}>
                                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </Show>
                            {props.saving ? 'Menyimpan...' : (props.person ? 'Simpan Perubahan' : 'Tambah Person')}
                        </button>
                    </footer>
                </div>
            </div>
        </Show>
    );
};

export default PersonModal;
