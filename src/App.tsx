import { createSignal, Show, Switch, Match, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import HomePage from './presentation/pages/dashboard/home/HomePage';
import LoginPage from './presentation/pages/auth/login/LoginPage';
import WorkOrdersPage from './presentation/pages/dashboard/wo/WorkOrdersPage';
import ProjectListPage from './presentation/pages/dashboard/projects/ProjectListPage';
import PeoplePage from './presentation/pages/dashboard/people/PeoplePage';
import Sidebar from './presentation/components/layout/Sidebar';
import Header from './presentation/components/layout/Header';
import { authStore } from './presentation/store/auth.store';
import './index.css';

const App: Component = () => {
  const [activeTab, setActiveTab] = createSignal<'DASHBOARD' | 'WO' | 'SPK' | 'PROJECTS' | 'PEOPLE' | 'TEAMS' | 'SYSTEM' | 'BLACKSITE' | 'COMBAT' | 'FILTER' | 'L2H' | 'REFINEN'>('DASHBOARD');

  onMount(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        authStore.setAuth(user, true);
      } catch (e) {
        authStore.logout();
      }
    } else {
      authStore.setAuth(null, false);
    }
  });

  return (
    <Show
      when={!authStore.loading()}
      fallback={
        <div class="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
          <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      }
    >
      <Show
        when={authStore.isAuthenticated()}
        fallback={<LoginPage onLogin={() => { }} />}
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
                <Match when={activeTab() === 'PEOPLE'}>
                  <PeoplePage />
                </Match>
                {/* Fallback for other tabs not yet implemented as full pages */}
                <Match when={true}>
                  <div class="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-white/50">
                    <div class="w-16 h-16 mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                    </div>
                    <h2 class="text-xl font-bold text-white mb-2">{activeTab()} Page</h2>
                    <p class="text-sm">This page is currently under implementation.</p>
                  </div>
                </Match>
              </Switch>
            </div>
          </main>
        </div>
      </Show>
    </Show>
  );
};


export default App;

