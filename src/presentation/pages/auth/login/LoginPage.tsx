import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { AuthRepositoryImpl } from '../../../../infrastructure/repositories/auth.repository.impl';
import { LoginInteractor } from '../../../../application/use-cases/login.use-case';
import { authStore } from '../../../store/auth.store';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: Component<LoginPageProps> = (props) => {
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    const authRepository = new AuthRepositoryImpl();
    const loginUseCase = new LoginInteractor(authRepository);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await loginUseCase.execute({
                email: email(),
                password: password() as any, // Using the type defined in entity
            });

            if (response.success) {
                const user = {
                    id: response.user.email,
                    name: response.user.nama,
                    email: response.user.email,
                    role: response.user.role.toLowerCase() as any
                };

                // Securely store user info (optional, but avoids repeat calls)
                localStorage.setItem('auth_user', JSON.stringify(user));
                authStore.setAuth(user, true);
                props.onLogin();
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div class="min-h-screen w-full flex items-center justify-center bg-[#0a0f1d] bg-[radial-gradient(circle_at_top_left,#1a2b4b,#0a0f1d)] p-4 font-sans text-white">
            <div class="w-full max-w-md lg:max-w-4xl grid lg:grid-cols-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">

                {/* Left Side: Branding (Visible on Desktop) */}
                <div class="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600/20 to-transparent border-r border-white/5">
                    <div class="space-y-6">
                        <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20" /></svg>
                        </div>
                        <div>
                            <h1 class="text-4xl font-bold tracking-tight">SmartElco</h1>
                            <p class="text-blue-400 font-medium mt-1 uppercase tracking-widest text-xs">Reengineering Tracking Tool</p>
                        </div>
                        <p class="text-gray-400 leading-relaxed">
                            Efficiently track and manage your reengineering processes across all project types. Desktop-first management for scale.
                        </p>
                        <div class="pt-8 grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span>Real-time tracking</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span>Multi-stage payments</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div class="p-8 lg:p-12 flex flex-col justify-center">
                    <div class="lg:hidden text-center mb-8">
                        <h1 class="text-3xl font-bold">SmartElco</h1>
                        <p class="text-blue-400 text-sm font-medium mt-1">Reengineering Tracking Tool</p>
                    </div>

                    <div class="mb-8">
                        <h2 class="text-2xl font-semibold">Welcome back</h2>
                        <p class="text-gray-400 text-sm mt-1">Enter your credentials to access your dashboard</p>
                    </div>

                    <Show when={error()}>
                        <div class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            {error()}
                        </div>
                    </Show>

                    <form onSubmit={handleSubmit} class="space-y-5">
                        <div class="space-y-2">
                            <label for="email" class="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="name@smartelco.com"
                                value={email()}
                                onInput={(e) => setEmail(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div class="space-y-2">
                            <div class="flex justify-between items-center ml-1">
                                <label for="password" class="text-sm font-medium text-gray-300">Password</label>
                                <a href="#" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password()}
                                onInput={(e) => setPassword(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading()}
                            class="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-4 flex items-center justify-center gap-2"
                        >
                            {loading() ? (
                                <>
                                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Signing in...</span>
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div class="mt-8 text-center text-sm text-gray-500">
                        <p>Don't have an account? <a href="#" class="text-blue-400 font-medium hover:underline">Contact Administrator</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
