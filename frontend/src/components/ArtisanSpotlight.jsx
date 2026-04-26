import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function ArtisanSpotlight() {
    const navigate = useNavigate();

    return (
        <section className="py-12 bg-brand-ink text-brand-cream overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">
                <div className="relative group">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="aspect-[1/1] overflow-hidden"
                    >
                        <img
                            src="/workspace.png"
                            alt="Modern Interior Design"
                            className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 transform group-hover:scale-105"
                            referrerPolicy="no-referrer"
                        />
                    </motion.div>
                    <div className="absolute -bottom-6 -right-6 w-48 aspect-square bg-brand-bronze p-6 hidden md:flex flex-col justify-end">
                        <span className="text-[12px] md:text-sm uppercase tracking-[0.2em] font-bold mb-2 opacity-60 text-white">Crafted with care</span>
                        <p className="text-base font-serif leading-tight text-white italic">Design that transcends seasons.</p>
                    </div>
                </div>
                <div className="max-w-md px-2 md:px-0">
                    <span className="text-premium-sm text-brand-bronze mb-4 block italic lowercase">Our Workshop</span>
                    <h2 className="text-3xl md:text-5xl font-light font-serif uppercase tracking-tight leading-tighter">
                        Timeless
                        <span className="font-serif-italic text-brand-bronze "> Quality.</span>
                    </h2>
                    <p className="text-brand-cream/60 font-light text-sm my-4 leading-relaxed font-sans">
                        Legacy Furniture specializes in high-end, contemporary pieces. Each product is a testament to the endurance of sustainable wood, the honesty of natural stone, and the comfort of refined fabrics.
                    </p>
                    <button
                        onClick={() => navigate('/about')}
                        className="luxury-underline-white inline-block text-premium-xs pb-1"
                    >
                        Our Philosophy
                    </button>
                </div>
            </div>
        </section>
    );
}
