import { createSignal, Show, Switch, Match } from 'solid-js';
import type { Component } from 'solid-js';
import HomePage from './presentation/pages/dashboard/home/HomePage';
import LoginPage from './presentation/pages/auth/login/LoginPage';
import WorkOrdersPage from './presentation/pages/dashboard/wo/WorkOrdersPage';
import './index.css';

const App: Component = () => {
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal<'DASHBOARD' | 'WO'>('DASHBOARD');

  return (
    <Show
      when={isLoggedIn()}
      fallback={<LoginPage onLogin={() => setIsLoggedIn(true)} />}
    >
      <div class="flex flex-col lg:flex-row min-h-screen bg-[#0a0f1d]">
        {/* Simple Sidebar for Demo */}
        <aside class="w-full lg:w-64 bg-black/20 border-b lg:border-b-0 lg:border-r border-white/5 p-6 space-y-8">
          <div class="flex items-center gap-3 px-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
            <span class="font-bold text-lg tracking-tight text-white">SmartElco</span>
          </div>
          <nav class="space-y-2">
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
  );
};

export default App;
