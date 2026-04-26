import { useState } from 'react'
import { backendUrl } from '../App'
import axios from 'axios'
import { useToast } from '../hooks/useToast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { login, token } = useAuth()
    const toast = useToast()

    // If already logged in, don't show login page
    // The App component will handle redirect automatically
    if (token) {
        return null;
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)

            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })

            if (response.data.success) {
                login(response.data.token, response.data.admin)
                toast.success('Login successful!')
                // No need to navigate - App will re-render and show the main app
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error(error.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-cream relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-bronze/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-brand-wood/5 rounded-full blur-3xl"></div>

            <div className="max-w-md w-full space-y-8 bg-white/40 backdrop-blur-xl p-10 rounded-sm border border-brand-bronze/10 shadow-2xl relative z-10">
                <div className="text-center">
                    <h1 className="text-4xl font-serif text-brand-ink mb-2">Legacy</h1>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-[1px] w-8 bg-brand-bronze/30"></div>
                        <p className="text-[11px] tracking-[0.4em] text-brand-bronze uppercase">Admin Portal</p>
                        <div className="h-[1px] w-8 bg-brand-bronze/30"></div>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={onSubmitHandler}>
                    <div className="space-y-5">
                        <div className="group">
                            <label htmlFor="email" className="block text-xs font-medium text-brand-muted uppercase tracking-wider mb-2 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-ink text-brand-muted/50">
                                    <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-3 bg-white/50 border border-brand-bronze/10 text-brand-ink placeholder-brand-muted/30 focus:outline-none focus:border-brand-bronze focus:bg-white transition-all duration-300 rounded-sm text-sm"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="group">
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <label htmlFor="password" className="block text-xs font-medium text-brand-muted uppercase tracking-wider">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-ink text-brand-muted/50">
                                    <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-12 pr-12 py-3 bg-white/50 border border-brand-bronze/10 text-brand-ink placeholder-brand-muted/30 focus:outline-none focus:border-brand-bronze focus:bg-white transition-all duration-300 rounded-sm text-sm"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        className="p-1 px-2 text-brand-muted hover:text-brand-ink focus:outline-none transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 bg-brand-ink text-brand-cream text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-brand-wood active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed rounded-sm"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-brand-cream" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Authenticating...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span>Access Portal</span>
                                    <FontAwesomeIcon icon={faSignInAlt} className="text-[11px] group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </button>
                    </div>
                </form>

                <div className="pt-8 text-center">
                    <p className="text-[11px] text-brand-muted/40 uppercase tracking-widest">&copy; 2026 Legacy Furniture Architecture</p>
                </div>
            </div>
        </div>
    )
}

export default Login
