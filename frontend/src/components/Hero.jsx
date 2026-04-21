import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    const navigate = useNavigate();
    return (
        <section className="relative h-screen flex items-center overflow-hidden">
            {/* Background Image with Parallax-ish feel */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
                    alt="Luxury Living Room"
                    className="w-full h-full object-cover grayscale-[20%] contrast-[105%]"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 " />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-2xl"
                >
                    <span className="inline-block text-[11px] uppercase tracking-[0.4em] font-semibold text-brand-cream/80 mb-6 italic">
                        Collection 2026
                    </span>
                    <h1 className="text-4xl md:text-6xl text-white font-light leading-tight mb-8">
                        The Fine Art of <br />
                        <span className="font-serif italic text-brand-cream uppercase tracking-tight">Modern Living</span>
                    </h1>
                    <p className="text-brand-cream/70 text-base md:text-lg font-light mb-10 max-w-md leading-relaxed">
                        Curated luxury furniture and carpets that bridge the gap between sculptural form and everyday comfort. Each piece tells a story of artisanal integrity.
                    </p>

                    <div className="flex flex-wrap gap-6">
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 py-4 bg-white text-brand-ink uppercase text-[12px] tracking-[0.2em] font-semibold hover:bg-brand-cream transition-all flex items-center gap-3 group"
                        >
                            Explore Collection
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => navigate('/journal')}
                            className="px-8 py-4 border border-white/30 text-white uppercase text-[12px] tracking-[0.2em] font-semibold hover:bg-white/10 transition-all"
                        >
                            The Journal
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-12 left-1/2 hidden lg:flex items-center gap-8">

                <div className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </div>
            </div>
        </section>
    );
}
