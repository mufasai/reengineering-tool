import { createSignal, createMemo, Show, For } from 'solid-js';
import type { Component } from 'solid-js';
import type { MaterialMaster, Material } from '../../../../domain/entities/material.entity';
import ImportMaterialExcelModal from '../../../components/modals/ImportMaterialExcelModal';
import ImportResultModal from '../../../components/modals/ImportResultModal';
import { ImportMaterialExcelUseCase } from '../../../../application/use-cases/import-material-excel.use-case';
import { MaterialRepositoryImpl } from '../../../../infrastructure/repositories/material.repository.impl';
import { useMaterials } from '../../../hooks/useMaterials';
import { useProjects } from '../../../hooks/useProjects';
// import ImportResultModal from '../../../components/modals/ImportResultModal';
// import { ImportMaterialExcelUseCase } from '../../../../application/use-cases/import-material-excel.use-case';
// import { MaterialRepositoryImpl } from '../../../../infrastructure/repositories/material.repository.impl';

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

const MaterialMasterPage: Component = () => {
    const [searchQuery, setSearchQuery] = createSignal('');
    const [categoryFilter, setCategoryFilter] = createSignal('Semua');
    const [statusFilter, setStatusFilter] = createSignal<'Semua' | 'Aktif' | 'Nonaktif' | 'Master' | 'Manual'>('Semua');
    const [isModalOpen, setIsModalOpen] = createSignal(false);
    const [modalMode, setModalMode] = createSignal<'manual' | 'excel' | 'ocr'>('manual');
    const [isImportModalOpen, setIsImportModalOpen] = createSignal(false);
    const [isResultModalOpen, setIsResultModalOpen] = createSignal(false);
    const [importResult, setImportResult] = createSignal<{
        success: boolean;
        message: string;
        imported_count: number;
        failed_count: number;
        errors?: string[];
    } | null>(null);

    // Initialize use case and hooks
    const materialRepository = new MaterialRepositoryImpl();
    const importMaterialExcelUseCase = new ImportMaterialExcelUseCase(materialRepository);
    const { materials, loading, error, refetch } = useMaterials();
    const { projects } = useProjects();

    // Helper function to get project name
    const getProjectName = (projectId: string) => {
        const project = projects().find(p => p.id === projectId);
        return project?.name || projectId;
    };

    const handleOpenModal = (mode: 'manual' | 'excel' | 'ocr') => {
        if (mode === 'excel') {
            setIsImportModalOpen(true);
        } else {
            setModalMode(mode);
            setIsModalOpen(true);
        }
    };

    const handleImportExcel = async (file: File, projectId: string) => {
        try {
            const result = await importMaterialExcelUseCase.execute({
                file,
                project_id: projectId
            });

            setImportResult(result);
            setIsImportModalOpen(false);
            setIsResultModalOpen(true);

            // Refresh data after successful import
            if (result.success) {
                refetch();
            }
        } catch (error) {
            console.error('Import error:', error);
            setImportResult({
                success: false,
                message: 'Terjadi kesalahan saat import',
                imported_count: 0,
                failed_count: 0,
                errors: [error instanceof Error ? error.message : 'Unknown error']
            });
            setIsImportModalOpen(false);
            setIsResultModalOpen(true);
        }
    };

    // Calculate usage - now using real materials data
    const getUsageCount = (materialId: string) => {
        // For now, return 0 since we don't have usage tracking data
        // This can be implemented when usage tracking API is available
        return 0;
    };

    // Convert Material to MaterialMaster-like structure for display
    const convertMaterialToMasterView = (material: Material) => ({
        id: material.id,
        kode_material: material.skp || undefined,
        nama_material: material.name,
        kategori: material.material_type || 'Manual',
        spesifikasi: material.spesifikasi || undefined,
        satuan: material.unit,
        harga_satuan: material.harga_satuan || undefined,
        status_aktif: true, // All materials from API are considered active
        source_master: material.source_master,
        project_name: getProjectName(material.project_id),
        site_id: material.site_id,
        qty: material.qty,
        tgl: material.tgl,
        vendor: material.vendor,
        direction: material.direction,
        delivery_note_no: material.delivery_note_no,
        po_delivery_date: material.po_delivery_date, // This is actually PO number
        sender: material.sender,
        receiver: material.receiver,
        keterangan: material.keterangan,
        material_master_id: material.material_master_id
    });

    // Use only real materials data from API
    const allMaterials = createMemo(() => {
        const apiMaterials = materials().map(convertMaterialToMasterView);
        return apiMaterials;
    });

    // Derived states - updated to use combined data
    const categories = createMemo(() => {
        const cats = new Set(allMaterials().map(m => m.kategori).filter(Boolean) as string[]);
        return ['Semua', ...Array.from(cats)];
    });

    const filteredRecords = createMemo(() => {
        return allMaterials().filter(m => {
            const matchesSearch = (m.nama_material.toLowerCase().includes(searchQuery().toLowerCase())) ||
                (m.kode_material?.toLowerCase().includes(searchQuery().toLowerCase()));
            const matchesCat = categoryFilter() === 'Semua' || m.kategori === categoryFilter();

            let matchesStatus = true;
            if (statusFilter() === 'Aktif') {
                matchesStatus = m.status_aktif;
            } else if (statusFilter() === 'Nonaktif') {
                matchesStatus = !m.status_aktif;
            } else if (statusFilter() === 'Master') {
                matchesStatus = (m as any).source_master === true;
            } else if (statusFilter() === 'Manual') {
                matchesStatus = (m as any).source_master === false;
            }

            return matchesSearch && matchesCat && matchesStatus;
        });
    });

    // Summary Strip calculations - updated for API data only
    const sumActive = createMemo(() => allMaterials().filter(m => m.status_aktif).length);
    const sumCategories = createMemo(() => categories().length - 1); // excluding 'Semua'
    const sumFromMaster = createMemo(() => materials().filter(m => m.source_master).length);
    const totalMaterials = createMemo(() => allMaterials().length);

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
                    <p class="text-sm text-slate-500 mt-1">Daftar referensi material standar dan material project</p>
                </div>
                <div class="flex items-center gap-3">
                    <button
                        onClick={refetch}
                        disabled={loading()}
                        class="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors text-sm shadow-sm disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class={`w-4 h-4 ${loading() ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M3 21v-5h5" />
                        </svg>
                        Refresh
                    </button>
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
                <span class="text-blue-700 font-bold">{totalMaterials()}</span>
                <span class="ml-1 mr-3">total material</span> •
                <span class="text-blue-700 font-bold ml-3">{sumCategories()}</span>
                <span class="ml-1 mr-3">kategori</span> •
                <span class="text-blue-700 font-bold ml-3">{sumFromMaster()}</span>
                <span class="ml-1">dari material master</span>
            </div>

            {/* Error State */}
            <Show when={error()}>
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div class="flex items-center gap-2 text-red-800">
                        <InfoIcon class="w-5 h-5" />
                        <span class="font-medium">Error: {error()}</span>
                    </div>
                </div>
            </Show>

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
                        <For each={['Semua', 'Aktif', 'Nonaktif', 'Master', 'Manual'] as const}>
                            {(s) => (
                                <button
                                    onClick={() => setStatusFilter(s)}
                                    class={clsx(
                                        "px-3 py-1 text-sm font-medium rounded-md transition-colors",
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

            {/* Loading State */}
            <Show when={loading()}>
                <div class="flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span class="ml-3 text-slate-600">Memuat data material...</span>
                </div>
            </Show>

            {/* Table */}
            <Show when={!loading()}>
                <div class="bg-white border text-sm border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th class="p-4 font-semibold text-slate-600 whitespace-nowrap">Kode/SKP</th>
                                    <th class="p-4 font-semibold text-slate-600">Nama Material</th>
                                    <th class="p-4 font-semibold text-slate-600">Kategori/Type</th>
                                    <th class="p-4 font-semibold text-slate-600">Spesifikasi</th>
                                    <th class="p-4 font-semibold text-slate-600 whitespace-nowrap">Satuan</th>
                                    <th class="p-4 font-semibold text-slate-600 whitespace-nowrap text-right">Harga Satuan</th>
                                    <th class="p-4 font-semibold text-slate-600 whitespace-nowrap text-right">Qty</th>
                                    <th class="p-4 font-semibold text-slate-600">Direction</th>
                                    <th class="p-4 font-semibold text-slate-600">Delivery Note</th>
                                    <th class="p-4 font-semibold text-slate-600">PO Number</th>
                                    <th class="p-4 font-semibold text-slate-600">Site ID</th>
                                    <th class="p-4 font-semibold text-slate-600">Sender</th>
                                    <th class="p-4 font-semibold text-slate-600">Receiver</th>
                                    <th class="p-4 font-semibold text-slate-600">Keterangan</th>
                                    <th class="p-4 font-semibold text-slate-600">Tanggal</th>
                                    <th class="p-4 font-semibold text-slate-600 text-center">Source</th>
                                    <th class="p-4 font-semibold text-slate-600">Project</th>
                                    <th class="p-4 font-semibold text-slate-600">Status</th>
                                    <th class="p-4 font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <For each={filteredRecords()}>
                                    {(item) => {
                                        const usage = getUsageCount(item.id);
                                        const isFromAPI = (item as any).source_master !== undefined;
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
                                                <td class="p-4">
                                                    <div class="font-medium text-slate-800">{item.nama_material}</div>
                                                    <Show when={isFromAPI && (item as any).qty}>
                                                        <div class="text-xs text-slate-500 mt-1">Qty: {(item as any).qty?.toLocaleString()}</div>
                                                    </Show>
                                                </td>
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
                                                {/* Qty - New Column */}
                                                <td class="p-4 text-right whitespace-nowrap">
                                                    <Show when={isFromAPI && (item as any).qty} fallback={<span class="text-slate-300">—</span>}>
                                                        <span class="font-mono text-slate-700">{(item as any).qty?.toLocaleString()}</span>
                                                    </Show>
                                                </td>
                                                {/* Direction - New Column */}
                                                <td class="p-4 text-slate-600">
                                                    <Show when={isFromAPI && (item as any).direction} fallback={<span class="text-slate-300">—</span>}>
                                                        {(item as any).direction}
                                                    </Show>
                                                </td>
                                                {/* Delivery Note - New Column */}
                                                <td class="p-4 text-slate-600">
                                                    <Show when={isFromAPI && (item as any).delivery_note_no} fallback={<span class="text-slate-300">—</span>}>
                                                        <span class="font-mono text-xs">{(item as any).delivery_note_no}</span>
                                                    </Show>
                                                </td>
                                                {/* PO Number - Updated Column */}
                                                <td class="p-4 text-slate-600 whitespace-nowrap">
                                                    <Show when={isFromAPI && (item as any).po_delivery_date} fallback={<span class="text-slate-300">—</span>}>
                                                        <span class="font-mono text-xs">{(item as any).po_delivery_date}</span>
                                                    </Show>
                                                </td>

                                                {/* Site ID - New Column */}
                                                <td class="p-4 text-slate-600">
                                                    <Show when={isFromAPI && (item as any).site_id} fallback={<span class="text-slate-300">—</span>}>
                                                        <span class="font-mono text-xs">{(item as any).site_id}</span>
                                                    </Show>
                                                </td>
                                                {/* Sender - New Column */}
                                                <td class="p-4 text-slate-600 max-w-[120px]">
                                                    <Show when={isFromAPI && (item as any).sender} fallback={<span class="text-slate-300">—</span>}>
                                                        <div class="truncate" title={(item as any).sender}>{(item as any).sender}</div>
                                                    </Show>
                                                </td>
                                                {/* Receiver - New Column */}
                                                <td class="p-4 text-slate-600 max-w-[120px]">
                                                    <Show when={isFromAPI && (item as any).receiver} fallback={<span class="text-slate-300">—</span>}>
                                                        <div class="truncate" title={(item as any).receiver}>{(item as any).receiver}</div>
                                                    </Show>
                                                </td>
                                                {/* Keterangan - New Column */}
                                                <td class="p-4 text-slate-600 max-w-[150px]">
                                                    <Show when={isFromAPI && (item as any).keterangan} fallback={<span class="text-slate-300">—</span>}>
                                                        <div class="truncate" title={(item as any).keterangan}>{(item as any).keterangan}</div>
                                                    </Show>
                                                </td>
                                                {/* Tanggal - New Column */}
                                                <td class="p-4 text-slate-600 whitespace-nowrap">
                                                    <Show when={isFromAPI && (item as any).tgl} fallback={<span class="text-slate-300">—</span>}>
                                                        {(() => {
                                                            try {
                                                                return new Date((item as any).tgl).toLocaleDateString('id-ID');
                                                            } catch {
                                                                return (item as any).tgl;
                                                            }
                                                        })()}
                                                    </Show>
                                                </td>
                                                <td class="p-4 text-center">
                                                    <Show
                                                        when={isFromAPI}
                                                        fallback={
                                                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                                Master
                                                            </span>
                                                        }
                                                    >
                                                        <span class={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${(item as any).source_master
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {(item as any).source_master ? 'Master' : 'Manual'}
                                                        </span>
                                                    </Show>
                                                </td>
                                                <td class="p-4 text-slate-600 max-w-[150px] truncate">
                                                    <Show
                                                        when={isFromAPI}
                                                        fallback={<span class="text-slate-300">—</span>}
                                                    >
                                                        <Show
                                                            when={(item as any).vendor}
                                                            fallback={
                                                                <Show when={(item as any).project_name}>
                                                                    <span class="text-xs">{(item as any).project_name}</span>
                                                                </Show>
                                                            }
                                                        >
                                                            {(item as any).vendor}
                                                        </Show>
                                                    </Show>
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
                                <Show when={filteredRecords().length === 0 && !loading()}>
                                    <tr>
                                        <td colSpan={19} class="p-8 text-center text-slate-500">
                                            <div class="flex flex-col items-center justify-center">
                                                <InfoIcon class="w-8 h-8 text-slate-300 mb-2" />
                                                <Show
                                                    when={totalMaterials() === 0}
                                                    fallback={<p>Tidak ada material yang sesuai dengan filter.</p>}
                                                >
                                                    <p class="mb-2">Belum ada data material.</p>
                                                    <p class="text-xs text-slate-400">Gunakan tombol "Import Excel" atau "Tambah Manual" untuk menambah material.</p>
                                                </Show>
                                            </div>
                                        </td>
                                    </tr>
                                </Show>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Show>

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

            {/* Import Excel Modal */}
            <ImportMaterialExcelModal
                isOpen={isImportModalOpen()}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportExcel}
            />

            {/* Import Result Modal */}
            <ImportResultModal
                isOpen={isResultModalOpen()}
                onClose={() => setIsResultModalOpen(false)}
                result={importResult()}
            />
        </div>
    );
};

export default MaterialMasterPage;