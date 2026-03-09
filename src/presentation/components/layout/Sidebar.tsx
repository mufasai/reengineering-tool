import { For, Show, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { authStore } from '../../store/auth.store';
import { projectStore } from '../../store/project.store';
import type { Project } from '../../../domain/entities/project.entity';

// Icons as inline SVGs to match lucide-react and design exactly
const DashboardIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
);

const WorkOrderIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
);

const FolderIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
);

const UsersIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

const SettingsIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);

const MenuIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);

const FileTextIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
);

const ReceiptIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17V7" /></svg>
);

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: any) => void;
}

const Sidebar: Component<SidebarProps> = (props) => {
    const user = () => authStore.user();

    // Use shared project store for reactive updates
    const projects = () => projectStore.projects();

    // Calculate project counts by type
    const getProjectCountByType = (type: string) => {
        return projects().filter((p: Project) => {
            const projectType = p.tipe?.toUpperCase().replace(/\s+/g, '');
            const filterType = type.toUpperCase().replace(/\s+/g, '');

            if (filterType === 'BLACKSITE') {
                return projectType === 'BLACKSITE' || projectType === 'BLACK_SITE' || p.tipe?.toLowerCase().includes('black');
            }

            if (filterType === 'BEBAN_OPERASIONAL') {
                return projectType === 'BEBANOPERASIONAL' ||
                    projectType === 'BEBAN_OPERASIONAL' ||
                    p.tipe?.toLowerCase().includes('beban') ||
                    p.tipe?.toLowerCase().includes('operasional');
            }

            return projectType === filterType || p.tipe?.toUpperCase().includes(filterType);
        }).length;
    };

    // 1. PROJECT MANAGEMENT ITEMS
    const projectManagementItems = () => {
        const items = [{ icon: DashboardIcon, label: 'Dashboard', id: 'DASHBOARD' }];
        const role = user()?.role || '';

        // Backend sends roles in lowercase with spaces: "backoffice admin", "team leader", "head office"
        console.log('Current user role:', role);

        if (['backoffice admin', 'management', 'team leader', 'admin'].includes(role)) {
            items.push({ icon: WorkOrderIcon, label: 'Work Orders', id: 'WO' });
        }

        items.push({ icon: FileTextIcon, label: 'SPK', id: 'SPK' });

        // All Projects menu - includes team leader, head office, direktur, finance
        const projectAllowedRoles = ['backoffice admin', 'finance', 'management', 'admin', 'team leader', 'head office', 'direktur'];

        if (projectAllowedRoles.includes(role)) {
            items.push({ icon: FolderIcon, label: 'All Projects', id: 'PROJECTS' });
        }

        // Add Termin menu for Finance, Head Office, Director, and Team Leader
        const terminAllowedRoles = ['finance', 'head office', 'backoffice admin', 'management', 'direktur', 'team leader'];

        if (terminAllowedRoles.includes(role)) {
            items.push({ icon: ReceiptIcon, label: 'Termin', id: 'TERMIN' });
        }

        return items;
    };

    // 2. DATA MASTER ITEMS
    const dataMasterItems = [
        { icon: UsersIcon, label: 'People', id: 'PEOPLE' },
    ];

    const teamsItem = { icon: UsersIcon, label: 'Teams', id: 'TEAMS' };

    const canManageData = () => {
        const role = user()?.role || '';
        // Backend sends: "backoffice admin", "management", "admin" (lowercase with spaces)
        return ['backoffice admin', 'management', 'admin'].includes(role);
    };

    const canAccessTeams = () => {
        const role = user()?.role || '';
        // Backend sends: "team leader", "admin" (lowercase with spaces)
        return ['team leader', 'admin'].includes(role);
    };

    // 3. PROJECT TYPES - Dynamic counts
    const projectTypes = createMemo(() => [
        { id: 'BLACKSITE', label: 'Blacksite', colorClass: 'bg-red-500', count: getProjectCountByType('BLACKSITE') },
        { id: 'COMBAT', label: 'Combat', colorClass: 'bg-amber-500', count: getProjectCountByType('COMBAT') },
        { id: 'FILTER', label: 'Filter', colorClass: 'bg-emerald-500', count: getProjectCountByType('FILTER') },
        { id: 'L2H', label: 'L2H', colorClass: 'bg-blue-600', count: getProjectCountByType('L2H') },
        { id: 'REFINEN', label: 'Refinen', colorClass: 'bg-purple-600', count: getProjectCountByType('REFINEN') },
        { id: 'BEBAN_OPERASIONAL', label: 'Beban Operasional', colorClass: 'bg-cyan-500', count: getProjectCountByType('BEBAN_OPERASIONAL') }
    ]);

    return (
        <aside class="h-screen w-64 bg-navy-900 text-white flex flex-col z-50 transition-all duration-300 border-r border-navy-800 flex-shrink-0 sticky top-0">
            {/* Brand */}
            <div class="h-[60px] flex items-center px-6 border-b border-navy-800 bg-navy-900 shrink-0">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-glow">
                        <span class="font-bold text-lg text-white">R</span>
                    </div>
                    <span class="font-bold text-sm tracking-tight text-white uppercase italic">RE-ENGINEERING</span>
                </div>
                <button class="ml-auto text-slate-400 hover:text-white transition-colors">
                    <MenuIcon class="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav class="flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar">

                {/* User Profile Summary */}
                <div class="px-6 mb-6">
                    <div class="flex items-center gap-3 p-3 rounded-lg bg-navy-800 border border-navy-700">
                        <div class="w-10 h-10 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs font-bold ring-2 ring-navy-700">
                            {user()?.name?.charAt(0) || 'U'}
                        </div>
                        <div class="overflow-hidden">
                            <p class="text-sm font-medium truncate text-white">{user()?.name || 'User'}</p>
                            <p class="text-[10px] text-slate-400 uppercase tracking-wide truncate">{user()?.role?.replace('_', ' ') || 'Role'}</p>
                        </div>
                    </div>
                    {/* Current Role Display */}
                    <div class="mt-4 pt-4 border-t border-navy-700">
                        <label class="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1 flex items-center gap-1">
                            <SettingsIcon class="w-3 h-3" /> Current Role
                        </label>
                        <div class="w-full bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-300 rounded px-3 py-2 capitalize">
                            {user()?.role?.replace(/_/g, ' ') || 'No Role'}
                        </div>
                    </div>
                </div>

                {/* 1. PROJECT MANAGEMENT */}
                <p class="text-slate-500 text-[10px] font-bold tracking-[0.1em] uppercase px-6 pt-4 pb-[6px]">Project Management</p>
                <div class="px-2 space-y-1">
                    <For each={projectManagementItems()}>
                        {(item) => (
                            <button
                                onClick={() => props.onTabChange(item.id)}
                                class={`w-full flex items-center gap-3 px-4 py-2 text-[13px] rounded-lg mx-1 transition-all duration-150 group text-left ${props.activeTab === item.id
                                    ? 'bg-navy-800 text-blue-400 font-semibold border-l-2 border-blue-500'
                                    : 'text-slate-400 hover:text-white hover:bg-navy-800 font-medium border-l-2 border-transparent'
                                    }`}
                            >
                                <item.icon class={`w-4 h-4 transition-colors ${props.activeTab === item.id ? "text-blue-400" : "text-slate-400 group-hover:text-white"}`} />
                                <span>{item.label}</span>
                            </button>
                        )}
                    </For>
                </div>

                {/* 2. PROJECT TYPES */}
                <p class="text-slate-500 text-[10px] font-bold tracking-[0.1em] uppercase px-6 pt-6 pb-[6px]">Project Types</p>
                <div class="px-2 space-y-1">
                    <For each={projectTypes()}>
                        {(type) => {
                            const role = user()?.role || '';
                            // Backend sends: "team leader" (lowercase with space)
                            const isRestricted = ['engineer', 'team leader'].includes(role);
                            if (isRestricted && type.count === 0) return null;

                            return (
                                <button
                                    onClick={() => props.onTabChange(type.id)}
                                    class={`w-full flex items-center justify-between px-4 py-2 text-[13px] rounded-lg mx-1 transition-all duration-150 group text-left ${props.activeTab === type.id
                                        ? 'bg-navy-800 text-white font-bold border-l-2 border-blue-600'
                                        : 'text-slate-400 hover:text-white hover:bg-navy-800 border-l-2 border-transparent font-medium'
                                        }`}
                                >
                                    <div class="flex items-center gap-3">
                                        <div class={`w-2 h-2 rounded-full ${type.colorClass} ${props.activeTab === type.id && "ring-2 ring-white/20 shadow-[0_0_8px_currentColor]"}`}></div>
                                        <span class="truncate">{type.label}</span>
                                    </div>
                                    <span class={`text-[10px] px-1.5 py-0.5 rounded border transition-all ${props.activeTab === type.id
                                        ? "bg-blue-600/20 text-blue-400 border-blue-500/30 font-bold"
                                        : type.count > 0
                                            ? "bg-navy-700 text-white border-navy-600"
                                            : "border-transparent text-slate-500"
                                        }`}>
                                        [{type.count}]
                                    </span>
                                </button>
                            );
                        }}
                    </For>
                </div>

                {/* 3. DATA MASTER */}
                <Show when={canManageData()}>
                    <p class="text-slate-500 text-[10px] font-bold tracking-[0.1em] uppercase px-6 pt-6 pb-[6px]">Data Master</p>
                    <div class="px-2 space-y-1">
                        <For each={dataMasterItems}>
                            {(item) => (
                                <button
                                    onClick={() => props.onTabChange(item.id)}
                                    class={`w-full flex items-center gap-3 px-4 py-2 text-[13px] rounded-lg mx-1 transition-all duration-150 group text-left ${props.activeTab === item.id
                                        ? 'bg-navy-800 text-blue-400 font-semibold border-l-2 border-blue-500'
                                        : 'text-slate-400 hover:text-white hover:bg-navy-800 font-medium border-l-2 border-transparent'
                                        }`}
                                >
                                    <item.icon class={`w-4 h-4 transition-colors ${props.activeTab === item.id ? "text-blue-400" : "text-slate-400 group-hover:text-white"}`} />
                                    <span>{item.label}</span>
                                </button>
                            )}
                        </For>
                    </div>
                </Show>

                {/* Teams - Separate section for Team Leader and Admin */}
                <Show when={canAccessTeams()}>
                    <Show when={!canManageData()}>
                        <p class="text-slate-500 text-[10px] font-bold tracking-[0.1em] uppercase px-6 pt-6 pb-[6px]">Data Master</p>
                    </Show>
                    <div class="px-2 space-y-1">
                        <button
                            onClick={() => props.onTabChange(teamsItem.id)}
                            class={`w-full flex items-center gap-3 px-4 py-2 text-[13px] rounded-lg mx-1 transition-all duration-150 group text-left ${props.activeTab === teamsItem.id
                                ? 'bg-navy-800 text-blue-400 font-semibold border-l-2 border-blue-500'
                                : 'text-slate-400 hover:text-white hover:bg-navy-800 font-medium border-l-2 border-transparent'
                                }`}
                        >
                            <teamsItem.icon class={`w-4 h-4 transition-colors ${props.activeTab === teamsItem.id ? "text-blue-400" : "text-slate-400 group-hover:text-white"}`} />
                            <span>{teamsItem.label}</span>
                        </button>
                    </div>
                </Show>

                {/* 4. SYSTEM */}
                <Show when={() => {
                    const role = user()?.role || '';
                    // Backend sends: "management", "admin" (lowercase)
                    return role === 'management' || role === 'admin';
                }}>
                    <p class="text-slate-500 text-[10px] font-bold tracking-[0.1em] uppercase px-6 pt-6 pb-[6px]">System</p>
                    <div class="px-2 space-y-1 pb-10">
                        <button
                            onClick={() => props.onTabChange('SYSTEM')}
                            class={`w-full flex items-center gap-3 px-4 py-2 text-[13px] rounded-lg mx-1 transition-all duration-150 group text-left ${props.activeTab === 'SYSTEM'
                                ? 'bg-navy-800 text-blue-400 font-semibold border-l-2 border-blue-500'
                                : 'text-slate-400 hover:text-white hover:bg-navy-800 font-medium border-l-2 border-transparent'
                                }`}
                        >
                            <SettingsIcon class={`w-4 h-4 transition-colors ${props.activeTab === 'SYSTEM' ? "text-blue-400" : "text-slate-400 group-hover:text-white"}`} />
                            <span>User Management</span>
                        </button>
                    </div>
                </Show>
            </nav>

            {/* Logout at bottom */}
            <div class="p-4 border-t border-navy-800">
                <button
                    onClick={() => authStore.logout()}
                    class="w-full text-left px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all font-medium text-xs flex items-center gap-3 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
