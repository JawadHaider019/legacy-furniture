import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShieldMinus, Gift, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrderSuccessOverlay({ orderSuccess, setOrderSuccess }) {
    const navigate = useNavigate();

    return (
        <AnimatePresence>
            {orderSuccess && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-brand-ink flex items-center justify-center p-6 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-brand-cream max-w-xl w-full p-10 md:p-12 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 inset-x-0 h-1 bg-brand-bronze" />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.3 }}
                            className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
                        >
                            <CheckCircle2 size={40} />
                        </motion.div>

                        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-bronze mb-4 block">Order Successfully Placed</span>
                        <h2 className="text-2xl md:text-3xl font-serif text-brand-ink mb-6 uppercase leading-tight">Your order is <span className="italic">confirmed.</span></h2>
                        <p className="text-brand-muted font-light text-sm mb-10 max-w-md mx-auto leading-relaxed">
                            We have received your order. Our team will process and ship it shortly. You will receive an email confirmation.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            {[
                                { icon: ShieldMinus, label: "Secured", sub: "Checkout" },
                                { icon: Gift, label: "Wrapped", sub: "Premium Care" },
                                { icon: CreditCard, label: "Settled", sub: "Processed" }
                            ].map(feat => (
                                <div key={feat.label} className="p-4 bg-brand-ink text-brand-cream flex flex-col items-center gap-2">
                                    <feat.icon size={18} className="text-brand-bronze" />
                                    <span className="text-[11px] uppercase tracking-widest font-bold leading-none">{feat.label}</span>
                                    <span className="text-[11px] uppercase tracking-wider text-brand-cream/60">{feat.sub}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                setOrderSuccess(false);
                                navigate('/');
                            }}
                            className="w-full py-4 bg-brand-ink text-white uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all"
                        >
                            Continue Shopping
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
