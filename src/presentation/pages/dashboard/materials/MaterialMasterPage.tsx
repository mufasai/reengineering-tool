import { createSignal, createMemo, Show, For } from 'solid-js';
import type { Component } from 'solid-js';
import type { MaterialMaster, CreateMaterialMasterRequest } from '../../../../domain/entities/material.entity';

// Icons as inline SVGs
const SearchIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const PlusIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14m-7-7v14" />
    </svg>
);

const UploadIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const CameraIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
    </svg>
);

const Edit2Icon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

const ArchiveIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect width="18" height="5" x="3" y="3" />
        <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
);

const ActivityIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

const LinkIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const InfoIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
    </svg>
);

// Helper function for class names
const clsx = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
};

// Mock data - replace with actual API calls
const mockMaterialMasterRecords: MaterialMaster[] = [
    {
        id: '1',
        kode_material: 'MT-001',
        nama_material: 'Semen Portland',
        kategori: 'Sipil',
        spesifikasi: '50kg',
        satuan: 'ZAK',
        harga_satuan: 65000,
        status_aktif: true
    },
    {
        id: '2',
        kode_material: 'MT-002',
        nama_material: 'Besi Beton D13',
        kategori: 'Sipil',
        spesifikasi: 'Ulir 12m',
        satuan: 'Btg',
        harga_satuan: 115000,
        status_aktif: true
    },
    {
        id: '3',
        kode_material: 'MT-003',
        nama_material: 'Filter LTE 900 MHz',
        kategori: 'Telecom',
        spesifikasi: '900MHz Bandpass',
        satuan: 'pcs',
        harga_satuan: 2500000,
        status_aktif: true
    },
    {
        id: '4',
        kode_material: 'MT-004',
        nama_material: 'Cable RG-6',
        kategori: 'Telecom',
        spesifikasi: 'Coaxial 500hm',
        satuan: 'm',
        harga_satuan: 25000,
        status_aktif: true
    },
    {
        id: '5',
        kode_material: 'Pipa PVC',
        nama_material: 'Pipa PVC',
        kategori: 'Sipil',
        spesifikasi: '3 inch',
        satuan: 'Btg',
        harga_satuan: 75000,
        status_aktif: false
    }
];

// Mock site materials for usage calculation
const mockSiteMaterials = [
    { material_master_id: '1', siteId: 'site1', quantity: 100 },
    { material_master_id: '2', siteId: 'site1', quantity: 50 },
    { material_master_id: '3', siteId: 'site2', quantity: 10 },
];

