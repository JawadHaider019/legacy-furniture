import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';

export default function Hero() {
    const navigate = useNavigate();
    const { banners } = useContext(ShopContext);
    const [currentIndex, setCurrentIndex] = useState(0);

    const FALLBACK_BANNERS = [
        {
            headingLine1: "Elevate Your",
            headingLine2: "Signature Style",
            subtext: "Discover our curated collection of heritage furniture and artisanal carpets, designed for modern legacies.",
            buttonText: "Shop The Look",
            redirectUrl: "/shop",
            imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
        }
    ];

    const displayBanners = banners && banners.length > 0 ? banners : FALLBACK_BANNERS;

    useEffect(() => {
        if (displayBanners.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [displayBanners.length]);

    const nextBanner = () => {
        setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
    };

    const prevBanner = () => {
        setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
    };

    const currentBanner = displayBanners[currentIndex];

    return (
        <section className="relative h-screen flex items-center overflow-hidden bg-brand-ink">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={currentBanner.imageUrl}
                        alt={currentBanner.headingLine1}
                        className="w-full h-full object-cover grayscale-[20%] contrast-[105%]"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" }}
                    />
                    <div className="absolute inset-0 bg-black/40 " />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-2xl"
                    >
                        <span className="inline-block text-[12px] md:text-sm uppercase tracking-[0.4em] font-semibold text-brand-cream/80 mb-6 italic">
                            {currentBanner.subtext ? "Featured Collection" : "Collection 2026"}
                        </span>
                        <h1 className="text-4xl md:text-6xl text-white font-light leading-tight mb-8">
                            {currentBanner.headingLine1} <br />
                            <span className="font-serif italic text-brand-cream uppercase tracking-tight">
                                {currentBanner.headingLine2}
                            </span>
                        </h1>
                        {currentBanner.subtext && (
                            <p className="text-brand-cream/70 text-base md:text-lg font-light mb-10 max-w-md leading-relaxed">
                                {currentBanner.subtext}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-6">
                            <button
                                onClick={() => navigate(currentBanner.redirectUrl || '/shop')}
                                className="px-8 py-4 bg-white text-brand-ink uppercase text-[12px] md:text-sm tracking-[0.2em] font-semibold hover:bg-brand-cream transition-all flex items-center gap-3 group"
                            >
                                {currentBanner.buttonText || "Explore Collection"}
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            {displayBanners.length > 1 && (
                <div className="absolute bottom-12 right-12 z-20 flex gap-4">
                    <button
                        onClick={prevBanner}
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-ink transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextBanner}
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-ink transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Decorative Elements / Dots */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 hide-on-mobile z-20">
                <div className="flex gap-4">
                    {displayBanners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'bg-brand-bronze scale-150' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
