import { createSignal, Show, Switch, Match, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import HomePage from './presentation/pages/dashboard/home/HomePage';
import LoginPage from './presentation/pages/auth/login/LoginPage';
import WorkOrdersPage from './presentation/pages/dashboard/wo/WorkOrdersPage';
import { authStore } from './presentation/store/auth.store';
import './index.css';

const App: Component = () => {
  const [activeTab, setActiveTab] = createSignal<'DASHBOARD' | 'WO'>('DASHBOARD');

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
        <div class="flex flex-col lg:flex-row min-h-screen bg-[#0a0f1d]">
          {/* Simple Sidebar for Demo */}
          <aside class="w-full lg:w-64 bg-black/20 border-b lg:border-b-0 lg:border-r border-white/5 p-6 space-y-8 flex flex-col">
            <div class="flex items-center gap-3 px-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
              <span class="font-bold text-lg tracking-tight text-white">SmartElco</span>
            </div>
            <nav class="space-y-2 flex-1">
              <button
                onClick={() => setActiveTab('DASHBOARD')}
                class={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab() === 'DASHBOARD' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('WO')}
                class={`w-full text-left px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${activeTab() === 'WO' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                Work Orders
              </button>
            </nav>

            <div class="pt-6 border-t border-white/5">
              <div class="flex items-center gap-3 px-2 mb-4">
                <div class="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold uppercase">
                  {authStore.user()?.name.charAt(0) || 'U'}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-white truncate">{authStore.user()?.name}</p>
                  <p class="text-[10px] text-gray-500 uppercase font-bold truncate">{authStore.user()?.role}</p>
                </div>
              </div>
              <button
                onClick={() => authStore.logout()}
                class="w-full text-left px-4 py-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all font-medium text-xs flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main class="flex-1 overflow-y-auto">
            <Switch>
              <Match when={activeTab() === 'DASHBOARD'}>
                <HomePage />
              </Match>
              <Match when={activeTab() === 'WO'}>
                <WorkOrdersPage />
              </Match>
            </Switch>
          </main>
        </div>
      </Show>
    </Show>
  );
};

export default App;

