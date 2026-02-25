import { createSignal, Show, onMount, For } from 'solid-js';
import type { Component } from 'solid-js';
import type { CreateMaterialRequest } from '../../../../../domain/entities/material.entity';
import type { Project } from '../../../../../domain/entities/project.entity';
import type { Site } from '../../../../../domain/entities/work-order.entity';
import { MaterialRepositoryImpl } from '../../../../../infrastructure/repositories/material.repository.impl';
import { CreateMaterialInteractor } from '../../../../../application/use-cases/create-material.use-case';
import { ProjectRepositoryImpl } from '../../../../../infrastructure/repositories/project.repository.impl';
import { SiteRepositoryImpl } from '../../../../../infrastructure/repositories/site.repository.impl';

interface CreateMaterialModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
    defaultProjectId?: string;
    defaultSiteId?: string;
}

const CreateMaterialModal: Component<CreateMaterialModalProps> = (props) => {
    const [skp, setSkp] = createSignal('');
    const [name, setName] = createSignal('');
    const [unit, setUnit] = createSignal('');
    const [qty, setQty] = createSignal(0);
    const [tgl, setTgl] = createSignal('');
    const [selectedProjectId, setSelectedProjectId] = createSignal('');
    const [selectedSiteId, setSelectedSiteId] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal('');

    // Data for dropdowns
    const [projects, setProjects] = createSignal<Project[]>([]);
    const [allSites, setAllSites] = createSignal<Site[]>([]);
    const [loadingProjects, setLoadingProjects] = createSignal(false);
    const [loadingSites, setLoadingSites] = createSignal(false);

    // Computed: Filter sites based on selected project
    const filteredSites = () => {
        if (!selectedProjectId()) return [];

        const filtered = allSites().filter(site => {
            // Handle both with and without prefix
            const siteProjectId = site.project_id || '';
            const selectedId = selectedProjectId();

            // Direct match
            if (siteProjectId === selectedId) return true;

            // Match without prefix (in case one has prefix and other doesn't)
            const siteIdWithoutPrefix = siteProjectId.replace('projects:', '');
            const selectedIdWithoutPrefix = selectedId.replace('projects:', '');

            return siteIdWithoutPrefix === selectedIdWithoutPrefix;
        });

        console.log('Filtering sites:', {
            selectedProjectId: selectedProjectId(),
            totalSites: allSites().length,
            filteredCount: filtered.length,
            allSites: allSites().map(s => ({ id: s.id, name: s.site_name, project_id: s.project_id }))
        });

        return filtered;
    };

    // Load projects and sites on mount
    onMount(async () => {
        await Promise.all([loadProjects(), loadAllSites()]);

        // Set default values if provided
        if (props.defaultProjectId) {
            setSelectedProjectId(props.defaultProjectId);
        }
        if (props.defaultSiteId) {
            setSelectedSiteId(props.defaultSiteId);
        }
    });

    const loadProjects = async () => {
        try {
            setLoadingProjects(true);
            const projectRepository = new ProjectRepositoryImpl();
            const projectsData = await projectRepository.findAll();
            setProjects(projectsData);
        } catch (err) {
            console.error('Failed to load projects:', err);
        } finally {
            setLoadingProjects(false);
        }
    };

    const loadAllSites = async () => {
        try {
            setLoadingSites(true);
            const siteRepository = new SiteRepositoryImpl();
            const sitesData = await siteRepository.findAll();
            setAllSites(sitesData);
        } catch (err) {
            console.error('Failed to load sites:', err);
        } finally {
            setLoadingSites(false);
        }
    };

    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId);
        setSelectedSiteId(''); // Reset site selection
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setError('');

        if (!skp() || !name() || !unit() || qty() <= 0 || !tgl() || !selectedProjectId() || !selectedSiteId()) {
            setError('Semua field harus diisi dengan benar');
            return;
        }

        try {
            setLoading(true);

            const materialData: CreateMaterialRequest = {
                skp: skp(),
                name: name(),
                unit: unit(),
                qty: qty(),
                project_id: selectedProjectId(),
                site_id: selectedSiteId(),
                tgl: tgl()
            };

            const materialRepository = new MaterialRepositoryImpl();
            const createMaterialUseCase = new CreateMaterialInteractor(materialRepository);
            await createMaterialUseCase.execute(materialData);

            // Reset form
            setSkp('');
            setName('');
            setUnit('');
            setQty(0);
            setTgl('');
            setSelectedProjectId('');
            setSelectedSiteId('');

            props.onSuccess();
            props.onClose();
        } catch (err) {
            console.error('Failed to create material:', err);
            setError('Gagal membuat material. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading()) {
            setSkp('');
            setName('');
            setUnit('');
            setQty(0);
            setTgl('');
            setSelectedProjectId('');
            setSelectedSiteId('');
            setError('');
            props.onClose();
        }
    };

    return (
        <Show when={props.show}>
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                        <h2 class="text-2xl font-bold text-slate-900">Tambah Material</h2>
                        <button
                            onClick={handleClose}
                            disabled={loading()}
                            class="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} class="p-6 space-y-5">
                        {error() && (
                            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error()}
                            </div>
                        )}

                        {/* Project Dropdown */}
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Project <span class="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedProjectId()}
                                onChange={(e) => handleProjectChange(e.currentTarget.value)}
                                required
                                disabled={loading() || loadingProjects()}
                                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Pilih Project</option>
                                <For each={projects()}>
                                    {(project) => (
                                        <option value={project.id}>{project.name}</option>
                                    )}
                                </For>
                            </select>
                        </div>

                        {/* Site Dropdown */}
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Site <span class="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedSiteId()}
                                onChange={(e) => setSelectedSiteId(e.currentTarget.value)}
                                required
                                disabled={loading() || loadingSites() || !selectedProjectId()}
                                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                            >
                                <option value="">
                                    {!selectedProjectId() ? 'Pilih project terlebih dahulu' : loadingSites() ? 'Loading sites...' : 'Pilih Site'}
                                </option>
                                <For each={filteredSites()}>
                                    {(site) => (
                                        <option value={site.id}>{site.site_name}</option>
                                    )}
                                </For>
                            </select>
                        </div>

                        {/* SKP */}
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                SKP <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={skp()}
                                onInput={(e) => setSkp(e.currentTarget.value)}
                                placeholder="SKP-2026-001"
                                required
                                disabled={loading()}
                                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Nama Material <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={name()}
                                onInput={(e) => setName(e.currentTarget.value)}
                                placeholder="Kabel Fiber Optik 100m"
                                required
                                disabled={loading()}
                                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Unit & Qty */}
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">
                                    Unit <span class="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={unit()}
                                    onInput={(e) => setUnit(e.currentTarget.value)}
                                    placeholder="Roll"
                                    required
                                    disabled={loading()}
                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">
                                    Quantity <span class="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={qty()}
                                    onInput={(e) => setQty(parseInt(e.currentTarget.value) || 0)}
                                    placeholder="50"
                                    min="1"
                                    required
                                    disabled={loading()}
                                    class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Tanggal */}
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">
                                Tanggal <span class="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={tgl()}
                                onInput={(e) => setTgl(e.currentTarget.value)}
                                required
                                disabled={loading()}
                                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Actions */}
                        <div class="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading()}
                                class="flex-1 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                {loading() ? 'Menyimpan...' : 'Simpan Material'}
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={loading()}
                                class="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Show>
    );
};

export default CreateMaterialModal;