const MaterialMasterPage: Component = () => {
    const [searchQuery, setSearchQuery] = createSignal('');
    const [categoryFilter, setCategoryFilter] = createSignal('Semua');
    const [statusFilter, setStatusFilter] = createSignal<'Semua' | 'Aktif' | 'Nonaktif'>('Semua');
    const [isModalOpen, setIsModalOpen] = createSignal(false);
    const [modalMode, setModalMode] = createSignal<'manual' | 'excel' | 'ocr'>('manual');

    const handleOpenModal = (mode: 'manual' | 'excel' | 'ocr') => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    // Calculate usage
    const getUsageCount = (materialId: string) => {
        return mockSiteMaterials.filter(sm => sm.material_master_id === materialId).length;
    };

    // Derived states
    const categories = createMemo(() => {
        const cats = new Set(mockMaterialMasterRecords.map(m => m.kategori).filter(Boolean) as string[]);
        return ['Semua', ...Array.from(cats)];
    });

    const filteredRecords = createMemo(() => {
        return mockMaterialMasterRecords.filter(m => {
            const matchesSearch = (m.nama_material.toLowerCase().includes(searchQuery().toLowerCase())) ||
                (m.kode_material?.toLowerCase().includes(searchQuery().toLowerCase()));
            const matchesCat = categoryFilter() === 'Semua' || m.kategori === categoryFilter();
            const matchesStatus = statusFilter() === 'Semua' ||
                (statusFilter() === 'Aktif' && m.status_aktif) ||
                (statusFilter() === 'Nonaktif' && !m.status_aktif);
            return matchesSearch && matchesCat && matchesStatus;
        });
    });

    // Summary Strip calculations
    const sumActive = createMemo(() => mockMaterialMasterRecords.filter(m => m.status_aktif).length);
    const sumCategories = createMemo(() => categories().length - 1); // excluding 'Semua'
    const sumUsedActive = createMemo(() => new Set(mockSiteMaterials.map(sm => sm.siteId)).size);

    const formatRupiah = (val: number | null | undefined) => {
        if (val == null) return '—';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(val);
    };

    return (
        <div class="p-6 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Page Header */}
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-slate-800">Material Master</h1>
                    <p class="text-sm text-slate-500 mt-1">Daftar referensi material standar</p>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenModal('ocr')}
                        class="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors text-sm shadow-sm"
                    >
                        <CameraIcon class="w-4 h-4" /> Scan OCR
                    </button>
                    <button
                        onClick={() => handleOpenModal('excel')}
                        class="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors text-sm shadow-sm"
                    >
                        <UploadIcon class="w-4 h-4" /> Import Excel
                    </button>
                    <button
                        onClick={() => handleOpenModal('manual')}
                        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm shadow-sm shadow-blue-600/20"
                    >
                        <PlusIcon class="w-4 h-4" /> Tambah Manual
                    </button>
                </div>
            </div>

            {/* Summary Strip */}
            <div class="bg-slate-100 rounded-lg p-3 px-5 mb-6 text-sm font-medium text-slate-600 flex items-center justify-center border border-slate-200">
                <span class="text-blue-700 font-bold">{sumActive()}</span>
                <span class="ml-1 mr-3">material aktif</span> •
                <span class="text-blue-700 font-bold ml-3">{sumCategories()}</span>
                <span class="ml-1 mr-3">kategori</span> •
                <span class="text-blue-700 font-bold ml-3">{sumUsedActive()}</span>
                <span class="ml-1">berbagai site aktif sedang digunakan</span>
            </div>

            {/* Filters */}
            <div class="flex flex-col md:flex-row gap-4 mb-6">
                <div class="relative flex-1 max-w-sm">
                    <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau kode..."
                        value={searchQuery()}
                        onInput={(e) => setSearchQuery(e.currentTarget.value)}
                        class="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:font-normal"
                    />
                </div>
                <div class="flex gap-4 flex-1">
                    <select
                        value={categoryFilter()}
                        onChange={(e) => setCategoryFilter(e.currentTarget.value)}
                        class="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
                    >
                        <For each={categories()}>
                            {(c) => <option value={c}>{c}</option>}
                        </For>
                    </select>
                    <div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <For each={['Semua', 'Aktif', 'Nonaktif'] as const}>
                            {(s) => (
                                <button
                                    onClick={() => setStatusFilter(s)}
                                    class={clsx(
                                        "px-4 py-1 text-sm font-medium rounded-md transition-colors",
                                        statusFilter() === s
                                            ? "bg-white text-slate-800 shadow-sm border border-slate-200/50"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {s}
                                </button>
                            )}
                        </For>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div class="bg-white border text-sm border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th class="p-4 font-semibold text-slate-600 whitespace-nowrap">Kode</th>
                                <th class="p-4 font-semibold text-slate-600">Nama Material</th>
                                <th class="p-4 font-semibold text-slate-600">Kategori</th>
                                <th class="p-4 font-semibold text-slate-600">Spesifikasi</th>
                                <th class="p-4 font-semibold text-slate-600 whitespace-nowrap">Satuan</th>
                                <th class="p-4 font-semibold text-slate-600 whitespace-nowrap text-right">Harga Satuan</th>
                                <th class="p-4 font-semibold text-slate-600 text-center">Digunakan</th>
                                <th class="p-4 font-semibold text-slate-600">Status</th>
                                <th class="p-4 font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <For each={filteredRecords()}>
                                {(item) => {
                                    const usage = getUsageCount(item.id);
                                    return (
                                        <tr class="hover:bg-slate-50/50 transition-colors">
                                            <td class="p-4 whitespace-nowrap">
                                                <Show
                                                    when={item.kode_material}
                                                    fallback={<span class="text-slate-300">—</span>}
                                                >
                                                    <span class="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs select-all">
                                                        {item.kode_material}
                                                    </span>
                                                </Show>
                                            </td>
                                            <td class="p-4 font-medium text-slate-800">{item.nama_material}</td>
                                            <td class="p-4 text-slate-600">
                                                <Show when={item.kategori} fallback={<span class="text-slate-300">—</span>}>
                                                    {item.kategori}
                                                </Show>
                                            </td>
                                            <td class="p-4 text-slate-600">
                                                <Show when={item.spesifikasi} fallback={<span class="text-slate-300">—</span>}>
                                                    {item.spesifikasi}
                                                </Show>
                                            </td>
                                            <td class="p-4 text-slate-600 whitespace-nowrap">
                                                <Show when={item.satuan} fallback={<span class="text-slate-300">—</span>}>
                                                    {item.satuan}
                                                </Show>
                                            </td>
                                            <td class="p-4 text-right whitespace-nowrap">
                                                <span class={item.harga_satuan ? "font-mono text-slate-700" : "text-slate-300"}>
                                                    {formatRupiah(item.harga_satuan)}
                                                </span>
                                            </td>
                                            <td class="p-4 text-center">
                                                <button class={clsx(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors",
                                                    usage > 0
                                                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                        : "bg-slate-100 text-slate-500 cursor-default"
                                                )}>
                                                    {usage}
                                                    <Show when={usage > 0}>
                                                        <LinkIcon class="w-3 h-3" />
                                                    </Show>
                                                </button>
                                            </td>
                                            <td class="p-4 whitespace-nowrap">
                                                <div class="flex items-center gap-2">
                                                    <div class={clsx(
                                                        "w-2 h-2 rounded-full",
                                                        item.status_aktif ? "bg-emerald-500" : "bg-slate-300"
                                                    )} />
                                                    <span class={clsx(
                                                        "text-xs font-semibold uppercase tracking-wider",
                                                        item.status_aktif ? "text-emerald-700" : "text-slate-500"
                                                    )}>
                                                        {item.status_aktif ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td class="p-4 text-right whitespace-nowrap">
                                                <button class="p-1.5 text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                                                    <Edit2Icon class="w-4 h-4" />
                                                </button>
                                                <button
                                                    class="p-1.5 text-slate-400 hover:text-red-600 transition-colors ml-1"
                                                    title={item.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                                                >
                                                    <Show
                                                        when={item.status_aktif}
                                                        fallback={<ActivityIcon class="w-4 h-4" />}
                                                    >
                                                        <ArchiveIcon class="w-4 h-4" />
                                                    </Show>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }}
                            </For>
                            <Show when={filteredRecords().length === 0}>
                                <tr>
                                    <td colSpan={9} class="p-8 text-center text-slate-500">
                                        <div class="flex flex-col items-center justify-center">
                                            <InfoIcon class="w-8 h-8 text-slate-300 mb-2" />
                                            <p>Tidak ada material yang ditemukan.</p>
                                        </div>
                                    </td>
                                </tr>
                            </Show>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Placeholder */}
            <Show when={isModalOpen()}>
                <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 class="text-lg font-bold text-slate-800 mb-4">
                            {modalMode() === 'manual' ? 'Tambah Material Manual' :
                                modalMode() === 'excel' ? 'Import Excel' : 'Scan OCR'}
                        </h3>
                        <p class="text-slate-600 mb-6">
                            Fitur {modalMode()} akan segera tersedia.
                        </p>
                        <div class="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default MaterialMasterPage;