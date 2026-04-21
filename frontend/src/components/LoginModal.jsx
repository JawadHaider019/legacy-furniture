import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import toast from 'react-hot-toast';

export default function LoginModal({ isOpen, onClose }) {
    const [currentState, setCurrentState] = useState('Login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { login, register } = useContext(ShopContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        let result;
        if (currentState === 'Login') {
            result = await login(formData.email, formData.password);
        } else {
            result = await register(formData.name, formData.email, formData.password);
        }

        setIsSubmitting(false);

        if (result.success) {
            toast.success(currentState === 'Login' ? 'Welcome back to the archive.' : 'Your journey has begun.');
            onClose();
        } else {
            toast.error(result.message || 'Transmission failed.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-brand-ink/40 backdrop-blur-md"
                >
                    <div
                        className="absolute inset-0"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-brand-cream shadow-2xl p-6 md:p-8 overflow-hidden"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-bronze/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-bronze/5 rounded-full -ml-16 -mb-16 blur-3xl" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-brand-ink/40 hover:text-brand-ink transition-colors"
                        >
                            <X size={24} strokeWidth={1} />
                        </button>

                        <div className="text-center mb-6">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-bronze mb-4 block italic">Welcome to Auden</span>
                            <h2 className="text-4xl font-serif uppercase tracking-tight text-brand-ink">
                                {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
                            </h2>
                        </div>

                        <form onSubmit={onSubmitHandler} className="space-y-4">
                            {currentState === 'Sign Up' && (
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest font-black text-brand-ink/40 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20" size={16} />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white border border-brand-ink/5 px-12 py-4 text-sm outline-none focus:border-brand-bronze transition-colors font-light"
                                            placeholder="Enter your name"
                                            required={currentState === 'Sign Up'}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest font-black text-brand-ink/40 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20" size={16} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white border border-brand-ink/5 px-12 py-4 text-sm outline-none focus:border-brand-bronze transition-colors font-light"
                                        placeholder="name@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[9px] uppercase tracking-widest font-black text-brand-ink/40">Password</label>
                                    {currentState === 'Login' && (
                                        <button type="button" className="text-[9px] uppercase tracking-widest font-black text-brand-bronze/60 hover:text-brand-bronze underline">Forgot?</button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/20" size={16} />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white border border-brand-ink/5 px-12 py-4 text-sm outline-none focus:border-brand-bronze transition-colors font-light"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-brand-ink text-brand-cream py-5 uppercase text-[11px] tracking-[0.3em] font-black hover:bg-brand-ink/90 transition-all flex items-center justify-center gap-3 group mt-8 shadow-xl shadow-brand-ink/10 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : (currentState === 'Login' ? 'Enter Archive' : 'Begin Journey')}
                                {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-[10px] uppercase tracking-widest text-brand-muted font-bold">
                                {currentState === 'Login' ? "Don't have a registry?" : "Already part of the heritage?"}
                                <button
                                    onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
                                    className="ml-2 text-brand-bronze font-black underline"
                                >
                                    {currentState === 'Login' ? 'Create One' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
