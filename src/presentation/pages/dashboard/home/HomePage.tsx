import { createSignal, createMemo, For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { authStore } from '../../../store/auth.store';
import MapWidget from '../components/MapWidget';
import ModernKPICard from '../../../components/cards/ModernKPICard';
import {
    sites, teams, activityFeed, people,
    filterTerms, combatTerms, siteMasterRecords, type ProjectType
} from '../data/mockData';

// --- Inline SVGs for icons ---
const Building2 = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={p.strokeWidth || "2"} stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>;
const Wallet = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={p.strokeWidth || "2"} stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>;
const CheckCircle2 = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={p.strokeWidth || "2"} stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>;
const CreditCard = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={p.strokeWidth || "2"} stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>;
const Activity = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={p.strokeWidth || "2"} stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>;
const Clock = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={p.strokeWidth || "2"} stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const MapPin = (p: any) => <svg xmlns="http://www.w3.org/2000/svg" class={p.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={p.strokeWidth || "2"} stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;

const clsx = (...classes: any[]) => classes.flat().filter(Boolean).join(' ');

// Helper to format currency
const formatRupiah = (amount: number) => {
    if (amount == null || isNaN(amount)) return 'Rp 0';
    if (amount >= 1e9) return `Rp ${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `Rp ${(amount / 1e6).toFixed(0)}Jt`;
    return `Rp ${amount.toLocaleString('id-ID')}`;
};

interface HomePageProps {
    onTabChange?: (tab: string) => void;
}

const HomePage: Component<HomePageProps> = (props) => {
    const user = () => authStore.user() || { id: 'p1', name: 'Guest', role: 'engineer' };

    const [activeTab, setActiveTab] = createSignal<'overview' | 'map'>('overview');
    const [mapStageFilter, setMapStageFilter] = createSignal<string | undefined>();

    // ----------------------------------------------------------------------
    // 1. VISIBLE SITES
    // ----------------------------------------------------------------------
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

    // ----------------------------------------------------------------------
    // 2. STATUS LAPANGAN (STAGES SUMMARY FROM siteMasterRecords)
    // ----------------------------------------------------------------------
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

    // ----------------------------------------------------------------------
    // 3. FINANCIAL SUMMARY
    // ----------------------------------------------------------------------
    const financials = createMemo(() => {
        let totalHarga = 0;
        let terminTerbayar = 0;
        let menungguApprovalCount = 0;
        
        // Sum total harga across active sites (from site master)
        const vs = visibleSites();
        vs.forEach(s => {
            const master = siteMasterRecords.find(m => m.site_id === s.id);
            if (master) {
                totalHarga += (master as any).nilai_kontrak || (master as any).budget || 0;
            }
        });

        // Paid & Submitted 
        filterTerms.forEach(t => { 
            if (t.status === 'paid' || t.status === 'dibayarkan') terminTerbayar += (t.amountPaid || t.amountRequest || 0);
            if (['pengajuan', 'submitted', 'pending_review', 'pending'].includes(t.status)) menungguApprovalCount++;
        });
        combatTerms.forEach(t => {
            t.subSteps.forEach(s => { 
                if (s.status === 'paid' || s.status === 'dibayarkan') terminTerbayar += (s.amountPaid || s.amountRequest || 0); 
                if (['pengajuan', 'submitted', 'pending_review', 'pending'].includes(s.status)) menungguApprovalCount++;
            });
        });

        const sisaTagih = totalHarga > 0 ? totalHarga - terminTerbayar : 0;
        const pctTerbayar = totalHarga > 0 ? ((terminTerbayar / totalHarga) * 100).toFixed(1) : '0.0';

        return { totalHarga, terminTerbayar, menungguApprovalCount, sisaTagih, pctTerbayar };
    });

    // ----------------------------------------------------------------------
    // 4. PROJECT TYPE SUMMARY
    // ----------------------------------------------------------------------
    const projectTypes: { id: ProjectType; label: string; color: string; bg: string }[] = [
        { id: 'BLACKSITE', label: 'Blacksite', color: 'text-[#DC2626]', bg: 'bg-red-50' },
        { id: 'COMBAT', label: 'Combat', color: 'text-[#EA580C]', bg: 'bg-orange-50' },
        { id: 'FILTER', label: 'Filter', color: 'text-[#16A34A]', bg: 'bg-green-50' },
        { id: 'L2H', label: 'L2H', color: 'text-[#2563EB]', bg: 'bg-blue-50' },
        { id: 'REFINEN', label: 'Refinen', color: 'text-[#7C3AED]', bg: 'bg-purple-50' }
    ];

    const getTypeSummary = (type: ProjectType) => {
        const typeMasterSites = siteMasterRecords.filter(sm => sm.project_type === type);
        const importedCount = typeMasterSites.length;

        let awal = 0;
        let permit = 0;
        let akses = 0;
        let impl = 0;
        let selesai = 0;
        typeMasterSites.forEach(s => {
           const st = s.stage as string;
           if (['imported', 'assigned'].includes(st)) awal++;
           else if (['permit_process', 'permit_ready'].includes(st)) permit++;
           else if (['akses_process', 'akses_ready'].includes(st)) akses++;
           else if (['implementasi', 'rfi_done', 'rfs_done', 'dokumen_done', 'bast', 'invoice'].includes(st)) impl++;
           else if (st === 'completed') selesai++;
        });

        return { importedCount, awal, permit, akses, impl, selesai };
    };

    // ----------------------------------------------------------------------
    // 5. LEFT COLUMN: BUTUH TINDAKAN SEGERA
    // ----------------------------------------------------------------------
    const actionNeededList = createMemo(() => {
        let items: any[] = [];
        siteMasterRecords.forEach(s => {
            const daysDiff = s.stage_updated_at ? Math.floor((Date.now() - new Date(s.stage_updated_at).getTime()) / 86400000) : 0;
            if (daysDiff > 14 || (s.stage as string) === 'issue_hold' || s.stage_notes?.toLowerCase().includes('issue')) {
                items.push({
                    id: s.site_id,
                    siteName: s.site_name,
                    type: s.project_type,
                    title: s.stage_notes || `${s.stage?.replace('_', ' ')} > 14 hari`,
                    link: `/all-sites` // Handled by onTabChange in Solid
                });
            }
        });
        return items.slice(0, 5);
    });

    // ----------------------------------------------------------------------
    // 6. RIGHT COLUMN: PENGAJUAN MENUNGGU APPROVAL
    // ----------------------------------------------------------------------
    const pendingPengajuanList = createMemo(() => {
        let list: any[] = [];
        filterTerms.forEach(t => {
            if (['pengajuan', 'submitted', 'pending_review', 'pending'].includes(t.status)) {
                 const site = sites.find(s => s.id === t.siteId);
                 list.push({
                     id: t.id,
                     siteId: t.siteId,
                     siteName: site?.name || siteMasterRecords.find(sm => sm.site_id === t.siteId)?.site_name || t.siteId,
                     title: t.name,
                     amount: t.amountRequest || 0,
                     date: (t as any).submittedAt || new Date().toISOString(),
                 });
            }
        });
        combatTerms.forEach(t => {
            t.subSteps.forEach(s => {
                if (['pengajuan', 'submitted', 'pending_review', 'pending'].includes(s.status)) {
                    const site = sites.find(st => st.id === t.siteId);
                    list.push({
                        id: s.id,
                        siteId: t.siteId,
                        siteName: site?.name || siteMasterRecords.find(sm => sm.site_id === t.siteId)?.site_name || t.siteId,
                        title: `${(s as any).stepName} (${(s as any).percentage}%)`,
                        status: 'pending_review',
                        date: (s as any).submittedAt || new Date().toISOString(),
                    });
                }
            });
        });
        list.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return list;
    });

    return (
        <div class="space-y-6 pb-16 animate-in fade-in duration-300">
            {/* ROW 1: HEADER (compact, no greeting) */}
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <h1 class="text-[32px] font-bold text-[#111827] tracking-tight">Dashboard</h1>
                
                <div class="flex items-center gap-3">
                    <div class="text-right">
                        <p class="text-[13px] text-[#6B7280]">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div class="px-3 py-1 bg-[#EFF6FF] text-[#1D4ED8] text-[11px] rounded-full uppercase font-semibold tracking-wider">
                        {user().role.replace(/_/g, ' ')}
                    </div>
                </div>
            </div>

            {/* TABS (Directly under header) */}
            <div class="flex border-b border-slate-200 mt-2">
                <button
                    onClick={() => { setActiveTab('overview'); setMapStageFilter(undefined); }}
                    class={clsx(
                        "px-6 py-3 font-semibold text-sm transition-all flex items-center gap-2",
                        activeTab() === 'overview'
                        ? 'bg-white shadow-sm text-[#1D4ED8] border-b-2 border-[#2563EB]'
                        : 'text-[#6B7280] hover:text-gray-900 border-b-2 border-transparent'
                    )}
                >
                    <Activity class="w-4 h-4" />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('map')}
                    class={clsx(
                        "px-6 py-3 font-semibold text-sm transition-all flex items-center gap-2",
                        activeTab() === 'map'
                        ? 'bg-white shadow-sm text-[#1D4ED8] border-b-2 border-[#2563EB]'
                        : 'text-[#6B7280] hover:text-gray-900 border-b-2 border-transparent'
                    )}
                >
                    <MapPin class="w-4 h-4" />
                    Peta Sites
                </button>
            </div>

            {/* TAB CONTENT: PETA SITES */}
            <Show when={activeTab() === 'map'}>
                <div class="h-[calc(100vh-200px)] w-full relative -mx-0 rounded-lg overflow-hidden border border-slate-200 mt-6">
                    <MapWidget 
                        height="100%" 
                        presetStage={mapStageFilter()} 
                    />
                </div>
            </Show>

            {/* TAB CONTENT: OVERVIEW */}
            <Show when={activeTab() === 'overview'}>
                <div class="space-y-8 animate-in fade-in duration-300 mt-6">
                    
                    {/* ROW 1: STATUS LAPANGAN */}
                    <div>
                        <h3 class="text-[11px] font-semibold text-[#9CA3AF] tracking-[0.08em] uppercase mb-4">
                            Status Lapangan
                        </h3>
                        <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {/* Menunggu Permit — slate/gray gradient */}
                            <div onClick={() => { setActiveTab('map'); setMapStageFilter('permit_process'); }}
                                class="relative rounded-xl p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #64748B 0%, #475569 100%)', 'box-shadow': '0 4px 14px rgba(71,85,105,0.35)' }}>
                                <div class="absolute -right-2 -bottom-2 text-white/10 text-[64px] font-black leading-none select-none pointer-events-none">{stageSummary().menungguPermit}</div>
                                <p class="text-white/70 text-[10px] font-semibold uppercase tracking-[0.07em] mb-2 leading-tight">Menunggu<br/>Permit</p>
                                <p class="text-white text-[32px] font-black leading-none">{stageSummary().menungguPermit}</p>
                            </div>
                            {/* Permit Ready — amber/orange gradient */}
                            <div onClick={() => { setActiveTab('map'); setMapStageFilter('permit_ready'); }}
                                class="relative rounded-xl p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', 'box-shadow': '0 4px 14px rgba(245,158,11,0.4)' }}>
                                <div class="absolute -right-2 -bottom-2 text-white/10 text-[64px] font-black leading-none select-none pointer-events-none">{stageSummary().permitReady}</div>
                                <p class="text-white/80 text-[10px] font-semibold uppercase tracking-[0.07em] mb-2 leading-tight">Permit<br/>Ready</p>
                                <p class="text-white text-[32px] font-black leading-none">{stageSummary().permitReady}</p>
                            </div>
                            {/* Akses Ready — blue gradient */}
                            <div onClick={() => { setActiveTab('map'); setMapStageFilter('akses_ready'); }}
                                class="relative rounded-xl p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', 'box-shadow': '0 4px 14px rgba(59,130,246,0.4)' }}>
                                <div class="absolute -right-2 -bottom-2 text-white/10 text-[64px] font-black leading-none select-none pointer-events-none">{stageSummary().aksesReady}</div>
                                <p class="text-white/80 text-[10px] font-semibold uppercase tracking-[0.07em] mb-2 leading-tight">Akses<br/>Ready</p>
                                <p class="text-white text-[32px] font-black leading-none">{stageSummary().aksesReady}</p>
                            </div>
                            {/* Implementasi — violet/purple gradient */}
                            <div onClick={() => { setActiveTab('map'); setMapStageFilter('implementasi'); }}
                                class="relative rounded-xl p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', 'box-shadow': '0 4px 14px rgba(139,92,246,0.4)' }}>
                                <div class="absolute -right-2 -bottom-2 text-white/10 text-[64px] font-black leading-none select-none pointer-events-none">{stageSummary().implementasi}</div>
                                <p class="text-white/80 text-[10px] font-semibold uppercase tracking-[0.07em] mb-2 leading-tight">Imple-<br/>mentasi</p>
                                <p class="text-white text-[32px] font-black leading-none">{stageSummary().implementasi}</p>
                            </div>
                            {/* Issue — red/rose gradient */}
                            <div onClick={() => { setActiveTab('map'); setMapStageFilter('issue_hold'); }}
                                class="relative rounded-xl p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #F87171 0%, #DC2626 100%)', 'box-shadow': '0 4px 14px rgba(239,68,68,0.4)' }}>
                                <div class="absolute -right-2 -bottom-2 text-white/10 text-[64px] font-black leading-none select-none pointer-events-none">{stageSummary().issues}</div>
                                <p class="text-white/80 text-[10px] font-semibold uppercase tracking-[0.07em] mb-2 leading-tight">Issue<br/>⚡ Hold</p>
                                <p class="text-white text-[32px] font-black leading-none">{stageSummary().issues}</p>
                            </div>
                            {/* Selesai — emerald green gradient */}
                            <div onClick={() => { setActiveTab('map'); setMapStageFilter('completed'); }}
                                class="relative rounded-xl p-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #34D399 0%, #059669 100%)', 'box-shadow': '0 4px 14px rgba(16,185,129,0.4)' }}>
                                <div class="absolute -right-2 -bottom-2 text-white/10 text-[64px] font-black leading-none select-none pointer-events-none">{stageSummary().selesai}</div>
                                <p class="text-white/80 text-[10px] font-semibold uppercase tracking-[0.07em] mb-2 leading-tight">Selesai<br/>✓ Done</p>
                                <p class="text-white text-[32px] font-black leading-none">{stageSummary().selesai}</p>
                            </div>
                        </div>
                    </div>

                    {/* ROW 2: FINANCIAL SUMMARY */}
                    <div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <ModernKPICard
                                title="Total Nilai Kontrak"
                                value={financials().totalHarga > 0 ? formatRupiah(financials().totalHarga) : '—'}
                                icon={Wallet}
                                iconClass="bg-blue-50 text-blue-600"
                                subtitle={financials().totalHarga > 0 ? 'Seluruh tipe pekerjaan' : 'Data harga belum diset'}
                            />

                            <ModernKPICard
                                title="Termin Terbayar"
                                value={financials().terminTerbayar > 0 ? formatRupiah(financials().terminTerbayar) : '—'}
                                icon={CheckCircle2}
                                iconClass="bg-emerald-50 text-emerald-600"
                                subtitle={financials().totalHarga > 0 ? `${financials().pctTerbayar}% dari total kontrak` : 'Data harga belum diset'}
                            />

                            <ModernKPICard
                                title="Menunggu Approval"
                                value={
                                    <div class="flex items-center gap-2">
                                        {financials().menungguApprovalCount}
                                        <Show when={financials().menungguApprovalCount > 0}>
                                            <span class="relative flex h-2.5 w-2.5 mx-1">
                                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                                            </span>
                                        </Show>
                                    </div>
                                }
                                icon={Clock}
                                iconClass={financials().menungguApprovalCount > 0 ? "bg-amber-500 text-white" : "bg-slate-50 text-slate-400"}
                                subtitle={financials().totalHarga > 0 ? 'Pengajuan termin menunggu review' : 'Data harga belum diset'}
                                trend={financials().menungguApprovalCount > 0 ? { direction: 'down', label: 'Action Needed', colorClass: 'bg-amber-100 text-amber-700' } : undefined}
                                onClick={() => props.onTabChange?.('TERMIN')}
                                isActive={false}
                            />

                            <ModernKPICard
                                title="Sisa Tagih"
                                value={
                                    <span class="text-blue-600">
                                        {financials().totalHarga > 0 ? formatRupiah(financials().sisaTagih) : '—'}
                                    </span>
                                }
                                icon={CreditCard}
                                iconClass="bg-indigo-50 text-indigo-600"
                                subtitle={financials().totalHarga > 0 ? 'Belum ditagihkan' : 'Data harga belum diset'}
                            />
                        </div>
                    </div>

                    {/* ROW 3: OVERVIEW PER TIPE */}
                    <div>
                        <h3 class="text-[11px] font-semibold text-[#9CA3AF] tracking-[0.08em] uppercase mb-4 mt-8">
                            Tipe Pekerjaan
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <For each={projectTypes}>
                                {(t) => {
                                    const summary = getTypeSummary(t.id);
                                    return (
                                        <div onClick={() => props.onTabChange?.(t.id)} class={clsx(
                                            "rounded-[12px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between h-[130px] cursor-pointer text-left",
                                            summary.importedCount === 0 ? "bg-[#FAFAFA]" : "bg-white"
                                        )}>
                                            <div class="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 class="text-[16px] font-bold text-[#111827]">{t.label}</h4>
                                                    <span class="text-[13px] text-[#6B7280]">{summary.importedCount} Sites</span>
                                                </div>
                                                <span class={clsx("w-9 h-9 rounded-full flex items-center justify-center shadow-sm", t.bg, t.color)}>
                                                    <Building2 class="w-[18px] h-[18px]" strokeWidth="2.5" />
                                                </span>
                                            </div>
                                            
                                            <div class="mt-auto">
                                                <Show when={summary.importedCount > 0} fallback={<div class="text-[11px] text-[#9CA3AF]">Belum ada site</div>}>
                                                    <div class="text-[11px] text-[#9CA3AF] mb-1.5 truncate">
                                                        {summary.permit} Permit • {summary.impl} Impl
                                                    </div>
                                                    <div class="h-1 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                                        <Show when={summary.awal > 0}><div style={{width: `${(summary.awal/summary.importedCount)*100}%`}} class="bg-[#94A3B8] h-full" /></Show>
                                                        <Show when={summary.permit > 0}><div style={{width: `${(summary.permit/summary.importedCount)*100}%`}} class="bg-[#F59E0B] h-full" /></Show>
                                                        <Show when={summary.akses > 0}><div style={{width: `${(summary.akses/summary.importedCount)*100}%`}} class="bg-[#3B82F6] h-full" /></Show>
                                                        <Show when={summary.impl > 0}><div style={{width: `${(summary.impl/summary.importedCount)*100}%`}} class="bg-[#8B5CF6] h-full" /></Show>
                                                        <Show when={summary.selesai > 0}><div style={{width: `${(summary.selesai/summary.importedCount)*100}%`}} class="bg-[#10B981] h-full" /></Show>
                                                    </div>
                                                </Show>
                                            </div>
                                        </div>
                                    );
                                }}
                            </For>
                        </div>
                    </div>

                    {/* ROW 4: TWO-COLUMN LAYOUT */}
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* LEFT COLUMN (60%): Butuh Tindakan & Aktivitas */}
                        <div class="lg:col-span-7 space-y-6">
                            
                            {/* Butuh Tindakan Segera */}
                            <div class="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                                <div class="px-5 py-4 flex items-center justify-between">
                                    <h3 class="font-bold text-[14px] text-[#111827] flex items-center gap-2">
                                        <div class="w-2 h-2 rounded-full bg-[#EF4444] animate-ping opacity-75 shrink-0" />
                                        Butuh Tindakan Segera
                                    </h3>
                                    <Show when={actionNeededList().length > 0}>
                                        <span class="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[11px] font-bold">
                                            {actionNeededList().length} items
                                        </span>
                                    </Show>
                                </div>
                                <div class="flex flex-col">
                                    <Show when={actionNeededList().length > 0} fallback={
                                        <div class="p-8 text-center flex flex-col items-center justify-center">
                                            <CheckCircle2 class="w-8 h-8 text-[#10B981] mb-2" />
                                            <span class="text-[14px] font-medium text-[#111827]">Semua site dalam kondisi normal</span>
                                            <span class="text-[13px] text-[#6B7280]">Tidak ada tindakan mendesak saat ini</span>
                                        </div>
                                    }>
                                        <For each={actionNeededList()}>
                                            {(item) => {
                                                const isCritical = item.title.includes('> 21 hari') || item.title.includes('issue_hold') || item.title.toLowerCase().includes('issue');
                                                const borderColor = isCritical ? 'border-l-[#EF4444]' : 'border-l-[#F59E0B]';
                                                return (
                                                    <div onClick={() => props.onTabChange?.('ALL_SITES')} class={clsx("p-4 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors border-l-[3px] border-b border-b-slate-50 cursor-pointer group", borderColor)}>
                                                        <div class="text-left">
                                                            <div class="font-semibold text-[#111827] text-[14px] mb-0.5">{item.siteName}</div>
                                                            <div class="text-[12px] text-[#6B7280]">
                                                                {item.title} · {item.type}
                                                            </div>
                                                        </div>
                                                        <div class="text-[13px] font-medium text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                            Lihat <span class="text-[16px] leading-none mb-0.5">→</span>
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        </For>
                                    </Show>
                                </div>
                            </div>

                            {/* Aktivitas Terbaru */}
                            <div class="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                                <div class="px-5 py-4 text-left">
                                    <h3 class="font-bold text-[14px] text-[#111827]">Aktivitas Terbaru</h3>
                                </div>
                                <div class="px-5 pb-5">
                                    <ul class="flex flex-col text-left">
                                        <For each={activityFeed.slice(0, 5)}>
                                            {(log, idx) => {
                                                const userMatch = people.find(p => p.id === log.userId);
                                                const userName = userMatch ? userMatch.name : 'Sistem';
                                                const initial = userName.charAt(0);
                                                return (
                                                    <li class="flex gap-3 py-3 relative">
                                                        <div class="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0 z-10">
                                                            {initial}
                                                        </div>
                                                        <div class={clsx("flex-1 pb-3", idx() < 4 ? "border-b border-slate-100 w-[80%]" : "")}>
                                                            <div class="text-[13px] leading-snug">
                                                                <span class="font-semibold text-[#111827]">{userName}</span>{' '}
                                                                <span class="text-[#374151]">{log.action}</span>{' '}
                                                                <span class="font-medium text-[#374151]">{log.target}</span>
                                                            </div>
                                                            <div class="text-[11px] text-[#6B7280] mt-1">{log.timestamp}</div>
                                                        </div>
                                                    </li>
                                                );
                                            }}
                                        </For>
                                    </ul>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN (40%): Pengajuan Menunggu */}
                        <div class="lg:col-span-5 space-y-6">
                            <div class="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                                <div class="px-5 py-4 flex justify-between items-center">
                                    <h3 class="font-bold text-[14px] text-[#111827] flex items-center gap-2">
                                        Pengajuan Termin
                                        <Show when={pendingPengajuanList().length > 0}>
                                            <div class="w-2 h-2 rounded-full bg-[#F59E0B]" />
                                        </Show>
                                    </h3>
                                </div>
                                <div class="flex flex-col text-left">
                                    <Show when={pendingPengajuanList().length > 0} fallback={
                                        <div class="p-8 text-center text-[13px] text-[#6B7280] bg-[#FAFAFA]">
                                            Tidak ada pengajuan yg menunggu review.
                                        </div>
                                    }>
                                        <For each={pendingPengajuanList().slice(0, 6)}>
                                            {(item, idx) => {
                                                const isTermin = item.title.toLowerCase().includes('termin');
                                                const badgeText = isTermin ? `T${item.title.match(/\d+/)?.[0] || '?'}` : 'REQ';

                                                return (
                                                    <div class="p-4 hover:bg-[#F9FAFB] transition-colors border-t border-slate-50 group flex items-start justify-between gap-3">
                                                        <div class="flex items-start gap-3 overflow-hidden">
                                                            <div class="shrink-0 mt-0.5 bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                                {badgeText}
                                                            </div>
                                                            <div class="overflow-hidden cursor-default text-left">
                                                                <div class="font-semibold text-[#111827] text-[13px] truncate">
                                                                    {item.siteId} · {item.siteName}
                                                                </div>
                                                                <div class="flex items-center gap-1.5 mt-1 text-[12px] text-[#6B7280] whitespace-nowrap">
                                                                    <span class="font-medium text-[#374151]">{formatRupiah(item.amount)}</span>
                                                                    <span>·</span>
                                                                    <span>Diajukan {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => props.onTabChange?.('TERMIN')}
                                                            class="shrink-0 text-[13px] font-medium text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                                                        >
                                                            Review <span class="text-[14px] leading-none">→</span>
                                                        </button>
                                                    </div>
                                                );
                                            }}
                                        </For>
                                    </Show>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Show>
        </div>
    );
};

export default HomePage;
