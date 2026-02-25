import { createSignal, createResource, Show } from 'solid-js';
import type { Component } from 'solid-js';
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import PersonModal from './components/PersonModal';
import type { Person, CreatePersonRequest } from '../../../../domain/entities/person.entity';
import { peopleRepository } from '../../../../infrastructure/repositories/people.repository.impl';

const fetchPeople = async (): Promise<Person[]> => {
    return peopleRepository.findAll();
};

const PeoplePage: Component = () => {
    const [people, { refetch }] = createResource(fetchPeople);
    const [searchTerm, setSearchTerm] = createSignal('');
    const [isModalOpen, setIsModalOpen] = createSignal(false);
    const [editingPerson, setEditingPerson] = createSignal<Person | null>(null);
    const [saving, setSaving] = createSignal(false);

    const handleAdd = () => {
        setEditingPerson(null);
        setIsModalOpen(true);
    };

    const handleEdit = (person: Person) => {
        setEditingPerson(person);
        setIsModalOpen(true);
    };

    const handleSave = async (payload: CreatePersonRequest) => {
        setSaving(true);
        try {
            await peopleRepository.create(payload);
            setIsModalOpen(false);
            refetch();
        } catch (err) {
            console.error('Failed to save person:', err);
            alert('Gagal menyimpan data. Silakan coba lagi.');
        } finally {
            setSaving(false);
        }
    };

    const columnDefs = [
        {
            field: 'name',
            headerName: 'Nama',
            flex: 1.5,
            minWidth: 200,
            cellRenderer: (params: any) => {
                const person = params.data as Person;
                const initial = person.name?.charAt(0) || '?';
                return (
                    <div class="flex items-center gap-3 py-2">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm uppercase border border-blue-100/50 shrink-0 overflow-hidden">
                            {person.foto_diri
                                ? <img src={person.foto_diri} alt={person.name} class="w-full h-full object-cover" />
                                : initial
                            }
                        </div>
                        <div class="min-w-0">
                            <div class="font-bold text-slate-800 leading-tight truncate">{person.name}</div>
                            <div class="text-[10px] text-slate-400 mt-0.5">
                                {person.jenis_kelamin || ''}
                                {person.tempat_lahir ? ` • ${person.tempat_lahir}` : ''}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            field: 'email',
            headerName: 'Kontak',
            flex: 1.2,
            minWidth: 180,
            cellRenderer: (params: any) => {
                const person = params.data as Person;
                return (
                    <div class="flex flex-col justify-center h-full gap-0.5">
                        <div class="text-xs font-medium text-slate-700 truncate">{person.email || '-'}</div>
                        {person.no_hp && <div class="text-[11px] text-slate-400 font-mono tracking-tight">{person.no_hp}</div>}
                    </div>
                );
            }
        },
        {
            field: 'jabatan_kerja',
            headerName: 'Jabatan',
            flex: 1,
            minWidth: 160,
            cellRenderer: (params: any) => {
                const person = params.data as Person;
                return (
                    <div class="flex flex-col justify-center h-full gap-1 mt-2">
                        {person.jabatan_kerja
                            ? <span class="inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border bg-blue-50 text-blue-700 border-blue-100 w-fit">{person.jabatan_kerja}</span>
                            : <span class="text-slate-400 italic text-xs">-</span>
                        }
                        {person.pekerjaan && <div class="text-[11px] text-slate-500 mt-[-12px]">{person.pekerjaan}</div>}
                    </div>
                );
            }
        },
        {
            field: 'regional',
            headerName: 'Regional',
            flex: 0.8,
            minWidth: 130,
            cellRenderer: (params: any) => {
                const person = params.data as Person;
                return (
                    <div class="flex flex-col justify-center h-full gap-0.5">
                        <div class="text-xs font-semibold text-slate-700">{person.regional || '-'}</div>
                        {person.lokasi_kerja && <div class="text-[11px] text-slate-400">{person.lokasi_kerja}</div>}
                    </div>
                );
            }
        },
        {
            field: 'no_ktp',
            headerName: 'No. KTP',
            flex: 1,
            minWidth: 170,
            cellRenderer: (params: any) => {
                return (
                    <div class="flex items-center h-full">
                        <span class="font-mono text-xs text-slate-500 tracking-tight">{params.value || '-'}</span>
                    </div>
                );
            }
        },
        {
            headerName: 'Aksi',
            width: 150,
            sortable: false,
            filter: false,
            cellRenderer: (params: any) => {
                const person = params.data as Person;
                return (
                    <div class="flex items-center justify-center h-full gap-1.5">
                        <button onClick={() => handleEdit(person)} class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100" title="View">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </button>
                        <button onClick={() => handleEdit(person)} class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-all border border-slate-100" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                        </button>
                        <button onClick={() => { if (confirm(`Hapus data ${person.name}?`)) console.log('delete', person.id); }} class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100" title="Delete">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                    </div>
                );
            }
        }
    ];

    const gridOptions = {
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true,
        },
        rowHeight: 88,
        headerHeight: 52,
        animateRows: true,
        pagination: true,
        paginationPageSize: 20,
    };

    return (
        <div class="space-y-8 animate-in fade-in duration-500">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 class="text-4xl font-bold tracking-tight text-slate-900 font-display">People Management</h1>
                    <p class="text-slate-500 mt-2 font-medium">Kelola data karyawan, teknisi, dan personil lapangan.</p>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        onClick={() => refetch()}
                        class="bg-white hover:bg-slate-50 text-slate-600 px-5 py-3 rounded-xl font-bold transition-all border border-slate-200 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>
                        Refresh
                    </button>
                    <button
                        onClick={handleAdd}
                        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7v14" /></svg>
                        Tambah Person
                    </button>
                </div>
            </header>

            {/* Main Content Card */}
            <div class="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm p-6 space-y-6">
                {/* Search Bar */}
                <div class="relative w-full max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama, email, KTP, jabatan, regional..."
                        value={searchTerm()}
                        onInput={(e) => setSearchTerm(e.currentTarget.value)}
                        class="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-600 text-sm"
                    />
                </div>

                {/* Loading State */}
                <Show when={people.loading}>
                    <div class="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                        <div class="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <p class="text-sm font-medium">Memuat data...</p>
                    </div>
                </Show>

                {/* Error State */}
                <Show when={people.error}>
                    <div class="flex flex-col items-center justify-center py-20 text-red-400 gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        <p class="text-sm font-medium text-slate-600">Gagal memuat data</p>
                        <p class="text-xs text-slate-400">{String(people.error)}</p>
                        <button onClick={() => refetch()} class="mt-2 px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors">Coba Lagi</button>
                    </div>
                </Show>

                {/* AG Grid Table */}
                <Show when={!people.loading && !people.error}>
                    <div class="ag-theme-alpine w-full" style={{
                        'height': '600px',
                        '--ag-background-color': 'transparent',
                        '--ag-odd-row-background-color': '#f8fafc',
                        '--ag-header-background-color': '#ffffff',
                        '--ag-border-color': '#f1f5f9',
                        '--ag-row-hover-color': '#eff6ff',
                        '--ag-selected-row-background-color': '#dbeafe',
                        '--ag-font-family': "'Poppins', sans-serif",
                        '--ag-font-size': '13px',
                    }}>
                        <AgGridSolid
                            columnDefs={columnDefs}
                            rowData={people() || []}
                            gridOptions={gridOptions}
                            quickFilterText={searchTerm()}
                        />
                    </div>
                </Show>
            </div>

            <PersonModal
                isOpen={isModalOpen()}
                onClose={() => setIsModalOpen(false)}
                person={editingPerson()}
                onSave={handleSave}
                saving={saving()}
            />
        </div>
    );
};

export default PeoplePage;
