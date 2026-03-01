import { For, createSignal, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { Site } from '../../../../domain/entities/work-order.entity';
import type { Material } from '../../../../domain/entities/material.entity';
import type { SiteFile } from '../../../../domain/entities/site-file.entity';
import type { TerminSubmission } from '../../../../domain/entities/termin-submission.entity';
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { ColDef } from 'ag-grid-community';
import { MaterialRepositoryImpl } from '../../../../infrastructure/repositories/material.repository.impl';
import { GetMaterialsBySiteInteractor } from '../../../../application/use-cases/get-materials-by-site.use-case';
import { SiteRepositoryImpl } from '../../../../infrastructure/repositories/site.repository.impl';
import { GetSiteFilesInteractor } from '../../../../application/use-cases/get-site-files.use-case';
import { TerminRepositoryImpl } from '../../../../infrastructure/repositories/termin.repository.impl';
import TerminSubmissionPage from './TerminSubmissionPage';
import TerminDetailPage from './TerminDetailPage';
import TerminReviewPage from './TerminReviewPage';
import TerminPaymentPage from './TerminPaymentPage';
import CreateMaterialModal from './components/CreateMaterialModal';

interface SiteDetailPageProps {
    site: Site;
    onBack: () => void;
}

const SiteDetailPage: Component<SiteDetailPageProps> = (props) => {

    const [showTerminSubmission, setShowTerminSubmission] = createSignal(false);
    const [showTerminDetail, setShowTerminDetail] = createSignal(false);
    const [showTerminReview, setShowTerminReview] = createSignal(false);
    const [showTerminPayment, setShowTerminPayment] = createSignal(false);
    const [selectedTerminNumber, setSelectedTerminNumber] = createSignal(1);
    const [terminStatus, setTerminStatus] = createSignal<'pending_review' | 'director_approval' | 'approved'>('pending_review');
    const [currentTerminData, setCurrentTerminData] = createSignal<TerminSubmission | null>(null);

    // Store all termin data for status display
    const [allTerminData, setAllTerminData] = createSignal<Map<number, TerminSubmission>>(new Map());

    // Store termin IDs for each termin number (persisted in localStorage)
    const getStoredTerminId = (terminNumber: number): string | null => {
        const siteId = props.site.id.split(':')[1];
        const key = `termin_${siteId}_${terminNumber}`;
        return localStorage.getItem(key);
    };

    const storeTerminId = (terminNumber: number, terminId: string) => {
        const siteId = props.site.id.split(':')[1];
        const key = `termin_${siteId}_${terminNumber}`;
        localStorage.setItem(key, terminId);
    };

    // Check if termin has been submitted
    const isTerminSubmitted = (terminNumber: number): boolean => {
        return getStoredTerminId(terminNumber) !== null;
    };

    // Get termin status text for display
    const getTerminStatusText = (terminNumber: number): string => {
        const terminData = allTerminData().get(terminNumber);
        if (!terminData) return 'Sedang Dikerjakan';

        const status = terminData.status;
        switch (status) {
            case 'pending_review':
            case 'field_head_review':
                return 'Sedang Direview Finance';
            case 'reviewed':
            case 'director_approval':
                return 'Menunggu Persetujuan Direktur';
            case 'approved':
                return 'Menunggu Pembayaran';
            case 'paid':
                return 'Dibayarkan';
            case 'rejected':
                return 'Ditolak';
            default:
                return 'Sedang Direview';
        }
    };

    // Mock data for termins with new percentage rules: 30% -> 50% -> 10% -> 10%
    const termins = [
        { id: 1, name: 'Termin 1', status: 'active', progress: 0, description: 'Pembayaran termin pertama (30% dari 70% nilai site)', percentage: 30 },
        { id: 2, name: 'Termin 2', status: 'pending', progress: 0, description: 'Pembayaran termin kedua (50% dari 70% nilai site)', percentage: 50 },
        { id: 3, name: 'Termin 3', status: 'pending', progress: 0, description: 'Pembayaran termin ketiga (10% dari 70% nilai site)', percentage: 10 },
        { id: 4, name: 'Termin 4', status: 'pending', progress: 0, description: 'Pembayaran termin keempat (10% dari 70% nilai site)', percentage: 10 },
    ];

    // Mock data for team
    const [teamMembers] = createSignal([
        { no: 1, name: 'Jane Smith', role: 'member', vendor: 'Vendor A', no_hp: '08XX1234567', jabatan: 'Staff' },
        { no: 2, name: 'Bob Johnson', role: 'member', vendor: 'Vendor D', no_hp: '08XX7891234', jabatan: 'Supervisor' },
    ]);

    // Materials data from API
    const [materials, setMaterials] = createSignal<Material[]>([]);
    const [loadingMaterials, setLoadingMaterials] = createSignal(false);
    const [showCreateMaterialModal, setShowCreateMaterialModal] = createSignal(false);

    // Site files data from API
    const [siteFiles, setSiteFiles] = createSignal<SiteFile[]>([]);
    const [loadingSiteFiles, setLoadingSiteFiles] = createSignal(false);

    // Load materials and site files on mount
    onMount(() => {
        loadMaterials();
        loadSiteFiles();
        loadAllTerminStatuses();
    });

    // Load all termin statuses for display
    const loadAllTerminStatuses = async () => {
        const terminRepository = new TerminRepositoryImpl();
        const terminDataMap = new Map<number, TerminSubmission>();

        for (let i = 1; i <= 4; i++) {
            const terminId = getStoredTerminId(i);
            if (terminId) {
                try {
                    const terminData = await terminRepository.findById(terminId);
                    if (terminData) {
                        terminDataMap.set(i, terminData);
                    }
                } catch (error) {
                    console.error(`Failed to load termin ${i}:`, error);
                }
            }
        }

        setAllTerminData(terminDataMap);
    };

    const loadMaterials = async () => {
        try {
            setLoadingMaterials(true);
            const siteId = props.site.id.split(':')[1]; // Extract raw ID
            const materialRepository = new MaterialRepositoryImpl();
            const getMaterialsUseCase = new GetMaterialsBySiteInteractor(materialRepository);
            const materialsData = await getMaterialsUseCase.execute(siteId);
            setMaterials(materialsData);
        } catch (error) {
            console.error('Failed to load materials:', error);
        } finally {
            setLoadingMaterials(false);
        }
    };

    const loadSiteFiles = async () => {
        try {
            setLoadingSiteFiles(true);
            const siteId = props.site.id.split(':')[1]; // Extract raw ID
            const siteRepository = new SiteRepositoryImpl();
            const getSiteFilesUseCase = new GetSiteFilesInteractor(siteRepository);
            const filesData = await getSiteFilesUseCase.execute(siteId);
            setSiteFiles(filesData);
        } catch (error) {
            console.error('Failed to load site files:', error);
        } finally {
            setLoadingSiteFiles(false);
        }
    };

    // Check if previous termin is approved
    const isPreviousTerminApproved = async (terminNumber: number): Promise<boolean> => {
        if (terminNumber === 1) {
            return true; // Termin 1 can always be submitted
        }

        const previousTerminId = getStoredTerminId(terminNumber - 1);
        if (!previousTerminId) {
            return false; // Previous termin doesn't exist
        }

        try {
            const terminRepository = new TerminRepositoryImpl();
            const previousTerminData = await terminRepository.findById(previousTerminId);

            if (!previousTerminData) {
                return false;
            }

            // Check if previous termin is approved (completed payment)
            return previousTerminData.status === 'completed' || previousTerminData.status === 'approved';
        } catch (error) {
            console.error('Failed to check previous termin:', error);
            return false;
        }
    };

    const checkAndLoadTermin = async (terminNumber: number) => {
        try {
            const storedTerminId = getStoredTerminId(terminNumber);

            if (!storedTerminId) {
                return false; // No termin exists yet
            }

            const terminRepository = new TerminRepositoryImpl();
            const terminData = await terminRepository.findById(storedTerminId);

            if (terminData) {
                // Termin sudah ada, set data dan status
                setCurrentTerminData(terminData);
                setTerminStatus(terminData.status as any);

                // Always show detail page, never redirect to review
                setShowTerminDetail(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to check termin:', error);
            return false;
        }
    };

    const handleAjukanTermin = async (terminNumber: number) => {
        setSelectedTerminNumber(terminNumber);

        // Check if previous termin is approved (except for termin 1)
        const canSubmit = await isPreviousTerminApproved(terminNumber);

        if (!canSubmit) {
            alert(`Termin ${terminNumber} hanya bisa diajukan setelah Termin ${terminNumber - 1} disetujui dan dibayar.`);
            return;
        }

        // Check if termin already exists
        const terminExists = await checkAndLoadTermin(terminNumber);

        if (!terminExists) {
            // Termin belum ada, tampilkan form submission
            setShowTerminSubmission(true);
        }
    };

    // Column definitions for Team table
    const teamColumns: ColDef[] = [
        { field: 'no', headerName: 'No', width: 80 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'role', headerName: 'Role', flex: 1 },
        { field: 'vendor', headerName: 'Vendor', flex: 1 },
        { field: 'no_hp', headerName: 'No HP', flex: 1 },
        { field: 'jabatan', headerName: 'Jabatan', flex: 1 },
    ];

    // Column definitions for Materials table
    const materialsColumns: ColDef[] = [
        {
            headerName: 'No',
            width: 80,
            valueGetter: (params) => {
                return params.node?.rowIndex != null ? params.node.rowIndex + 1 : 0;
            }
        },
        { field: 'skp', headerName: 'SKP', flex: 1 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'qty', headerName: 'Qty', width: 100 },
        { field: 'unit', headerName: 'Unit', width: 100 },
        { field: 'tgl', headerName: 'Tanggal', flex: 1 },
    ];

    // Column definitions for Site Files table
    const siteFilesColumns: ColDef[] = [
        {
            headerName: 'No',
            width: 80,
            valueGetter: (params) => {
                return params.node?.rowIndex != null ? params.node.rowIndex + 1 : 0;
            }
        },
        { field: 'title', headerName: 'Title', flex: 2 },
        { field: 'original_name', headerName: 'Original Name', flex: 1 },
        {
            field: 'size',
            headerName: 'Size',
            width: 120,
            valueFormatter: (params) => {
                const sizeInKB = params.value / 1024;
                if (sizeInKB < 1024) {
                    return `${sizeInKB.toFixed(2)} KB`;
                }
                return `${(sizeInKB / 1024).toFixed(2)} MB`;
            }
        },
        {
            field: 'uploaded_at',
            headerName: 'Uploaded At',
            flex: 1,
            valueFormatter: (params) => {
                if (!params.value) return '';
                const date = new Date(params.value);
                return date.toLocaleString('id-ID', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        },
        {
            headerName: 'Actions',
            width: 100,
            cellRenderer: (params: any) => {
                const container = document.createElement('div');
                container.style.cssText = 'display: flex; gap: 12px; align-items: center; justify-content: center; height: 100%;';

                // Download icon button
                const downloadBtn = document.createElement('button');
                downloadBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                `;
                downloadBtn.style.cssText = 'background: none; border: none; cursor: pointer; color: #3b82f6; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;';
                downloadBtn.onmouseover = () => downloadBtn.style.background = '#eff6ff';
                downloadBtn.onmouseout = () => downloadBtn.style.background = 'none';
                downloadBtn.onclick = () => {
                    console.log('Download file:', params.data);
                    // Add download logic here
                };

                // Delete icon button
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                `;
                deleteBtn.style.cssText = 'background: none; border: none; cursor: pointer; color: #ef4444; padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;';
                deleteBtn.onmouseover = () => deleteBtn.style.background = '#fef2f2';
                deleteBtn.onmouseout = () => deleteBtn.style.background = 'none';
                deleteBtn.onclick = () => {
                    console.log('Delete file:', params.data);
                    // Add delete logic here
                };

                container.appendChild(downloadBtn);
                container.appendChild(deleteBtn);

                return container;
            }
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-emerald-500';
            case 'active': return 'bg-blue-500';
            case 'in_progress': return 'bg-blue-500';
            default: return 'bg-slate-300';
        }
    };

    const getStatusBorderColor = (status: string) => {
        switch (status) {
            case 'completed': return 'border-emerald-500';
            case 'active': return 'border-blue-500';
            case 'in_progress': return 'border-blue-500';
            default: return 'border-slate-300';
        }
    };

    return (
        <Show
            when={!showTerminSubmission() && !showTerminDetail() && !showTerminReview() && !showTerminPayment()}
            fallback={
                <Show
                    when={showTerminSubmission()}
                    fallback={
                        <Show
                            when={showTerminDetail()}
                            fallback={
                                <Show
                                    when={showTerminReview()}
                                    fallback={
                                        <TerminPaymentPage
                                            site={props.site}
                                            terminNumber={selectedTerminNumber()}
                                            onBack={() => setShowTerminPayment(false)}
                                            onPaymentSuccess={() => {
                                                console.log('Payment completed');
                                                alert('Pembayaran berhasil dikonfirmasi!');
                                                setShowTerminPayment(false);
                                                setTerminStatus('pending_review'); // Reset
                                            }}
                                        />
                                    }
                                >
                                    <TerminReviewPage
                                        site={props.site}
                                        terminNumber={selectedTerminNumber()}
                                        terminData={currentTerminData()}
                                        onBack={() => setShowTerminReview(false)}
                                        onApprove={async () => {
                                            console.log('Field Head approved, moving to Director Approval');
                                            // Reload termin data to get updated status
                                            const terminId = currentTerminData()?.id;
                                            if (terminId) {
                                                const terminRepository = new TerminRepositoryImpl();
                                                const updatedTerminData = await terminRepository.findById(terminId);
                                                if (updatedTerminData) {
                                                    setCurrentTerminData(updatedTerminData);
                                                    setTerminStatus(updatedTerminData.status as any);
                                                }
                                            }
                                            setShowTerminReview(false);
                                            setShowTerminDetail(true);
                                        }}
                                        onReject={async () => {
                                            console.log('Field Head rejected');
                                            // Reload termin data to get updated status
                                            const terminId = currentTerminData()?.id;
                                            if (terminId) {
                                                const terminRepository = new TerminRepositoryImpl();
                                                const updatedTerminData = await terminRepository.findById(terminId);
                                                if (updatedTerminData) {
                                                    setCurrentTerminData(updatedTerminData);
                                                    setTerminStatus(updatedTerminData.status as any);
                                                }
                                            }
                                            setShowTerminReview(false);
                                            setShowTerminDetail(true);
                                        }}
                                    />
                                </Show>
                            }
                        >
                            <TerminDetailPage
                                site={props.site}
                                terminNumber={selectedTerminNumber()}
                                terminData={currentTerminData()}
                                initialStatus={terminStatus()}
                                onBack={() => {
                                    setShowTerminDetail(false);
                                    setTerminStatus('pending_review'); // Reset status
                                    setCurrentTerminData(null);
                                    // Reload all termin statuses
                                    loadAllTerminStatuses();
                                }}
                                onReview={() => {
                                    setShowTerminDetail(false);
                                    setShowTerminReview(true);
                                }}
                                onApprove={async () => {
                                    console.log('Director approved termin, moving to payment');
                                    // Reload termin data to get updated status
                                    const terminId = currentTerminData()?.id;
                                    if (terminId) {
                                        const terminRepository = new TerminRepositoryImpl();
                                        const updatedTerminData = await terminRepository.findById(terminId);
                                        if (updatedTerminData) {
                                            setCurrentTerminData(updatedTerminData);
                                            setTerminStatus(updatedTerminData.status as any);
                                        }
                                    }
                                    // Status change will trigger reactive update in TerminDetailPage
                                }}
                                onReject={async () => {
                                    console.log('Director rejected termin');
                                    // Reload termin data to get updated status
                                    const terminId = currentTerminData()?.id;
                                    if (terminId) {
                                        const terminRepository = new TerminRepositoryImpl();
                                        const updatedTerminData = await terminRepository.findById(terminId);
                                        if (updatedTerminData) {
                                            setCurrentTerminData(updatedTerminData);
                                            setTerminStatus(updatedTerminData.status as any);
                                        }
                                    }
                                    alert('Termin ditolak oleh Direktur!');
                                }}
                                onPayment={() => {
                                    console.log('Navigate to payment page');
                                    setShowTerminDetail(false);
                                    setShowTerminPayment(true);
                                }}
                            />
                        </Show>
                    }
                >
                    <TerminSubmissionPage
                        site={props.site}
                        terminNumber={selectedTerminNumber()}
                        onBack={() => setShowTerminSubmission(false)}
                        onSubmitSuccess={async (terminData) => {
                            console.log('Termin submitted, returning to site detail');
                            // Store termin ID for future reference
                            storeTerminId(selectedTerminNumber(), terminData.id);
                            setCurrentTerminData(terminData);
                            setTerminStatus(terminData.status as any);
                            setShowTerminSubmission(false);
                            // Don't show detail or review, just go back to site detail
                        }}
                    />
                </Show>
            }
        >
            <div class="space-y-6 pb-16">
                {/* Header */}
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <button
                            onClick={() => props.onBack()}
                            class="p-3 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 class="text-3xl font-bold tracking-tight text-slate-900">Detail Site</h1>
                            <p class="text-slate-500 mt-1">{props.site.site_name}</p>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-xl transition-all">
                            Edit
                        </button>
                        <button class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all">
                            Manage
                        </button>
                    </div>
                </div>

                {/* Progress Pekerjaan */}
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-slate-900 mb-2">Progress Pekerjaan</h2>
                    <p class="text-sm text-slate-500 mb-6">Progress: 1 dari 4 step</p>

                    {/* Overall Progress Bar */}
                    <div class="mb-8">
                        <div class="relative">
                            <div class="w-full bg-slate-200 rounded-full h-2.5">
                                <div class="bg-blue-500 h-2.5 rounded-full transition-all" style={{ width: '0%' }} />
                            </div>
                            <span class="absolute -right-1 -top-6 text-xs font-semibold text-slate-600">0%</span>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <For each={termins}>
                            {(termin, index) => (
                                <div class="relative flex gap-4">
                                    {/* Step Number - Outside card */}
                                    <div class="relative flex-shrink-0">
                                        <div class={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getStatusColor(termin.status)} shadow-md z-10 relative`}>
                                            {termin.id}
                                        </div>

                                        {/* Connector Line - Outside card */}
                                        {index() < termins.length - 1 && (
                                            <div class="absolute left-1/2 top-12 w-0.5 bg-slate-300 -translate-x-1/2" style={{ height: 'calc(100% + 1rem)' }} />
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div class={`flex-1 border-2 ${getStatusBorderColor(termin.status)} rounded-xl p-4 ${termin.status === 'active' ? 'bg-blue-50' : 'bg-white'}`}>
                                        <div class="mb-2">
                                            <div class="flex items-center gap-2 mb-2">
                                                <span class="font-bold text-slate-900">{termin.name}</span>
                                                <span class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold">
                                                    {termin.percentage}%
                                                </span>
                                                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
                                                    Progress: {termin.progress}%
                                                </span>
                                                {termin.status === 'completed' && (
                                                    <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                                                        Proses Selesai
                                                    </span>
                                                )}
                                            </div>

                                            <p class="text-xs text-slate-500 mb-3">{termin.description}</p>

                                            {/* Status and Button - Below termin name */}
                                            {termin.status === 'active' && (
                                                <div class="flex items-center gap-2">
                                                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                                                        {getTerminStatusText(termin.id)}
                                                    </span>
                                                    <button
                                                        onClick={() => handleAjukanTermin(termin.id)}
                                                        class="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-all"
                                                    >
                                                        {isTerminSubmitted(termin.id) ? 'View' : `Ajukan Termin ${termin.id}`}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </div>

                {/* Informasi Site & Lainnya */}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informasi Site */}
                    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 class="text-lg font-bold text-slate-900 mb-4">Informasi Site</h2>
                        <div class="space-y-3">
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">ID</span>
                                <span class="text-sm font-medium text-slate-900">{props.site.id.split(':')[1]}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Project</span>
                                <span class="text-sm font-medium text-slate-900">Example Project / Site</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Site Name</span>
                                <span class="text-sm font-medium text-slate-900">{props.site.site_name}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Site Info</span>
                                <span class="text-sm font-medium text-slate-900">{props.site.site_info}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Nama Pekerjaan</span>
                                <span class="text-sm font-medium text-slate-900">{props.site.pekerjaan}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Lokasi</span>
                                <span class="text-sm font-medium text-slate-900">{props.site.lokasi}</span>
                            </div>
                            <div class="flex justify-between py-2">
                                <span class="text-sm text-slate-500">Nomor Kontrak</span>
                                <span class="text-sm font-medium text-slate-900">{props.site.nomor_kontrak}</span>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Lainnya */}
                    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h2 class="text-lg font-bold text-slate-900 mb-4">Informasi Lainnya</h2>
                        <div class="space-y-3">
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Max Value (Site)</span>
                                <span class="text-sm font-medium text-slate-900">Rp {props.site.maximal_budget.toLocaleString('id-ID')}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Max Payment (70%)</span>
                                <span class="text-sm font-medium text-emerald-600">Rp {Math.floor(props.site.maximal_budget * 0.7).toLocaleString('id-ID')}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Cost Estimate</span>
                                <span class="text-sm font-medium text-slate-900">Rp {props.site.cost_estimated.toLocaleString('id-ID')}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Cost Realisasi</span>
                                <span class="text-sm font-medium text-slate-900">Rp 0</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Sisa</span>
                                <span class="text-sm font-medium text-slate-900">Rp {props.site.maximal_budget.toLocaleString('id-ID')}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Tanggal Start</span>
                                <span class="text-sm font-medium text-slate-900">{typeof props.site.start === 'string' ? props.site.start : ''}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Tanggal End</span>
                                <span class="text-sm font-medium text-slate-900">{typeof props.site.end === 'string' ? props.site.end : ''}</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Team</span>
                                <span class="text-sm font-medium text-slate-900">Tim Struktur</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-slate-100">
                                <span class="text-sm text-slate-500">Pemberi Tugas</span>
                                <span class="text-sm font-medium text-slate-900">{props.site.pemberi_tugas}</span>
                            </div>
                            <div class="flex justify-between py-2">
                                <span class="text-sm text-slate-500">Penerima Tugas</span>
                                <span class="text-sm font-medium text-slate-900">{props.site.penerima_tugas}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tim (Struktur) */}
                <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-slate-900">Tim (Struktur)</h3>
                        <button class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-all">
                            + Add Team
                        </button>
                    </div>
                    <div class="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
                        <AgGridSolid
                            columnDefs={teamColumns}
                            rowData={teamMembers()}
                            pagination={true}
                            paginationPageSize={10}
                            paginationPageSizeSelector={[10, 20, 50]}
                        />
                    </div>
                </div>

                {/* Materials */}
                <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-slate-900">Materials</h3>
                        <button
                            onClick={() => setShowCreateMaterialModal(true)}
                            class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all"
                        >
                            + Add Material
                        </button>
                    </div>
                    {loadingMaterials() ? (
                        <div class="p-8 text-center text-slate-500">Loading materials...</div>
                    ) : (
                        <div class="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
                            <AgGridSolid
                                columnDefs={materialsColumns}
                                rowData={materials()}
                                pagination={true}
                                paginationPageSize={10}
                                paginationPageSizeSelector={[10, 20, 50]}
                            />
                        </div>
                    )}
                </div>

                {/* Site Files */}
                <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-slate-900">Site Files</h3>
                        <button class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all">
                            + Upload File
                        </button>
                    </div>
                    {loadingSiteFiles() ? (
                        <div class="p-8 text-center text-slate-500">Loading site files...</div>
                    ) : (
                        <div class="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
                            <AgGridSolid
                                columnDefs={siteFilesColumns}
                                rowData={siteFiles()}
                                pagination={true}
                                paginationPageSize={10}
                                paginationPageSizeSelector={[10, 20, 50]}
                            />
                        </div>
                    )}
                </div>

                {/* Termins */}
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h2 class="text-lg font-bold text-slate-900 mb-4">Termins</h2>
                    <p class="text-sm text-slate-500">Belum ada termins</p>
                </div>
            </div>

            {/* Create Material Modal */}
            <CreateMaterialModal
                show={showCreateMaterialModal()}
                onClose={() => setShowCreateMaterialModal(false)}
                onSuccess={() => {
                    loadMaterials();
                }}
                defaultProjectId={props.site.project_id || ''}
                defaultSiteId={props.site.id}
            />
        </Show>
    );
};

export default SiteDetailPage;
