import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import PeoplePage from '../people/PeoplePage';
import TeamsPage from '../teams/TeamsPage';
import { authStore } from '../../../store/auth.store';

// Icons as inline SVGs to match the existing pattern
const UserCircleIcon = (props: { class?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="10" r="3"/>
    <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
  </svg>
);

const UsersIcon = (props: { class?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// Helper function for class names
const clsx = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface WorkforcePageProps {
  isSubView?: boolean;
}

const WorkforcePage: Component<WorkforcePageProps> = (props) => {
  const [activeTab, setActiveTab] = createSignal<'people' | 'teams'>('people');
  
  const user = () => authStore.user();
  
  const hasPermission = (perm: string) => {
    const role = user()?.role?.toLowerCase().replace(/_/g, ' ') || '';
    const rolePermissions: Record<string, string[]> = {
      'engineer': [],
      'team leader': [],
      'backoffice admin': ['people', 'teams'],
      'finance': [],
      'management': ['people', 'teams'],
      'admin': ['people', 'teams'],
      'head office': [],
      'direktur': [],
    };
    const perms = rolePermissions[role] || [];
    return perms.includes(perm);
  };

  // Check permissions - redirect if no access
  if (!hasPermission('people') && !hasPermission('teams')) {
    return (
      <div class="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-slate-500">
        <div class="w-16 h-16 mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-slate-700 mb-2">Access Denied</h2>
        <p class="text-sm">You don't have permission to access workforce management.</p>
      </div>
    );
  }

  return (
    <div class="flex flex-col h-[calc(100vh-60px)] overflow-hidden bg-slate-50/50">
      <div class="bg-white border-b border-slate-200 px-8 pt-6 shadow-sm z-10 shrink-0 relative">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Workforce Management</h1>
          <p class="text-slate-500 text-sm mt-1">Manage personnel, field assignments, and dynamic teams.</p>
        </div>
        
        <div class="flex gap-8 -mb-px">
          <Show when={hasPermission('people')}>
            <button 
              onClick={() => setActiveTab('people')}
              class={clsx(
                "pb-3 px-1 font-medium text-sm transition-all border-b-2 flex items-center gap-2",
                activeTab() === 'people' 
                  ? "border-blue-600 text-blue-700" 
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              <UserCircleIcon class={clsx(
                "w-5 h-5", 
                activeTab() === 'people' ? "text-blue-600" : "text-slate-400"
              )} />
              Personnel Data
            </button>
          </Show>
          
          <Show when={hasPermission('teams')}>
            <button 
              onClick={() => setActiveTab('teams')}
              class={clsx(
                "pb-3 px-1 font-medium text-sm transition-all border-b-2 flex items-center gap-2",
                activeTab() === 'teams' 
                  ? "border-blue-600 text-blue-700" 
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              <UsersIcon class={clsx(
                "w-5 h-5", 
                activeTab() === 'teams' ? "text-blue-600" : "text-slate-400"
              )} />
              Field Teams
            </button>
          </Show>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-[1600px] mx-auto w-full p-6">
          <Show when={activeTab() === 'people' && hasPermission('people')}>
            <PeoplePage />
          </Show>
          <Show when={activeTab() === 'teams' && hasPermission('teams')}>
            <TeamsPage />
          </Show>
        </div>
      </div>
    </div>
  );
};

export default WorkforcePage;