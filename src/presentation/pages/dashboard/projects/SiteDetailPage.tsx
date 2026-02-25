import { For } from 'solid-js';
import type { Component } from 'solid-js';
import type { Site } from '../../../../domain/entities/work-order.entity';

interface SiteDetailPageProps {
    site: Site;
    onBack: () => void;
}

const SiteDetailPage: Component<SiteDetailPageProps> = (props) => {

    // Mock data for termins
    const termins = [
        { id: 1, name: 'Termin 1', status: 'active', progress: 0, description: 'Pembayaran termin pertama' },
        { id: 2, name: 'Termin 2', status: 'pending', progress: 0, description: 'Pembayaran termin kedua' },
        { id: 3, name: 'Termin 3', status: 'pending', progress: 0, description: 'Pembayaran termin ketiga' },
        { id: 4, name: 'Termin 4', status: 'pending', progress: 0, description: 'Pembayaran termin keempat' },
    ];

    // Mock data for team
    const teamMembers = [
        { no: 1, name: 'Jane Smith', role: 'member', vendor: 'Vendor A', no_hp: '08XX1234567', jabatan: 'Staff' },
        { no: 2, name: 'Bob Johnson', role: 'member', vendor: 'Vendor D', no_hp: '08XX7891234', jabatan: 'Supervisor' },
    ];

    // Mock data for materials
    const materials = [
        { id: 1, skp: 'SKP-2024-001', name: 'ODP 12 CORE', qty: 10, unit: 'unit', tanggal: '01/04/2024', actions: 'Approved' },
    ];

    // Mock data for site files
    const siteFiles = [
        { id: 1, title: 'Desain Material Pelaksanaan Struktur.xlsx', original_name: 'design.xlsx', size: 500, uploaded_at: '2024/02/26 07:52', actions: ['Download', 'Delete'] },
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
                                            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
                                                {termin.progress}%
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
                                                    Sedang Dikerjakan
                                                </span>
                                                <button class="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg transition-all">
                                                    Ajukan Termin {termin.id}
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
                            <span class="text-sm text-slate-500">Max Value</span>
                            <span class="text-sm font-medium text-slate-900">Rp {props.site.maximal_budget.toLocaleString('id-ID')}</span>
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
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Role</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Vendor</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No HP</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Jabatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={teamMembers}>
                                {(member) => (
                                    <tr class="border-b border-slate-100 hover:bg-slate-50">
                                        <td class="px-4 py-3 text-sm text-slate-700">{member.no}</td>
                                        <td class="px-4 py-3 text-sm text-slate-900 font-medium">{member.name}</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{member.role}</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{member.vendor}</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{member.no_hp}</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{member.jabatan}</td>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </table>
                    <div class="p-3 text-xs text-slate-500 border-t border-slate-100">
                        Showing 1 to 2 of 2 entries
                    </div>
                </div>
            </div>

            {/* Materials */}
            <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div class="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-slate-900">Materials</h3>
                    <button class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all">
                        + Add Material
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">SKP</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Qty</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Unit</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tanggal</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={materials}>
                                {(material) => (
                                    <tr class="border-b border-slate-100 hover:bg-slate-50">
                                        <td class="px-4 py-3 text-sm text-slate-700">{material.id}</td>
                                        <td class="px-4 py-3 text-sm text-slate-900 font-medium">{material.skp}</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{material.name}</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{material.qty}</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{material.unit}</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{material.tanggal}</td>
                                        <td class="px-4 py-3">
                                            <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                                                {material.actions}
                                            </span>
                                        </td>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </table>
                    <div class="p-3 text-xs text-slate-500 border-t border-slate-100">
                        Showing 1 to 1 of 1 entries
                    </div>
                </div>
            </div>

            {/* Site Files */}
            <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div class="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-slate-900">Site Files</h3>
                    <button class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-all">
                        + Upload File
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Title</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Original Name</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Size</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Uploaded At</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={siteFiles}>
                                {(file) => (
                                    <tr class="border-b border-slate-100 hover:bg-slate-50">
                                        <td class="px-4 py-3 text-sm text-slate-700">{file.id}</td>
                                        <td class="px-4 py-3 text-sm text-slate-900 font-medium">{file.title}</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{file.original_name}</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{(file.size / 1024).toFixed(2)} KB</td>
                                        <td class="px-4 py-3 text-sm text-slate-700">{file.uploaded_at}</td>
                                        <td class="px-4 py-3">
                                            <div class="flex gap-2">
                                                <button class="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-600">
                                                    Download
                                                </button>
                                                <button class="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-red-600">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </table>
                    <div class="p-3 text-xs text-slate-500 border-t border-slate-100">
                        Showing 1 to 1 of 1 entries
                    </div>
                </div>
            </div>

            {/* Termins */}
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 class="text-lg font-bold text-slate-900 mb-4">Termins</h2>
                <p class="text-sm text-slate-500">Belum ada termins</p>
            </div>
        </div>
    );
};

export default SiteDetailPage;
