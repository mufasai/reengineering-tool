import { For, createSignal, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js';
import type { Site } from '../../../../domain/entities/work-order.entity';
import type { Material } from '../../../../domain/entities/material.entity';
import type { SiteFile } from '../../../../domain/entities/site-file.entity';
import type { TerminSubmission } from '../../../../domain/entities/termin-submission.entity';
import type { SiteTeamMember } from '../../../../domain/entities/team.entity';
import AgGridSolid from 'ag-grid-solid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import type { ColDef } from 'ag-grid-community';
import { MaterialRepositoryImpl } from '../../../../infrastructure/repositories/material.repository.impl';
import { GetMaterialsBySiteInteractor } from '../../../../application/use-cases/get-materials-by-site.use-case';
import { SiteRepositoryImpl } from '../../../../infrastructure/repositories/site.repository.impl';
import { GetSiteFilesInteractor } from '../../../../application/use-cases/get-site-files.use-case';
import { GetSiteTeamStructureInteractor } from '../../../../application/use-cases/get-site-team-structure.use-case';
import { AddTeamToSiteInteractor } from '../../../../application/use-cases/add-team-to-site.use-case';
import { DeleteTeamFromSiteInteractor } from '../../../../application/use-cases/delete-team-from-site.use-case';
import { TerminRepositoryImpl } from '../../../../infrastructure/repositories/termin.repository.impl';
import TerminSubmissionPage from './TerminSubmissionPage';
import TerminDetailPage from './TerminDetailPage';
import TerminReviewPage from './TerminReviewPage';
import TerminPaymentPage from './TerminPaymentPage';
import CreateMaterialModal from './components/CreateMaterialModal';
import AddTeamModal from './components/AddTeamModal';
import FilterPaymentSection from './components/FilterPaymentSection';
import CostsPaymentSection from './components/CostsPaymentSection';
import UpdateStageModal from '../../../components/modals/UpdateStageModal';

interface SiteDetailPageProps {
    site: Site;
    onBack: () => void;
    canEdit?: boolean | 'team_leader';
}

const SiteDetailPage: Component<SiteDetailPageProps> = (props) => {
    const canEdit = () => {
        // Full edit permission (admin, management, backoffice_admin)
        return props.canEdit === true;
    };
    const isTeamLeader = () => {
        // Team leader has limited edit permissions
        return props.canEdit === 'team_leader';
    };
    const isReadOnly = () => {
        // Read-only if canEdit is false (finance, head_office, direktur)
        return props.canEdit === false;
    };

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
                return 'Sedang Direview Head Office';
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

    // Get termin card status (active, completed, pending)
    const getTerminCardStatus = (terminNumber: number): 'active' | 'completed' | 'pending' => {
        const terminData = allTerminData().get(terminNumber);

        // If termin is paid, it's completed
        if (terminData?.status === 'paid') {
            return 'completed';
        }

        // If termin exists (submitted), it's active
        if (terminData) {
            return 'active';
        }

        // Check if previous termin is paid
        if (terminNumber === 1) {
            return 'active'; // Termin 1 is always active initially
        }

        const previousTerminData = allTerminData().get(terminNumber - 1);
        if (previousTerminData?.status === 'paid') {
            return 'active'; // Previous termin is paid, this one can be started
        }

        return 'pending'; // Previous termin not paid yet
    };

    // Get termin progress percentage
    const getTerminProgress = (terminNumber: number): number => {
        const terminData = allTerminData().get(terminNumber);
        if (!terminData) return 0;

        const status = terminData.status;
        switch (status) {
            case 'pending_review':
            case 'field_head_review':
                return 25; // Submitted, waiting for review
            case 'reviewed':
            case 'director_approval':
                return 50; // Reviewed, waiting for director approval
            case 'approved':
                return 75; // Approved, waiting for payment
            case 'paid':
                return 100; // Paid, completed
            default:
                return 0;
        }
    };

    // Mock data for termins with new percentage rules: 30% -> 50% -> 10% -> 10%
    const getTermins = () => {
        return [
            { id: 1, name: 'Termin 1', status: getTerminCardStatus(1), progress: getTerminProgress(1), description: 'Pembayaran termin pertama (30% dari 70% nilai site)', percentage: 30 },
            { id: 2, name: 'Termin 2', status: getTerminCardStatus(2), progress: getTerminProgress(2), description: 'Pembayaran termin kedua (50% dari 70% nilai site)', percentage: 50 },
            { id: 3, name: 'Termin 3', status: getTerminCardStatus(3), progress: getTerminProgress(3), description: 'Pembayaran termin ketiga (10% dari 70% nilai site)', percentage: 10 },
            { id: 4, name: 'Termin 4', status: getTerminCardStatus(4), progress: getTerminProgress(4), description: 'Pembayaran termin keempat (10% dari 70% nilai site)', percentage: 10 },
        ];
    };

    // Mock data for team
    const [teamMembers, setTeamMembers] = createSignal<SiteTeamMember[]>([]);
    const [loadingTeamMembers, setLoadingTeamMembers] = createSignal(false);
    const [showAddTeamModal, setShowAddTeamModal] = createSignal(false);
    const [deleteTeamTarget, setDeleteTeamTarget] = createSignal<{ id: string; name: string } | null>(null);
    const [deletingTeam, setDeletingTeam] = createSignal(false);

    // Stage update modal state
    const [showUpdateStageModal, setShowUpdateStageModal] = createSignal(false);
    const [currentSite, setCurrentSite] = createSignal<Site>(props.site);

    // Dummy state for testing stage progression
    const [dummyStage, setDummyStage] = createSignal('imported'); // Start with imported for testing

    // Materials data from API
    const [materials, setMaterials] = createSignal<Material[]>([]);
    const [loadingMaterials, setLoadingMaterials] = createSignal(false);
    const [showCreateMaterialModal, setShowCreateMaterialModal] = createSignal(false);

    // Site files data from API
    const [siteFiles, setSiteFiles] = createSignal<SiteFile[]>([]);
    const [loadingSiteFiles, setLoadingSiteFiles] = createSignal(false);

    // Load materials and site files on mount
    onMount(() => {
        setCurrentSite(props.site); // Initialize current site
        loadMaterials();
        loadSiteFiles();
        loadAllTerminStatuses();
        loadTeamMembers();
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

    const loadTeamMembers = async () => {
        try {
            setLoadingTeamMembers(true);
            const siteId = props.site.id; // Use full ID with prefix
            const siteRepository = new SiteRepositoryImpl();
            const getTeamStructureUseCase = new GetSiteTeamStructureInteractor(siteRepository);
            const teamData = await getTeamStructureUseCase.execute(siteId);
            setTeamMembers(teamData);
        } catch (error) {
            console.error('Failed to load team members:', error);
        } finally {
            setLoadingTeamMembers(false);
        }
    };

    const handleAddTeam = async (teamId: string) => {
        try {
            const siteId = props.site.id; // Use full ID with prefix
            const siteRepository = new SiteRepositoryImpl();
            const addTeamUseCase = new AddTeamToSiteInteractor(siteRepository);
            await addTeamUseCase.execute(siteId, { team_master_id: teamId });

            // Reload team members
            await loadTeamMembers();
            console.log('Team member berhasil ditambahkan!');
        } catch (error) {
            console.error('Failed to add team:', error);
            throw error;
        }
    };

    const handleDeleteTeam = (teamMemberId: string, teamMemberName: string) => {
        setDeleteTeamTarget({ id: teamMemberId, name: teamMemberName });
    };

    const confirmDeleteTeam = async () => {
        const target = deleteTeamTarget();
        if (!target) return;

        try {
            setDeletingTeam(true);
            const siteId = props.site.id; // Use full ID with prefix
            const siteRepository = new SiteRepositoryImpl();
            const deleteTeamUseCase = new DeleteTeamFromSiteInteractor(siteRepository);
            await deleteTeamUseCase.execute(siteId, target.id);

            // Reload team members
            await loadTeamMembers();
            setDeleteTeamTarget(null);
            console.log('Team member berhasil dihapus!');
        } catch (error) {
            console.error('Failed to delete team:', error);
        } finally {
            setDeletingTeam(false);
        }
    };

    // Handle stage update
    const handleUpdateStage = async (newStage: string, notes?: string, payload?: Record<string, any>) => {
        try {
            console.log('=== STAGE UPDATE ===');
            console.log('From:', dummyStage());
            console.log('To:', newStage);
            console.log('Notes:', notes);
            console.log('Payload:', payload);

            // Update dummy stage
            setDummyStage(newStage);

            // Update local site state
            const updatedSite = { ...currentSite(), stage: newStage };
            setCurrentSite(updatedSite);

            console.log('Stage updated successfully to:', newStage);
            alert(`✅ Stage berhasil diupdate ke: ${newStage}\n\nNotes: ${notes || 'Tidak ada catatan'}`);

            // Close modal
            setShowUpdateStageModal(false);
        } catch (error) {
            console.error('Failed to update stage:', error);
            alert('❌ Gagal mengupdate stage. Silakan coba lagi.');
        }
    };

    // Get stage steps for progress stepper (excluding 'imported' since it's already done when viewing detail)
    const getStageSteps = () => {
        const projectType = 'RESCOPING'; // You can get this from props or site data

        if (projectType === 'RESCOPING') {
            return [
                { id: 'assigned', name: 'Assigned', description: 'Assign tim lapangan' },
                { id: 'survey', name: 'Survey', description: 'Site survey' },
                { id: 'erfin_process', name: 'ERFIN Process', description: 'ERFIN processing' },
                { id: 'erfin_ready', name: 'ERFIN Ready', description: 'ERFIN completed' },
                { id: 'permit_process', name: 'Permit Process', description: 'Permit processing' },
                { id: 'permit_ready', name: 'Permit Ready', description: 'Permit obtained' },
                { id: 'akses_process', name: 'Akses Process', description: 'Access processing' },
                { id: 'akses_ready', name: 'Akses Ready', description: 'Access ready' },
                { id: 'implementasi', name: 'Implementasi', description: 'Implementation' },
                { id: 'rfi_done', name: 'RFI Done', description: 'RFI completed' },
                { id: 'dokumen_done', name: 'Dokumen Done', description: 'Documents submitted' },
                { id: 'bast', name: 'BAST', description: 'Handover completed' },
                { id: 'invoice', name: 'Invoice', description: 'Invoice sent' },
                { id: 'completed', name: 'Completed', description: 'All work completed' }
            ];
        } else {
            return [
                { id: 'assigned', name: 'Assigned', description: 'Assign tim lapangan' },
                { id: 'survey', name: 'Survey', description: 'Site survey' },
                { id: 'erfin_process', name: 'ERFIN Process', description: 'ERFIN processing' },
                { id: 'erfin_ready', name: 'ERFIN Ready', description: 'ERFIN completed' },
                { id: 'permit_process', name: 'Permit Process', description: 'Permit processing' },
                { id: 'permit_ready', name: 'Permit Ready', description: 'Permit obtained' },
                { id: 'akses_process', name: 'Akses Process', description: 'Access processing' },
                { id: 'akses_ready', name: 'Akses Ready', description: 'Access ready' },
                { id: 'implementasi', name: 'Implementasi', description: 'Implementation' },
                { id: 'rfs_done', name: 'RFS Done', description: 'Ready for service' },
                { id: 'dokumen_done', name: 'Dokumen Done', description: 'Documents submitted' },
                { id: 'bast', name: 'BAST', description: 'Handover completed' },
                { id: 'invoice', name: 'Invoice', description: 'Invoice sent' },
                { id: 'completed', name: 'Completed', description: 'All work completed' }
            ];
        }
    };

    // Get current step index and status
    const getCurrentStepIndex = () => {
        const steps = getStageSteps();
        const currentStage = dummyStage(); // Use dummy stage for testing

        // If site is still in 'imported' stage, show as step -1 (before first step)
        if (currentStage === 'imported') {
            return -1;
        }

        return steps.findIndex(step => step.id === currentStage);
    };

    const getStepStatus = (stepIndex: number) => {
        const currentIndex = getCurrentStepIndex();

        // If site is still in 'imported' stage, all steps are pending
        if (currentIndex === -1) {
            return 'pending';
        }

        if (stepIndex < currentIndex) return 'completed';
        if (stepIndex === currentIndex) return 'active';
        return 'pending';
    };

    // Check if we should show the "Assign Team" button for imported sites
    const shouldShowAssignTeamButton = () => {
        return dummyStage() === 'imported' && (canEdit() || isTeamLeader());
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

            // Check if previous termin is paid
            return previousTerminData.status === 'paid';
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

        // Check if previous termin is paid (except for termin 1)
        const canSubmit = await isPreviousTerminApproved(terminNumber);

        if (!canSubmit) {
            alert(`Termin ${terminNumber} hanya bisa diajukan setelah Termin ${terminNumber - 1} dibayarkan.`);
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
        {
            headerName: 'No',
            width: 80,
            valueGetter: (params) => {
                return params.node?.rowIndex != null ? params.node.rowIndex + 1 : 0;
            }
        },
        { field: 'nama', headerName: 'Name', flex: 1 },
        { field: 'nik', headerName: 'NIK', width: 120 },
        { field: 'jabatan', headerName: 'Jabatan', flex: 1 },
        { field: 'regional', headerName: 'Regional', flex: 1 },
        { field: 'no_hp', headerName: 'No HP', flex: 1 },
        {
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filter: false,
            cellRenderer: (params: any) => {
                const member = params.data as SiteTeamMember;
                const container = document.createElement('div');
                container.className = 'flex items-center gap-2 h-full justify-center';

                // Only show delete button if user can edit
                if (!isReadOnly()) {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100';
                    deleteBtn.title = 'Delete';
                    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>';
                    deleteBtn.onclick = () => handleDeleteTeam(member.id, member.nama);
                    container.appendChild(deleteBtn);
                }

                return container;
            }
        }
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
                            // Reload all termin statuses to update the cards
                            await loadAllTerminStatuses();
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
                        <button
                            disabled={isReadOnly() || isTeamLeader()}
                            class="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold rounded-xl transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            Edit
                        </button>
                        <button
                            disabled={isReadOnly() || isTeamLeader()}
                            class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            Manage
                        </button>
                    </div>
                </div>

                {/* Progress Pekerjaan */}
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-bold text-slate-900">Progress Pekerjaan</h2>
                        {/* Testing Controls */}
                        <div class="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setDummyStage('imported');
                                    setCurrentSite({ ...currentSite(), stage: 'imported' });
                                }}
                                class="px-3 py-1 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold rounded transition-all"
                            >
                                🔄 Reset to Imported
                            </button>
                            <button
                                onClick={() => {
                                    console.log('=== MANUAL DEBUG ===');
                                    console.log('Current dummyStage:', dummyStage());
                                    console.log('Current site stage:', currentSite().stage);
                                    console.log('Project type sent to modal: RESCOPING');
                                }}
                                class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded transition-all"
                            >
                                🐛 Debug Info
                            </button>
                            <span class="text-xs text-slate-500">Testing Mode</span>
                        </div>
                    </div>
                    <p class="text-sm text-slate-500 mb-6">
                        Current Stage: {dummyStage() === 'imported' ? 'Imported (Ready to Assign Team)' : dummyStage()}
                    </p>

                    {/* Overall Progress Bar */}
                    <div class="mb-8">
                        <div class="relative">
                            <div class="w-full bg-slate-200 rounded-full h-2.5">
                                <div
                                    class="bg-blue-500 h-2.5 rounded-full transition-all"
                                    style={{
                                        width: `${getCurrentStepIndex() === -1 ? 0 : ((getCurrentStepIndex() + 1) / getStageSteps().length) * 100}%`
                                    }}
                                />
                            </div>
                            <span class="absolute -right-1 -top-6 text-xs font-semibold text-slate-600">
                                {getCurrentStepIndex() === -1 ? 0 : Math.round(((getCurrentStepIndex() + 1) / getStageSteps().length) * 100)}%
                            </span>
                        </div>
                    </div>

                    {/* Show Assign Team Button if site is still imported */}
                    <Show when={shouldShowAssignTeamButton()}>
                        <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-semibold text-blue-900 mb-1">Site Ready to Assign</h3>
                                    <p class="text-sm text-blue-700">Site sudah diimport dan siap untuk ditugaskan ke tim lapangan.</p>
                                </div>
                                <button
                                    onClick={() => setShowUpdateStageModal(true)}
                                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    Assign Team
                                </button>
                            </div>
                        </div>
                    </Show>

                    {/* Stage Progression Info for Testing */}
                    <div class="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-semibold text-slate-700">Stage Progression (Testing Mode)</h4>
                            <span class="text-xs text-slate-500">
                                Step {getCurrentStepIndex() + 2} of {getStageSteps().length + 1}
                            </span>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span class="font-medium text-slate-600">Current:</span>
                                <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold">
                                    {dummyStage()}
                                </span>
                            </div>
                            <div>
                                <span class="font-medium text-slate-600">Next:</span>
                                <span class="ml-2 text-slate-500">
                                    {getCurrentStepIndex() === -1 ? 'assigned' :
                                        getCurrentStepIndex() === getStageSteps().length - 1 ? 'completed' :
                                            getStageSteps()[getCurrentStepIndex() + 1]?.id || 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* All Stages List */}
                        <div class="mt-3 pt-3 border-t border-slate-200">
                            <p class="text-xs font-medium text-slate-600 mb-2">All Stages:</p>
                            <div class="flex flex-wrap gap-1">
                                <span class={`px-2 py-1 rounded text-xs font-medium ${dummyStage() === 'imported' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    imported
                                </span>
                                <For each={getStageSteps()}>
                                    {(step, index) => {
                                        const status = getStepStatus(index());
                                        return (
                                            <span class={`px-2 py-1 rounded text-xs font-medium ${status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                status === 'active' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                {step.id}
                                            </span>
                                        );
                                    }}
                                </For>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <For each={getStageSteps()}>
                            {(step, index) => {
                                const status = getStepStatus(index());
                                const isCurrentStep = index() === getCurrentStepIndex();

                                return (
                                    <div class="relative flex gap-4">
                                        {/* Step Number - Outside card */}
                                        <div class="relative flex-shrink-0">
                                            <div class={`w-12 h-12 rounded-full flex items-center justify-center text-white z-10 relative transition-all duration-700 ${status === 'completed' ? 'bg-emerald-500 shadow-[0_4px_10px_rgba(16,185,129,0.3)]' :
                                                status === 'active' ? 'bg-blue-500 shadow-md scale-110' : 'bg-slate-300'
                                                }`}>
                                                {status === 'completed' ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                ) : (
                                                    <span class="font-black">{index() + 1}</span>
                                                )}
                                            </div>

                                            {/* Connector Line - Outside card */}
                                            {index() < getStageSteps().length - 1 && (
                                                <div class={`absolute left-1/2 top-12 w-0.5 -translate-x-1/2 transition-all duration-700 ${status === 'completed' ? 'bg-emerald-400' : 'bg-slate-200'
                                                    }`} style={{ height: 'calc(100% + 1rem)' }} />
                                            )}
                                        </div>

                                        {/* Card Content */}
                                        <div class={`flex-1 border-2 rounded-xl p-4 ${status === 'completed' ? 'border-emerald-500 bg-emerald-50' :
                                            status === 'active' ? 'border-blue-500 bg-blue-50' :
                                                'border-slate-300 bg-white'
                                            }`}>
                                            <div class="mb-2">
                                                <div class="flex items-center justify-between mb-2">
                                                    <div class="flex items-center gap-2">
                                                        <span class="font-bold text-slate-900">{step.name}</span>
                                                        {status === 'completed' && (
                                                            <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                                                                Completed
                                                            </span>
                                                        )}
                                                        {status === 'active' && (
                                                            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
                                                                Current
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Update Stage Button - Only show for current step and if user can edit */}
                                                    {isCurrentStep && (canEdit() || isTeamLeader()) && (
                                                        <button
                                                            onClick={() => setShowUpdateStageModal(true)}
                                                            class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                                            </svg>
                                                            {step.id === 'assigned' ? 'Assign Team' : 'Update Stage'}
                                                        </button>
                                                    )}
                                                </div>

                                                <p class="text-xs text-slate-500 mb-3">{step.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        </For>
                    </div>
                </div>

                {/* Informasi Site & Lainnya */}


                {/* Tim (Struktur) */}
                <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-slate-900">Tim (Struktur)</h3>
                        <button
                            onClick={() => setShowAddTeamModal(true)}
                            disabled={isReadOnly()}
                            class="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            + Add Team
                        </button>
                    </div>
                    {loadingTeamMembers() ? (
                        <div class="p-8 text-center text-slate-500">Loading team members...</div>
                    ) : (
                        <div class="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
                            <AgGridSolid
                                columnDefs={teamColumns}
                                rowData={teamMembers()}
                                pagination={true}
                                paginationPageSize={10}
                                paginationPageSizeSelector={[10, 20, 50]}
                            />
                        </div>
                    )}
                </div>

                {/* Materials */}
                <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-slate-900">Materials</h3>
                        <button
                            onClick={() => setShowCreateMaterialModal(true)}
                            disabled={isReadOnly()}
                            class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
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
                        <button
                            disabled={isReadOnly()}
                            class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
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

                {/* Filter Payment Section - Always show for now */}
                <FilterPaymentSection
                    localStage={props.site.stage || 'imported'}
                    localPengajuan={[]}
                    localFiles={siteFiles()}
                    onAjukan={(terminKey, nominal, contextKeys) => {
                        console.log('Ajukan termin:', terminKey, nominal, contextKeys);
                        alert(`Ajukan ${terminKey} dengan nominal Rp ${nominal.toLocaleString('id-ID')}`);
                    }}
                    onApprove={(pengajuanId, nominal, terminKey, e) => {
                        console.log('Approve:', pengajuanId, nominal, terminKey);
                        alert(`Approve ${terminKey} sebesar Rp ${nominal.toLocaleString('id-ID')}`);
                    }}
                    onReject={(pengajuanId, e) => {
                        console.log('Reject:', pengajuanId);
                        const reason = prompt('Alasan penolakan:');
                        if (reason) {
                            alert(`Rejected: ${reason}`);
                        }
                    }}
                />

                {/* Cost & Payments Table */}
                <CostsPaymentSection
                    costs={[]}
                    canSubmit={canEdit()}
                    canUploadProof={canEdit()}
                    canApprove={canEdit()}
                    onSubmit={() => alert('Submit cost modal')}
                    onUploadProof={(id) => alert(`Upload proof for ${id}`)}
                    onApprove={(id) => alert(`Approve cost ${id}`)}
                    onReject={(id) => alert(`Reject cost ${id}`)}
                />

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

            {/* Add Team Modal */}
            <AddTeamModal
                show={showAddTeamModal()}
                onClose={() => setShowAddTeamModal(false)}
                onAdd={handleAddTeam}
            />

            {/* Delete Team Confirmation Modal */}
            <Show when={deleteTeamTarget()}>
                <div class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-slate-200 animate-in zoom-in-95 duration-200">
                        <div class="flex flex-col items-center text-center gap-5">
                            <div class="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-slate-900">Hapus Team Member</h3>
                                <p class="text-slate-500 mt-2 text-sm leading-relaxed">
                                    Apakah Anda yakin ingin menghapus <strong class="text-slate-800">"{deleteTeamTarget()?.name}"</strong> dari team site ini?
                                </p>
                            </div>
                            <div class="flex gap-3 w-full mt-2">
                                <button
                                    onClick={() => setDeleteTeamTarget(null)}
                                    disabled={deletingTeam()}
                                    class="flex-1 py-3.5 px-6 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all text-sm disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDeleteTeam}
                                    disabled={deletingTeam()}
                                    class="flex-1 py-3.5 px-6 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    <Show when={deletingTeam()}>
                                        <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    </Show>
                                    {deletingTeam() ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Show>

            {/* Update Stage Modal */}
            <UpdateStageModal
                isOpen={showUpdateStageModal()}
                onClose={() => setShowUpdateStageModal(false)}
                siteId={currentSite().id}
                siteName={currentSite().site_name}
                projectType="RESCOPING" // You can make this dynamic based on project data
                currentStage={dummyStage() === 'imported' ? 'imported' : dummyStage()}
                onUpdateStage={handleUpdateStage}
            />
        </Show>
    );
};

export default SiteDetailPage;
