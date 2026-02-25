import type { Component } from 'solid-js';
import type { Site } from '../../../../domain/entities/work-order.entity';

interface TerminDetailPageProps {
    site: Site;
    terminNumber: number;
    onBack: () => void;
    onReview?: () => void;
    onApprove?: () => void;
    onReject?: () => void;
    onPayment?: () => void;
    initialStatus?: 'pending_review' | 'field_head_review' | 'director_approval' | 'finance_payment' | 'approved' | 'rejected' | 'completed';
}

const TerminDetailPage: Component<TerminDetailPageProps> = (props) => {
    // Create reactive data based on initialStatus prop
    const terminData = () => {
        const status = props.initialStatus || 'pending_review';
        const baseData = {
            id: `termin_${props.terminNumber}`,
            type: `termin_${props.terminNumber}`,
            tanggal: '20/02/2026',
            jumlah: 400000000,
            keterangan: `pengajuan termin ${props.terminNumber}`,
            dibuat: '20/02/2026 14:35',
            status: status,
        };

        // If status is approved or finance_payment, show reviewed and approved info
        if (status === 'approved' || status === 'finance_payment') {
            return {
                ...baseData,
                diperbarui: '20/02/2026 14:40',
                reviewedBy: 'John Doe',
                reviewedAt: '20/02/2026 14:37',
            };
        }

        // If status is director_approval, show reviewed info
        if (status === 'director_approval') {
            return {
                ...baseData,
                diperbarui: '20/02/2026 14:37',
                reviewedBy: 'John Doe',
                reviewedAt: '20/02/2026 14:37'
            };
        }

        // Default: pending_review
        return {
            ...baseData,
            diperbarui: '20/02/2026 14:35',
        };
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_review':
            case 'field_head_review':
                return { text: 'Pending Review', class: 'bg-yellow-400 text-slate-900' };
            case 'director_approval':
                return { text: 'Pending', class: 'bg-yellow-400 text-slate-900' };
            case 'finance_payment':
            case 'approved':
                return { text: 'Approved', class: 'bg-cyan-500 text-white' };
            case 'rejected':
                return { text: 'Rejected', class: 'bg-red-500 text-white' };
            case 'completed':
                return { text: 'Completed', class: 'bg-emerald-500 text-white' };
            default:
                return { text: status, class: 'bg-slate-400 text-white' };
        }
    };

    const getAlertMessage = (status: string) => {
        switch (status) {
            case 'pending_review':
            case 'field_head_review':
                return {
                    title: 'Menunggu Review Final Hasil',
                    message: 'Termin ini memerlukan review dari lead hasil sebelum dilanjutkan ke direktur',
                    showReviewButton: true,
                    showApproveButtons: false,
                    showPaymentButton: false,
                    alertColor: 'yellow'
                };
            case 'director_approval':
                return {
                    title: 'Menunggu Persetujuan Direktur',
                    message: 'Termin ini sudah disetujui field head dan menunggu persetujuan direktur',
                    showReviewButton: false,
                    showApproveButtons: true,
                    showPaymentButton: false,
                    alertColor: 'yellow'
                };
            case 'finance_payment':
            case 'approved':
                return {
                    title: 'Menunggu Pembayaran',
                    message: `Disetujui oleh: John Doe pada 20/02/2026 14:40\nTermin ini menunggu pembayaran oleh keuangan`,
                    showReviewButton: false,
                    showApproveButtons: false,
                    showPaymentButton: true,
                    alertColor: 'cyan'
                };
            default:
                return null;
        }
    };

    const handleReviewTermin = () => {
        console.log('Navigate to review page');
        if (props.onReview) {
            props.onReview();
        }
    };

    const handleApproveTermin = () => {
        console.log('Approve termin');
        // Add approval logic here
        if (props.onApprove) {
            props.onApprove();
        }
    };

    const handleRejectTermin = () => {
        console.log('Reject termin');
        // Add rejection logic here
        if (props.onReject) {
            props.onReject();
        }
    };

    const handlePaymentTermin = () => {
        console.log('Navigate to payment page');
        if (props.onPayment) {
            props.onPayment();
        }
    };

    const handleUploadFile = () => {
        console.log('Upload file');
        // Open file upload dialog
    };

    return (
        <div class="min-h-screen bg-slate-50">
            <div class="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h1 class="text-3xl font-bold text-slate-900">Detail Termin TERMIN_{props.terminNumber}</h1>
                            <p class="text-sm text-slate-500 mt-1">Site B - Example Project Fiber</p>
                        </div>
                        <button
                            onClick={() => props.onBack()}
                            class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all"
                        >
                            ← Kembali
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Termin Info */}
                    <div class="lg:col-span-2 space-y-6">
                        {/* Informasi Termin */}
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h2 class="text-lg font-bold text-slate-900 mb-6">Informasi Termin</h2>

                            <div class="space-y-4">
                                <div class="flex items-start justify-between py-3 border-b border-slate-100">
                                    <span class="text-sm font-semibold text-slate-600">Type Termin</span>
                                    <span class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded">
                                        {terminData().type}
                                    </span>
                                </div>

                                <div class="flex items-start justify-between py-3 border-b border-slate-100">
                                    <span class="text-sm font-semibold text-slate-600">Tanggal Termin</span>
                                    <span class="text-sm text-slate-900">: {terminData().tanggal}</span>
                                </div>

                                <div class="flex items-start justify-between py-3 border-b border-slate-100">
                                    <span class="text-sm font-semibold text-slate-600">Jumlah</span>
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm text-slate-900">: Rp {terminData().jumlah.toLocaleString('id-ID')}</span>
                                        <button class="text-slate-400 hover:text-slate-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div class="flex items-start justify-between py-3 border-b border-slate-100">
                                    <span class="text-sm font-semibold text-slate-600">Status</span>
                                    <span class={`inline-block px-3 py-1 text-sm font-semibold rounded ${getStatusBadge(terminData().status).class}`}>
                                        {getStatusBadge(terminData().status).text}
                                    </span>
                                </div>

                                <div class="flex items-start justify-between py-3 border-b border-slate-100">
                                    <span class="text-sm font-semibold text-slate-600">Keterangan</span>
                                    <span class="text-sm text-slate-900 text-right max-w-md">: {terminData().keterangan}</span>
                                </div>

                                {'reviewedBy' in terminData() && (
                                    <div class="flex items-start justify-between py-3 border-b border-slate-100">
                                        <span class="text-sm font-semibold text-slate-600">Reviewed Oleh</span>
                                        <span class="text-sm text-slate-900">: {(terminData() as any).reviewedBy} - {(terminData() as any).reviewedAt}</span>
                                    </div>
                                )}

                                <div class="flex items-start justify-between py-3 border-b border-slate-100">
                                    <span class="text-sm font-semibold text-slate-600">Dibuat</span>
                                    <span class="text-sm text-slate-900">: {terminData().dibuat}</span>
                                </div>

                                <div class="flex items-start justify-between py-3">
                                    <span class="text-sm font-semibold text-slate-600">Diperbarui</span>
                                    <span class="text-sm text-slate-900">: {terminData().diperbarui}</span>
                                </div>
                            </div>
                        </div>

                        {/* Alert - Show based on status */}
                        {getAlertMessage(terminData().status) && (() => {
                            const alert = getAlertMessage(terminData().status)!;
                            const bgColor = alert.alertColor === 'cyan' ? 'bg-cyan-50 border-cyan-400' : 'bg-yellow-50 border-yellow-400';
                            const iconColor = alert.alertColor === 'cyan' ? 'text-cyan-400' : 'text-yellow-400';
                            const textColor = alert.alertColor === 'cyan' ? 'text-cyan-800' : 'text-yellow-800';
                            const descColor = alert.alertColor === 'cyan' ? 'text-cyan-700' : 'text-yellow-700';
                            const emoji = alert.alertColor === 'cyan' ? '💰' : '⚠️';

                            return (
                                <div class={`${bgColor} border-l-4 p-4 rounded-lg`}>
                                    <div class="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" class={`h-5 w-5 ${iconColor} mt-0.5 mr-3`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                        </svg>
                                        <div class="flex-1">
                                            <h3 class={`text-sm font-semibold ${textColor} mb-1`}>{emoji} {alert.title}</h3>
                                            <p class={`text-sm ${descColor} mb-3 whitespace-pre-line`}>{alert.message}</p>

                                            {alert.showReviewButton && (
                                                <button
                                                    onClick={handleReviewTermin}
                                                    class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-all inline-flex items-center gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                                        <polyline points="10 9 9 9 8 9"></polyline>
                                                    </svg>
                                                    Review Termin
                                                </button>
                                            )}

                                            {alert.showApproveButtons && (
                                                <div class="flex gap-2">
                                                    <button
                                                        onClick={handleApproveTermin}
                                                        class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all inline-flex items-center gap-2"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <polyline points="20 6 9 17 4 12"></polyline>
                                                        </svg>
                                                        Setujui Termin
                                                    </button>
                                                    <button
                                                        onClick={handleRejectTermin}
                                                        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-all inline-flex items-center gap-2"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                                        </svg>
                                                        Tolak Termin
                                                    </button>
                                                </div>
                                            )}

                                            {alert.showPaymentButton && (
                                                <button
                                                    onClick={handlePaymentTermin}
                                                    class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all inline-flex items-center gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                                    </svg>
                                                    Proses Pembayaran
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Files Termin */}
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <div class="flex items-center justify-between mb-4">
                                <h2 class="text-lg font-bold text-slate-900">Files Termin</h2>
                                <button
                                    onClick={handleUploadFile}
                                    class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all"
                                >
                                    + Upload File
                                </button>
                            </div>
                            <div class="text-center py-12">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <p class="text-sm text-slate-400">Belum ada files</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info Site */}
                    <div class="lg:col-span-1">
                        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
                            <h3 class="text-lg font-bold text-slate-900 mb-4">Info Site</h3>

                            <div class="space-y-3">
                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Site Name</p>
                                    <p class="text-sm font-semibold text-slate-900">: {props.site.site_name}</p>
                                </div>

                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Project</p>
                                    <p class="text-sm font-semibold text-slate-900">: Example Project Fiber</p>
                                </div>

                                <div>
                                    <p class="text-xs text-slate-500 mb-1">Max Value</p>
                                    <p class="text-sm font-semibold text-slate-900">: Rp {props.site.maximal_budget.toLocaleString('id-ID')}</p>
                                </div>
                            </div>

                            <div class="mt-6 pt-6 border-t border-slate-200">
                                <h4 class="text-sm font-bold text-slate-900 mb-3">Progress Workflow</h4>
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs text-slate-600">Progress</span>
                                        <span class="text-xs font-semibold text-slate-900">{props.terminNumber}/4</span>
                                    </div>
                                    <div class="w-full bg-slate-200 rounded-full h-2">
                                        <div class="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(props.terminNumber / 4) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminDetailPage;
