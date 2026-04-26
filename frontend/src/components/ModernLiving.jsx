import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ModernLiving() {
    const navigate = useNavigate();

    return (
        <section className="py-8 md:py-12 px-4 md:px-6 max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-4 space-y-6 md:space-y-8">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-bronze italic">Modern Living</span>
                    <h2 className="text-2xl md:text-3xl font-serif text-brand-ink uppercase leading-none tracking-tight">
                        Crafting Your <span className="italic">Space</span>
                    </h2>
                    <p className="text-brand-muted font-light leading-relaxed text-sm">
                        We believe that the furniture we use shapes our environment. Our mission is to provide pieces that offer both beautiful design and everyday utility.
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] font-bold text-brand-ink"
                    >
                        Shop the Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>
                <div className="lg:col-span-8 grid grid-cols-2 gap-4 md:gap-8">
                    <div className="aspect-square bg-brand-ink/5 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Artisan Chair" />
                    </div>
                    <div className="aspect-[3/4] bg-brand-ink/5 overflow-hidden mt-10 md:mt-16">
                        <img src="https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Minimalist Interior" />
                    </div>
                </div>
            </div>
        </section>
    );
}
