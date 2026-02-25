import type { Component } from 'solid-js';
import { authStore } from '../../store/auth.store';

// Icons as inline SVGs
const BellIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
);

const MailIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

const MenuIcon = (props: { class?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" class={props.class} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);

const Header: Component = () => {
    const user = () => authStore.user();

    return (
        <header class="h-16 bg-white border-b border-gray-100 sticky top-0 z-40 px-6 flex items-center justify-between shadow-sm">
            {/* Left: Hamburger (Mobile) */}
            <button class="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded transition-colors">
                <MenuIcon class="w-5 h-5" />
            </button>

            <div class="hidden lg:flex items-center gap-4 flex-1">
                {/* Breadcrumbs or Navigation context can go here */}
            </div>

            <div class="flex items-center gap-4">
                {/* Notifications & Messages */}
                <div class="flex items-center gap-1">
                    <button class="relative p-2 text-slate-400 hover:text-blue-600 transition-colors group">
                        <BellIcon class="w-5 h-5" />
                        <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                        {/* Tooltip hint or drop-down could be added here */}
                    </button>
                    <button class="relative p-2 text-slate-400 hover:text-blue-600 transition-colors group">
                        <MailIcon class="w-5 h-5" />
                        <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-coral-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                <div class="h-6 w-px bg-gray-100 mx-2"></div>

                {/* Profile Section */}
                <div class="flex items-center gap-3 cursor-pointer group">
                    <div class="text-right hidden md:block">
                        <p class="text-sm font-semibold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors lowercase first-letter:uppercase">
                            {user()?.name || 'Administrator'}
                        </p>
                        <p class="text-[11px] text-slate-500 tracking-tight font-medium">
                            {user()?.email || 'admin@appwork.com'}
                        </p>
                    </div>
                    <div class="w-9 h-9 bg-slate-100 rounded-full overflow-hidden border border-gray-100 relative transition-transform group-active:scale-95">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user()?.name || 'Admin'}&background=F1F5F9&color=64748B&bold=true&size=128`}
                            alt="Profile"
                            class="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
