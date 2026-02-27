import { createSignal, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { AuthRepositoryImpl } from '../../../../infrastructure/repositories/auth.repository.impl';
import { RegisterInteractor } from '../../../../application/use-cases/register.use-case';

interface RegisterPageProps {
    onRegister?: () => void;
    onBackToLogin?: () => void;
}

const RegisterPage: Component<RegisterPageProps> = (props) => {
    const [name, setName] = createSignal('');
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [confirmPassword, setConfirmPassword] = createSignal('');
    const [loading, setLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);
    const [success, setSuccess] = createSignal(false);

    const authRepository = new AuthRepositoryImpl();
    const registerUseCase = new RegisterInteractor(authRepository);

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (password() !== confirmPassword()) {
            setError('Password dan konfirmasi password tidak cocok');
            setLoading(false);
            return;
        }

        if (password().length < 6) {
            setError('Password minimal 6 karakter');
            setLoading(false);
            return;
        }

        try {
            const response = await registerUseCase.execute({
                name: name(),
                email: email(),
                password: password()
                // role not included - admin will set it later
            });

            if (response.success) {
                setSuccess(true);

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    if (props.onBackToLogin) {
                        props.onBackToLogin();
                    }
                }, 2000);
            } else {
                setError(response.message || 'Registrasi gagal');
            }
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat registrasi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div class="min-h-screen w-full flex items-center justify-center bg-[#0a0f1d] bg-[radial-gradient(circle_at_top_left,#1a2b4b,#0a0f1d)] p-4 font-sans text-white">
            <div class="w-full max-w-md lg:max-w-4xl grid lg:grid-cols-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">

                {/* Left Side: Branding (Visible on Desktop) */}
                <div class="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-emerald-600/20 to-transparent border-r border-white/5">
                    <div class="space-y-6">
                        <div class="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <line x1="19" y1="8" x2="19" y2="14" />
                                <line x1="22" y1="11" x2="16" y2="11" />
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-4xl font-bold tracking-tight">Join SmartElco</h1>
                            <p class="text-emerald-400 font-medium mt-1 uppercase tracking-widest text-xs">Create Your Account</p>
                        </div>
                        <p class="text-gray-400 leading-relaxed">
                            Get started with SmartElco Reengineering Tracking Tool. Manage your projects efficiently with our comprehensive platform.
                        </p>
                        <div class="pt-8 space-y-3 text-sm text-gray-500">
                            <div class="flex items-center gap-3">
                                <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-400">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span>Real-time project tracking</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-400">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span>Multi-stage payment management</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <div class="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-400">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <span>Comprehensive reporting</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div class="p-8 lg:p-12 flex flex-col justify-center">
                    <div class="lg:hidden text-center mb-8">
                        <h1 class="text-3xl font-bold">SmartElco</h1>
                        <p class="text-emerald-400 text-sm font-medium mt-1">Create Your Account</p>
                    </div>

                    <div class="mb-8">
                        <h2 class="text-2xl font-semibold">Create Account</h2>
                        <p class="text-gray-400 text-sm mt-1">Fill in your details to get started</p>
                    </div>

                    <Show when={error()}>
                        <div class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            {error()}
                        </div>
                    </Show>

                    <Show when={success()}>
                        <div class="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                            Registrasi berhasil! Mengarahkan ke halaman login...
                        </div>
                    </Show>

                    <form onSubmit={handleSubmit} class="space-y-4">
                        <div class="space-y-2">
                            <label for="name" class="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="John Doe"
                                value={name()}
                                onInput={(e) => setName(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                required
                                disabled={loading() || success()}
                            />
                        </div>

                        <div class="space-y-2">
                            <label for="email" class="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="name@smartelco.com"
                                value={email()}
                                onInput={(e) => setEmail(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                required
                                disabled={loading() || success()}
                            />
                        </div>

                        <div class="space-y-2">
                            <label for="password" class="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password()}
                                onInput={(e) => setPassword(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                required
                                disabled={loading() || success()}
                            />
                            <p class="text-xs text-gray-500 ml-1">Minimal 6 karakter</p>
                        </div>

                        <div class="space-y-2">
                            <label for="confirmPassword" class="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="••••••••"
                                value={confirmPassword()}
                                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                                required
                                disabled={loading() || success()}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading() || success()}
                            class="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all mt-4 flex items-center justify-center gap-2"
                        >
                            {loading() ? (
                                <>
                                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Creating account...</span>
                                </>
                            ) : success() ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    <span>Success!</span>
                                </>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div class="mt-8 text-center text-sm text-gray-500">
                        <p>Already have an account? <button onClick={() => props.onBackToLogin?.()} class="text-emerald-400 font-medium hover:underline">Sign In</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
