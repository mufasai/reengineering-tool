import { createSignal } from 'solid-js';
import type { Component } from 'solid-js';

const HomePage: Component = () => {
    const [count, setCount] = createSignal(0);

    return (
        <div class="min-h-screen bg-[#f8fafc] text-slate-800 font-sans p-6 lg:p-12">
            <div class="max-w-7xl mx-auto space-y-12">
                <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                    <div>
                        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 font-display">Dashboard</h1>
                        <p class="text-slate-500 mt-2 font-medium">Welcome to the Reengineering Tracking Tool.</p>
                    </div>
                </header>

                <main class="grid lg:grid-cols-3 gap-8">
                    <section class="lg:col-span-2 space-y-8">
                        <div class="grid sm:grid-cols-3 gap-6">
                            {[
                                { label: 'Total WO', value: '128', color: 'bg-blue-600' },
                                { label: 'Implementation', value: '45', color: 'bg-emerald-600' },
                                { label: 'Pending Payment', value: '12', color: 'bg-amber-600' },
                            ].map(stat => (
                                <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <p class="text-slate-500 text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
                                    <p class="text-3xl font-bold mt-2 text-slate-900">{stat.value}</p>
                                    <div class={`h-1 w-8 ${stat.color} mt-4 rounded-full`}></div>
                                </div>
                            ))}
                        </div>

                        <div class="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                            <h2 class="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                            <div class="space-y-6">
                                {[1, 2, 3].map(() => (
                                    <div class="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                                        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                        </div>
                                        <div>
                                            <p class="font-semibold text-slate-800">WO #2024-001 Updated</p>
                                            <p class="text-sm text-slate-500 mt-1">Status changed to Implementation (50%)</p>
                                            <p class="text-xs text-slate-400 mt-2 font-medium">2 hours ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <aside class="space-y-8">
                        <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] p-8 shadow-xl shadow-blue-500/20 relative overflow-hidden text-white">
                            <div class="relative z-10">
                                <h2 class="text-xl font-bold">Quick Export</h2>
                                <p class="text-blue-100 text-sm mt-2">Generate latest reports for all project types.</p>
                                <button class="mt-8 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm hover:translate-y-[-2px] active:translate-y-[0px] duration-200 transition-all w-full shadow-lg">
                                    Download CSV
                                </button>
                            </div>
                            <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        </div>

                        <div class="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                            <h2 class="text-xl font-bold text-slate-900 mb-6">System Health</h2>
                            <div class="flex items-center gap-4">
                                <button
                                    onClick={() => setCount(c => c + 1)}
                                    class="bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-semibold text-slate-600"
                                >
                                    Refresh Status: {count()}
                                </button>
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
