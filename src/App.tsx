import { createSignal, Show, Switch, Match, onMount, createEffect } from 'solid-js';
import type { Component } from 'solid-js';
import HomePage from './presentation/pages/dashboard/home/HomePage';
import LoginPage from './presentation/pages/auth/login/LoginPage';
import RegisterPage from './presentation/pages/auth/register/RegisterPage';
import WorkOrdersPage from './presentation/pages/dashboard/wo/WorkOrdersPage';
import ProjectListPage from './presentation/pages/dashboard/projects/ProjectListPage';
import AllSitesPage from './presentation/pages/dashboard/sites/AllSitesPage';
import FilterSitesPage from './presentation/pages/dashboard/sites/FilterSitesPage';
import PeoplePage from './presentation/pages/dashboard/people/PeoplePage';
import TeamsPage from './presentation/pages/dashboard/teams/TeamsPage';
import UserManagementPage from './presentation/pages/dashboard/system/UserManagementPage';
import TerminListPage from './presentation/pages/dashboard/termin/TerminListPage';
import SiteDetailPage from './presentation/pages/dashboard/sites/SiteDetailPage';
import Sidebar from './presentation/components/layout/Sidebar';
import Header from './presentation/components/layout/Header';
import { authStore } from './presentation/store/auth.store';
import { projectStore } from './presentation/store/project.store';
import './index.css';

const App: Component = () => {
  const [activeTab, setActiveTab] = createSignal<'DASHBOARD' | 'WO' | 'SPK' | 'PROJECTS' | 'ALL_SITES' | 'SITE_DETAIL' | 'PEOPLE' | 'TEAMS' | 'SYSTEM' | 'TERMIN' | 'BLACKSITE' | 'COMBAT' | 'FILTER' | 'L2H' | 'REFINEN' | 'BEBAN_OPERASIONAL'>('DASHBOARD');
  const [selectedSiteId, setSelectedSiteId] = createSignal<string | null>(null);
  const [authView, setAuthView] = createSignal<'login' | 'register'>('login');
  const isLoggedIn = () => authStore.isAuthenticated();

  onMount(() => {
    // Check if user was previously logged in
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        authStore.setAuth(user, true);
      } catch (e) {
        // Invalid data, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  });

  // Sync with authStore and reset tab when user changes
  createEffect(() => {
    const authenticated = authStore.isAuthenticated();
    const currentUser = authStore.user();
    console.log('Auth state changed:', authenticated, 'User:', currentUser?.email);

    // Reset to dashboard when user logs in or changes
    if (authenticated && currentUser) {
      console.log('Resetting to DASHBOARD for user:', currentUser.email);
      setActiveTab('DASHBOARD');
      projectStore.loadProjects(); // Trigger project load after auth
    }
  });

  return (
    <>
      <Show
        when={isLoggedIn()}
        fallback={
          <Show
            when={authView() === 'login'}
            fallback={
              <RegisterPage
                onBackToLogin={() => setAuthView('login')}
              />
            }
          >
            <LoginPage
              onRegister={() => setAuthView('register')}
            />
          </Show>
        }
      >
        <div class="flex min-h-screen bg-[#f8fafc]">
          <Sidebar activeTab={activeTab()} onTabChange={setActiveTab} />

          {/* Main Content Area */}
          <main class="flex-1 flex flex-col transition-all duration-300 relative min-w-0 h-screen overflow-hidden">
            <Header />
            <div class="p-8 overflow-y-auto flex-1 custom-scrollbar">
              <Switch>
                <Match when={activeTab() === 'DASHBOARD'}>
                  <HomePage />
                </Match>
                <Match when={activeTab() === 'WO'}>
                  <WorkOrdersPage />
                </Match>
                <Match when={activeTab() === 'PROJECTS'}>
                  <ProjectListPage />
                </Match>
                <Match when={activeTab() === 'ALL_SITES'}>
                  <AllSitesPage onViewDetail={(id: string) => {
                    setSelectedSiteId(id);
                    setActiveTab('SITE_DETAIL');
                  }} />
                </Match>
                <Match when={activeTab() === 'SITE_DETAIL'}>
                  <SiteDetailPage siteId={selectedSiteId() || ''} onBack={() => setActiveTab('ALL_SITES')} />
                </Match>
                <Match when={activeTab() === 'PEOPLE'}>
                  <PeoplePage />
                </Match>
                <Match when={activeTab() === 'TEAMS'}>
                  <TeamsPage />
                </Match>
                <Match when={activeTab() === 'SYSTEM'}>
                  <UserManagementPage />
                </Match>
                <Match when={activeTab() === 'TERMIN'}>
                  <TerminListPage />
                </Match>
                {/* Project Type Filters */}
                <Match when={activeTab() === 'BLACKSITE'}>
                  <ProjectListPage filterType="BLACKSITE" />
                </Match>
                <Match when={activeTab() === 'COMBAT'}>
                  <ProjectListPage filterType="COMBAT" />
                </Match>
                <Match when={activeTab() === 'FILTER'}>
                  <FilterSitesPage onViewDetail={(id: string) => {
                    setSelectedSiteId(id);
                    setActiveTab('SITE_DETAIL');
                  }} />
                </Match>
                <Match when={activeTab() === 'L2H'}>
                  <ProjectListPage filterType="L2H" />
                </Match>
                <Match when={activeTab() === 'REFINEN'}>
                  <ProjectListPage filterType="REFINEN" />
                </Match>
                <Match when={activeTab() === 'BEBAN_OPERASIONAL'}>
                  <ProjectListPage filterType="BEBAN_OPERASIONAL" />
                </Match>
                <Match when={activeTab() === 'SPK'}>
                  <div class="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-white/50">
                    <div class="w-16 h-16 mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                    </div>
                    <h2 class="text-xl font-bold text-white mb-2">SPK Page</h2>
                    <p class="text-sm">This page is currently under implementation.</p>
                  </div>
                </Match>
              </Switch>
            </div>
          </main>
        </div>
      </Show>
    </>
  );
};


export default App;

