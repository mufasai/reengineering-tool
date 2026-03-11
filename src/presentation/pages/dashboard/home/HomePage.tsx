import { createSignal, createMemo, createEffect, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { authStore } from '../../../store/auth.store';
import MapWidget from '../components/MapWidget';
// We import mock data from the newly created data file
import {
    projects, sites, teams, workOrders, activityFeed, people,
    filterTerms, combatTerms, siteMasterRecords, type ProjectType
} from '../data/mockData';

// --- Inline SVGs for icons ---
const Building2 = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>;
const Users = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const Wallet = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>;
const CheckCircle2 = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>;
const Plus = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const CreditCard = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>;
const ChevronRight = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
const Activity = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>;
const Clock = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const FileText = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>;
const UploadCloud = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m16 16-4-4-4 4" /></svg>;
const AlertCircle = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>;
const MapPin = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;

// Simple utility to format classes
const clsx = (...classes: any[]) => classes.flat().filter(Boolean).join(' ');



const formatRupiah = (amount: number) => {
    if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(0)}Jt`;
    return `Rp ${amount.toLocaleString('id-ID')}`;
};

interface HomePageProps {
    onTabChange?: (tab: string) => void;
}

const HomePage: Component<HomePageProps> = (props) => {
    const user = () => authStore.user() || { id: 'p1', name: 'Guest', role: 'engineer' };

    const [activeTab, setActiveTab] = createSignal<'overview' | 'map'>('overview');
    const [mapStageFilter, setMapStageFilter] = createSignal<string | undefined>();


    const visibleSites = createMemo(() => {
        const u = user();
        const role = u.role.toLowerCase().replace(/_/g, ' ');
        const isRestricted = ['engineer', 'team leader'].includes(role);
        if (!isRestricted) return sites;

        const userTeamIds = teams
            .filter(t => t.members.some(m => m.personId === u.id))
            .map(t => t.id);

        return sites.filter(s => s.teamId && userTeamIds.includes(s.teamId));
    });

    const activeProjects = createMemo(() => {
        const vs = visibleSites();
        const visibleProjectIds = new Set(vs.map(s => s.projectId));
        return projects.filter(p => p.status === 'active' && visibleProjectIds.has(p.id));
    });

    const totalBudget = createMemo(() => activeProjects().reduce((sum, p) => sum + (p.budget || 0), 0));

    const budgetTerpakai = createMemo(() => {
        let paid = 0;
        filterTerms.forEach(t => { if (t.status === 'paid') paid += (t.amountPaid || 0); });
        combatTerms.forEach(t => {
            t.subSteps.forEach(s => { if (s.status === 'paid') paid += (s.amountPaid || 0); });
        });
        return paid;
    });

    const sisaBudget = () => totalBudget() - budgetTerpakai();
    const terpakaiPercent = () => totalBudget() > 0 ? (budgetTerpakai() / totalBudget()) * 100 : 0;
    const sisaPercent = () => totalBudget() > 0 ? (sisaBudget() / totalBudget()) * 100 : 0;

    const pendingApprovals = createMemo(() => {
        let count = 0;
        let amount = 0;
        filterTerms.forEach(t => {
            if (t.status === 'pengajuan') { count++; amount += (t.amountRequest || 0); }
        });
        combatTerms.forEach(t => {
            t.subSteps.forEach(s => {
                if (s.status === 'pengajuan') { count++; amount += (s.amountRequest || 0); }
            });
        });
        return { count, amount };
    });

    const avgProgress = createMemo(() => {
        if (sites.length === 0) return 0;
        let totalPct = 0;
        sites.forEach(s => {
            const p = projects.find(proj => proj.id === s.projectId);
            if (p?.type === 'FILTER') {
                let pct = 0;
                filterTerms.filter(t => t.siteId === s.id && t.status === 'paid').forEach(t => pct += t.percentage);
                totalPct += pct;
            } else if (p?.type === 'COMBAT') {
                const sTerms = combatTerms.filter(t => t.siteId === s.id);
                const max = sTerms.reduce((sum, t) => sum + t.totalMaxAmount, 0);
                if (max > 0) {
                    let paid = 0;
                    sTerms.forEach(t => t.subSteps.forEach(sub => { if (sub.status === 'paid') paid += (sub.amountPaid || 0); }));
                    totalPct += (paid / max) * 100;
                }
            }
        });
        return Math.round(totalPct / sites.length);
    });

    const completedSitesCount = createMemo(() => {
        const vs = visibleSites();
        const ap = activeProjects();
        return vs.filter(s => {
            const p = ap.find(proj => proj.id === s.projectId);
            if (p?.type === 'FILTER') {
                return filterTerms.filter(t => t.siteId === s.id && t.status === 'paid').reduce((acc, t) => acc + t.percentage, 0) >= 100;
            }
            return false;
        }).length;
    });
    const activeSitesCount = () => visibleSites().length - completedSitesCount();

    const stageSummary = createMemo(() => {
        let menungguPermit = 0;
        let permitReady = 0;
        let aksesReady = 0;
        let implementasi = 0;
        let issues = 0;
        let selesai = 0;

        siteMasterRecords.forEach(master => {
            const stage = master.stage || 'imported';

            if (stage === 'permit_process') menungguPermit++;
            else if (stage === 'permit_ready') permitReady++;
            else if (stage === 'akses_ready') aksesReady++;
            else if (['implementasi', 'rfi_done', 'rfs_done', 'dokumen_done'].includes(stage)) implementasi++;
            else if (stage === 'completed') selesai++;

            if ((stage as string) === 'issue_hold' || master.stage_notes?.toLowerCase().includes('issue')) {
                issues++;
            }
        });

        return { menungguPermit, permitReady, aksesReady, implementasi, issues, selesai, total: siteMasterRecords.length };
    });

    const projectTypesList: { id: ProjectType; label: string; color: string; border: string; bg: string }[] = [
        { id: 'BLACKSITE', label: 'Blacksite', color: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50' },
        { id: 'COMBAT', label: 'Combat', color: 'text-orange-600', border: 'border-orange-200', bg: 'bg-orange-50' },
        { id: 'FILTER', label: 'Filter', color: 'text-emerald-600', border: 'border-emerald-200', bg: 'bg-emerald-50' },
        { id: 'L2H', label: 'L2H', color: 'text-blue-600', border: 'border-blue-200', bg: 'bg-blue-50' },
        { id: 'REFINEN', label: 'Refinen', color: 'text-purple-600', border: 'border-purple-200', bg: 'bg-purple-50' }
    ];

    const getTypeSummary = (type: ProjectType) => {
        const typeMasterSites = siteMasterRecords.filter(sm => sm.project_type === type);
        const importedCount = typeMasterSites.length;

        const vs = visibleSites();
        const ap = activeProjects();
        const typeSites = vs.filter(s => {
            const p = ap.find(proj => proj.id === s.projectId);
            return p?.type === type;
        });
        const activeCount = typeSites.length;
        const budget = typeSites.reduce((sum, s) => sum + s.budget, 0);

        return { importedCount, activeCount, budget };
    };

    const actionNeededList = createMemo(() => {
        let items: any[] = [];
        const vs = visibleSites();
        const ap = activeProjects();

        filterTerms.forEach(t => {
            if (!vs.find(s => s.id === t.siteId)) return;

            if (t.status === 'pengajuan') {
                const site = vs.find(s => s.id === t.siteId);
                const proj = ap.find(p => p.id === site?.projectId);
                items.push({
                    id: t.id,
                    siteName: site?.name || 'Unknown',
                    type: proj?.type || 'FILTER',
                    title: t.name,
                    statusText: 'Menunggu Review',
                    reqRole: 'management',
                    link: `/sites/${t.siteId}/termins/${t.id}/review`,
                    btnText: 'Review →',
                    btnClass: 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                });
            } else if (t.status === 'approved') {
                const site = vs.find(s => s.id === t.siteId);
                const proj = ap.find(p => p.id === site?.projectId);
                items.push({
                    id: t.id,
                    siteName: site?.name || 'Unknown',
                    type: proj?.type || 'FILTER',
                    title: t.name,
                    statusText: 'Menunggu Pembayaran',
                    reqRole: 'finance',
                    link: `/sites/${t.siteId}/termins/${t.id}/payment`,
                    btnText: 'Bayar →',
                    btnClass: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                });
            } else if (t.status === 'pending') {
                const site = vs.find(s => s.id === t.siteId);
                const proj = ap.find(p => p.id === site?.projectId);
                if (t.step === 1 || filterTerms.find(prev => prev.siteId === t.siteId && prev.step === t.step - 1 && prev.status === 'paid')) {
                    items.push({
                        id: t.id,
                        siteName: site?.name || 'Unknown',
                        type: proj?.type || 'FILTER',
                        title: t.name,
                        statusText: 'Siap Diajukan',
                        reqRole: 'team leader',
                        link: `/sites/${t.siteId}/termins/create`,
                        btnText: 'Submit →',
                        btnClass: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                    });
                }
            }
        });

        let visibleItems = items;
        const uRole = user().role.toLowerCase().replace(/_/g, ' ');
        if (uRole === 'management' || uRole === 'backoffice_admin') {
            visibleItems = items.filter(i => i.reqRole === 'management');
        } else if (uRole === 'finance') {
            visibleItems = items.filter(i => i.reqRole === 'finance');
        } else if (uRole === 'team_leader') {
            visibleItems = items.filter(i => i.reqRole === 'team leader');
        } else if (uRole === 'engineer') {
            visibleItems = [];
        }

        return visibleItems.slice(0, 5);
    });

    const getBadgeClass = (type: ProjectType) => {
        const conf = projectTypesList.find(p => p.id === type);
        return conf ? `${conf.bg} ${conf.color} border-${conf.border}` : 'bg-slate-100 text-slate-600';
    };

    return (
        <div class="space-y-6 pb-16 min-h-screen">
            {/* SECTION 1: PAGE HEADER & QUICK ACTION BAR */}
            <div class="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-xl font-bold text-slate-800">Dashboard</h1>
                        <p class="text-slate-500 mt-1">Selamat datang kembali, <span class="font-semibold text-slate-700">{user().name}</span> 👋</p>
                    </div>
                    <div class="flex items-center gap-3 text-sm">
                        <div class="text-slate-500 text-right">
                            <p class="font-medium text-slate-700">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p class="capitalize">{user().role.replace(/_/g, ' ')}</p>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                            {user().name.charAt(0)}
                        </div>
                    </div>
                </div>

                {/* Quick Action Bar (Role Sensitive) */}
                <div class="bg-slate-50 border-t border-slate-200 px-6 py-3 flex gap-3 overflow-x-auto">
                    <Show when={['management', 'backoffice_admin'].includes(user().role)}>
                        <button onClick={() => props.onTabChange?.('WO')} class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
                            <Plus class="w-4 h-4 text-blue-600" /> Input WO
                        </button>
                        <button onClick={() => props.onTabChange?.('PROJECTS')} class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
                            <Plus class="w-4 h-4 text-emerald-600" /> Tambah Project
                        </button>
                    </Show>
                    <Show when={user().role === 'team_leader' || user().role === 'team leader'}>
                        <button class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
                            <FileText class="w-4 h-4 text-amber-600" /> Ajukan Termin
                        </button>
                        <button class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
                            <CheckCircle2 class="w-4 h-4 text-blue-600" /> Buat SKP
                        </button>
                    </Show>
                    <Show when={user().role === 'finance'}>
                        <button class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
                            <CreditCard class="w-4 h-4 text-emerald-600" /> Proses Pembayaran
                        </button>
                    </Show>
                    <Show when={user().role === 'engineer'}>
                        <button class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
                            <UploadCloud class="w-4 h-4 text-blue-600" /> Upload Evidence
                        </button>
                    </Show>
                </div>
            </div>

            {/* SECTION 2: FINANCIAL KPI ROW */}
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* 1. Total Budget */}
                <div class="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                    <div class="flex items-center justify-between relative z-10">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Budget</span>
                        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                            <Wallet class="w-5 h-5" />
                        </div>
                    </div>
                    <div class="relative z-10 mt-auto">
                        <div class="text-2xl font-black text-slate-800 tracking-tight leading-none">{formatRupiah(totalBudget())}</div>
                        <div class="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            {activeProjects().length} Proyek Aktif
                        </div>
                    </div>
                </div>

                {/* 2. Budget Terpakai */}
                <div class="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                    <div class="flex items-center justify-between relative z-10">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Terpakai</span>
                        <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 transition-transform group-hover:scale-110">
                            <CreditCard class="w-5 h-5" />
                        </div>
                    </div>
                    <div class="relative z-10 mt-auto space-y-2">
                        <div>
                            <div class="text-2xl font-black text-slate-800 tracking-tight leading-none">{formatRupiah(budgetTerpakai())}</div>
                            <div class="text-[11px] text-slate-400 mt-1.5">{terpakaiPercent().toFixed(1)}% dari total</div>
                        </div>
                        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(terpakaiPercent(), 100)}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* 3. Sisa Budget */}
                <div class="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                    <div class="flex items-center justify-between relative z-10">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sisa Budget</span>
                        <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                            <CheckCircle2 class="w-5 h-5" />
                        </div>
                    </div>
                    <div class="relative z-10 mt-auto">
                        <div class="flex items-baseline gap-2">
                            <div class="text-2xl font-black text-slate-800 tracking-tight leading-none">{formatRupiah(sisaBudget())}</div>
                        </div>
                        <div class="text-[11px] text-emerald-600 font-medium mt-1.5">Tersedia untuk termin</div>
                    </div>
                </div>

                {/* 4. Menunggu Approval */}
                <div class="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden group">
                    <div class="flex items-center justify-between relative z-10">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Approval</span>
                        <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 transition-transform group-hover:scale-110">
                            <Clock class="w-5 h-5" />
                        </div>
                    </div>
                    <div class="relative z-10 mt-auto">
                        <div class="flex items-center gap-2">
                            <div class="text-2xl font-black text-slate-800 tracking-tight leading-none">{pendingApprovals().count}</div>
                            <span class="text-xs font-bold text-slate-400 uppercase">Pengajuan</span>
                        </div>
                        <div class="text-[11px] text-orange-600 font-medium mt-1.5 flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                            {formatRupiah(pendingApprovals().amount)} Pending
                        </div>
                    </div>
                </div>

                {/* 5. Rata-rata Progress */}
                <div class="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between h-[120px] shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                    <div class="flex items-center justify-between relative z-10">
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Progress</span>
                        <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110">
                            <Activity class="w-5 h-5" />
                        </div>
                    </div>
                    <div class="flex items-end justify-between relative z-10 mt-auto">
                        <div>
                            <div class="text-2xl font-black text-slate-800 tracking-tight leading-none">{avgProgress()}%</div>
                            <div class="text-[11px] text-slate-400 mt-1.5">{activeSitesCount()} sites active</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2.5: TAB 1 STAGE SUMMARY (site_master) */}
            <Show when={activeTab() === 'overview'}>
                <div class="mb-6">
                    <h3 class="text-sm font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2 flex items-center gap-2">
                        <MapPin class="w-4 h-4 text-emerald-500" />
                        Status Lapangan <span class="text-xs font-normal text-slate-500">({stageSummary().total} Total Records)</span>
                    </h3>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div onClick={() => { setActiveTab('map'); setMapStageFilter('permit_process'); }} class="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-center items-center h-[70px] shadow-sm cursor-pointer hover:border-slate-300 hover:bg-slate-50 transition-colors">
                            <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 text-center leading-tight hover:underline">Menunggu<br />Permit</span>
                            <span class="text-lg font-bold text-slate-700">{stageSummary().menungguPermit}</span>
                        </div>
                        <div onClick={() => { setActiveTab('map'); setMapStageFilter('permit_ready'); }} class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex flex-col justify-center items-center h-[70px] shadow-sm cursor-pointer hover:border-emerald-300 hover:bg-emerald-100/50 transition-colors">
                            <span class="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider mb-1 text-center leading-tight hover:underline">Permit<br />Ready</span>
                            <span class="text-lg font-bold text-emerald-700">{stageSummary().permitReady}</span>
                        </div>
                        <div onClick={() => { setActiveTab('map'); setMapStageFilter('akses_ready'); }} class="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col justify-center items-center h-[70px] shadow-sm cursor-pointer hover:border-blue-300 hover:bg-blue-100/50 transition-colors">
                            <span class="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1 text-center leading-tight hover:underline">Akses<br />Ready</span>
                            <span class="text-lg font-bold text-blue-700">{stageSummary().aksesReady}</span>
                        </div>
                        <div onClick={() => { setActiveTab('map'); setMapStageFilter('implementasi'); }} class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 flex flex-col justify-center items-center h-[70px] shadow-sm cursor-pointer hover:border-indigo-300 hover:bg-indigo-100/50 transition-colors">
                            <span class="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider mb-1 hover:underline">Implementasi</span>
                            <span class="text-lg font-bold text-indigo-700">{stageSummary().implementasi}</span>
                        </div>
                        <div onClick={() => { setActiveTab('map'); setMapStageFilter('issue_hold'); }} class="bg-amber-50 border border-amber-200 rounded-lg p-3 flex flex-col justify-center items-center h-[70px] shadow-sm relative overflow-hidden group cursor-pointer hover:border-amber-400 hover:bg-amber-100/50 transition-colors">
                            <Show when={stageSummary().issues > 0}>
                                <div class="absolute inset-0 bg-red-100/50 animate-pulse mix-blend-multiply pointer-events-none"></div>
                            </Show>
                            <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1 relative z-10 pointer-events-none group-hover:underline">
                                Issue
                            </span>
                            <span class="text-lg font-bold text-amber-700 relative z-10 pointer-events-none">{stageSummary().issues}</span>
                        </div>
                        <div onClick={() => { setActiveTab('map'); setMapStageFilter('completed'); }} class="bg-emerald-500 border border-emerald-600 rounded-lg p-3 flex flex-col justify-center items-center h-[70px] shadow-sm text-white relative cursor-pointer hover:bg-emerald-600 transition-colors group">
                            <span class="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider mb-1 pointer-events-none group-hover:underline">Selesai</span>
                            <span class="text-lg font-bold text-white pointer-events-none">{stageSummary().selesai}</span>
                            <CheckCircle2 class="w-8 h-8 absolute -right-2 -bottom-2 text-white/20 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </Show>

            {/* SECTION 3: TAB 1 STRIP & OVERVIEW PER TIPE (site_master driven) */}
            <Show when={activeTab() === 'overview'}>
                {/* STRIP */}
                <div class="bg-slate-50 border border-slate-200 rounded-md px-4 py-2 flex items-center gap-4 text-sm font-medium text-slate-600 overflow-x-auto shadow-sm backdrop-blur-sm mb-6">
                    <div class="flex items-center gap-2 whitespace-nowrap px-3 py-1 bg-white rounded-md border border-slate-200 shadow-sm">
                        <Users class="w-4 h-4 text-coral-500" />
                        <span class="font-bold text-slate-800">{teams.length}</span> Teams Active
                    </div>
                </div>

                {/* OVERVIEW PER TIPE ROW */}
                <div>
                    <h3 class="text-sm font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <Activity class="w-4 h-4 text-blue-500" />
                            Overview per Tipe
                        </div>
                        <span class="text-xs font-normal text-slate-500 hover:text-blue-600 cursor-pointer flex items-center">
                            Lihat Semua Tipe <ChevronRight class="w-3 h-3 ml-1" />
                        </span>
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <For each={projectTypesList}>
                            {(t) => {
                                const summary = getTypeSummary(t.id);
                                return (
                                    <div onClick={() => props.onTabChange?.(t.id)} class="cursor-pointer bg-white border text-left border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:border-blue-300 group flex flex-col justify-between h-[120px]">
                                        <div>
                                            <div class="flex justify-between items-start mb-2">
                                                <span class="text-xs font-bold text-slate-500 tracking-wider">TIPE</span>
                                                <span class={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3", t.bg, t.color)}>
                                                    <Building2 class="w-4 h-4" />
                                                </span>
                                            </div>
                                            <h4 class="text-lg font-black text-slate-800">{t.label}</h4>
                                        </div>
                                        <div class="flex items-center gap-2 mt-2">
                                            <div class="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 border border-slate-200">
                                                {summary.importedCount} Master
                                            </div>
                                            <Show when={summary.activeCount > 0}>
                                                <div class="bg-blue-50 px-2 py-1 rounded text-[10px] font-bold text-blue-600 border border-blue-200 flex items-center gap-1 shrink-0">
                                                    <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                                    {summary.activeCount} Aktif
                                                </div>
                                            </Show>
                                        </div>
                                    </div>
                                );
                            }}
                        </For>
                    </div>
                </div>
            </Show>

            {/* SECTION 5: DASHBOARD TABS */}
            <div class="flex bg-slate-900 border-b-2 border-slate-800 text-slate-300 px-6 pt-1 sticky top-16 z-30 shadow-md">
                <button
                    onClick={() => setActiveTab('overview')}
                    class={clsx(
                        "px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 -mb-[2px]",
                        activeTab() === 'overview'
                            ? 'border-blue-400 text-white bg-slate-800/50 rounded-t-lg'
                            : 'border-transparent hover:text-white hover:bg-slate-800/30 rounded-t-lg'
                    )}
                >
                    <Building2 class="w-4 h-4" />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('map')}
                    class={clsx(
                        "px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 -mb-[2px]",
                        activeTab() === 'map'
                            ? 'border-blue-400 text-white bg-slate-800/50 rounded-t-lg'
                            : 'border-transparent hover:text-white hover:bg-slate-800/30 rounded-t-lg'
                    )}
                >
                    <MapPin class="w-4 h-4" />
                    Peta Sites
                </button>
            </div>

            {/* TAB CONTENT: PETA SITES */}
            <Show when={activeTab() === 'map'}>
                <div class="h-[calc(100vh-140px)] w-full relative -mx-6 -mb-16 -mt-6">
                    <MapWidget
                        height="100%"
                        presetStage={mapStageFilter()}
                    />
                </div>
            </Show>

            {/* TAB CONTENT: OVERVIEW */}
            <Show when={activeTab() === 'overview'}>
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">

                    {/* LEFT COLUMN (60%) */}
                    <div class="lg:col-span-7 space-y-6">
                        {/* Action Needed */}
                        <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
                            <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                <h3 class="font-bold text-slate-800 flex items-center gap-2">
                                    <AlertCircle class="w-4 h-4 text-red-500" />
                                    Butuh Tindakan Segera
                                </h3>
                                <Show when={actionNeededList().length > 0}>
                                    <span class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{actionNeededList().length} Tasks</span>
                                </Show>
                            </div>
                            <div class="divide-y divide-slate-100">
                                <Show when={actionNeededList().length === 0} fallback={
                                    <For each={actionNeededList()}>
                                        {(item) => (
                                            <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                <div>
                                                    <div class="flex items-center gap-2 mb-1">
                                                        <span class={clsx("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase", getBadgeClass(item.type))}>{item.type}</span>
                                                        <span class="font-semibold text-slate-800 text-sm">{item.siteName}</span>
                                                        <span class="text-slate-400 text-xs px-2">·</span>
                                                        <span class="text-slate-600 text-sm font-medium">{item.title}</span>
                                                    </div>
                                                    <div class="text-xs text-slate-500 flex items-center gap-1">
                                                        <Clock class="w-3 h-3 text-amber-500" /> {item.statusText}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => props.onTabChange?.('TERMIN')}
                                                    class={clsx("px-3 py-1.5 rounded text-xs font-bold transition-colors whitespace-nowrap", item.btnClass)}
                                                >
                                                    {item.btnText}
                                                </button>
                                            </div>
                                        )}
                                    </For>
                                }>
                                    <div class="p-6 text-center text-sm text-slate-500 italic">
                                        Tidak ada tugas yang membutuhkan tindakan Anda saat ini.
                                    </div>
                                </Show>
                            </div>
                        </div>

                        {/* Recent Activity Feed */}
                        <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
                            <div class="px-4 py-3 border-b border-slate-100">
                                <h3 class="font-bold text-slate-800">Aktivitas Terbaru</h3>
                            </div>
                            <div class="p-4">
                                <ul class="space-y-4">
                                    <For each={activityFeed}>
                                        {(log) => {
                                            const u = people.find(p => p.id === log.userId);
                                            const initial = u ? u.name.charAt(0) : '?';
                                            return (
                                                <li class="flex gap-3 text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                                    <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                                                        {initial}
                                                    </div>
                                                    <div class="flex-1">
                                                        <div>
                                                            <span class="font-semibold text-slate-800">{u?.name || 'Unknown'}</span>{' '}
                                                            <span class="text-slate-600">{log.action}</span>
                                                            {' · '}
                                                            <span class="font-medium text-slate-700">{log.target}</span>
                                                        </div>
                                                        <div class="text-xs text-slate-400 mt-0.5">{log.timestamp}</div>
                                                    </div>
                                                </li>
                                            );
                                        }}
                                    </For>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (40%) */}
                    <div class="lg:col-span-5 space-y-6">
                        {/* Active Projects List */}
                        <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
                            <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                <h3 class="font-bold text-slate-800">Proyek Aktif</h3>
                                <button onClick={() => props.onTabChange?.('PROJECTS')} class="text-xs font-medium text-blue-600 hover:text-blue-700">Lihat Semua →</button>
                            </div>
                            <div class="divide-y divide-slate-100">
                                <For each={activeProjects().slice(0, 4)}>
                                    {(p) => {
                                        const pSites = sites.filter(s => s.projectId === p.id);
                                        const pBudget = p.budget || 0;
                                        const pCost = pBudget * 0.4;
                                        const usedPct = pBudget > 0 ? (pCost / pBudget) * 100 : 0;

                                        return (
                                            <div class="p-4 hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => props.onTabChange?.('PROJECTS')}>
                                                <div class="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 class="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{p.name}</h4>
                                                        <div class="flex items-center gap-2 mt-1">
                                                            <span class={clsx("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase", getBadgeClass(p.type as ProjectType))}>{p.type}</span>
                                                            <span class="text-xs text-slate-500">{pSites.length} sites</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight class="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                </div>
                                                <div>
                                                    <div class="flex justify-between text-[10px] text-slate-500 mb-1">
                                                        <span>Budget Used</span>
                                                        <span class="font-mono">{usedPct.toFixed(0)}%</span>
                                                    </div>
                                                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div class="h-full bg-blue-500" style={{ width: `${usedPct}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }}
                                </For>
                            </div>
                        </div>

                        {/* Recent Work Orders */}
                        <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
                            <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                                <h3 class="font-bold text-slate-800">Work Orders</h3>
                                <Show when={['management', 'backoffice_admin'].includes(user().role)}>
                                    <button onClick={() => props.onTabChange?.('WO')} class="text-xs font-medium text-blue-600 hover:text-blue-700">+ Input WO</button>
                                </Show>
                            </div>
                            <div class="p-0 overflow-x-auto">
                                <table class="w-full text-left text-sm whitespace-nowrap">
                                    <thead>
                                        <tr class="bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
                                            <th class="px-4 py-2 font-semibold">WO Number</th>
                                            <th class="px-4 py-2 font-semibold">Status</th>
                                            <th class="px-4 py-2 font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        <For each={workOrders.slice(0, 4)}>
                                            {(wo) => (
                                                <tr class="hover:bg-slate-50 cursor-pointer" onClick={() => props.onTabChange?.('WO')}>
                                                    <td class="px-4 py-2 flex flex-col">
                                                        <span class="font-mono font-bold text-slate-700 hover:text-blue-600 transition-colors">{wo.woNumber}</span>
                                                        <span class="text-[10px] text-slate-400 truncate max-w-[120px]">{wo.pemberiKerja}</span>
                                                    </td>
                                                    <td class="px-4 py-2">
                                                        <span class={clsx(
                                                            "inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                                                            wo.status === 'Unassigned' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                                                                wo.status === 'Pending SPK Approval' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                    wo.status === 'SPK Created' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                                        'bg-blue-50 text-blue-700 border-blue-200'
                                                        )}>
                                                            {wo.status}
                                                        </span>
                                                    </td>
                                                    <td class="px-4 py-2 text-xs text-slate-500">{new Date(wo.tanggalWo).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</td>
                                                </tr>
                                            )}
                                        </For>
                                    </tbody>
                                </table>
                            </div>
                            <div class="px-4 py-2 border-t border-slate-100 text-center">
                                <button onClick={() => props.onTabChange?.('WO')} class="text-xs text-slate-500 hover:text-slate-800">Lihat Semua WOs</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default HomePage;
