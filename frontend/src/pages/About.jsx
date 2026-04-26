import { motion } from 'motion/react';
import { Shield, Sparkles, Sprout, Hammer } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-brand-cream overflow-hidden">
            {/* HERO */}
            <section className="relative h-[40vh] md:h-[50vh] text-center md:text-left flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/about-hero.jpg"
                        alt="Artisan Studio"
                        className="w-full h-full object-cover grayscale brightness-50"
                    />
                    <div className="absolute inset-0 bg-brand-ink/30" />
                </div>

                <div className="relative z-10 max-w-[1600px] mx-auto px-6 w-full mt-10 text-center md:text-left">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-5xl md:text-7xl font-serif text-white uppercase leading-tight tracking-tight "
                    >
                        Legacy <span className="italic text-brand-bronze">Furniture</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-base md:text-2xl text-brand-cream/90 font-light leading-relaxed font-serif italic"
                    >
                        "Crafting quality furniture for the modern home."
                    </motion.p>
                </div>
            </section>

            {/* MANIFESTO */}
            <section className="py-12 md:py-20 bg-brand-ink text-brand-cream">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="aspect-[4/5] overflow-hidden grayscale">
                        <img
                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000"
                            className="w-full h-full object-cover grayscale brightness-75 duration-[3000ms] hover:scale-105"
                            alt="Atelier"
                        />
                    </div>
                    <div className="space-y-8">
                        <span className="text-[11px] uppercase tracking-widest font-bold text-brand-bronze italic">Our Story</span>
                        <h2 className="text-2xl md:text-5xl font-serif uppercase tracking-tight leading-tight">
                            Quality design <br />
                            <span className="italic font-light">for every home.</span>
                        </h2>
                        <div className="space-y-6 text-base font-light leading-relaxed text-brand-cream/80">
                            <p>
                                Legacy Furniture is built on the belief that your home is your sanctuary. We prioritize quality materials, timeless designs, and unmatched durability.
                            </p>
                            <p>
                                Each piece is mindfully crafted, ensuring that it will remain a staple in your home for years to come.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 pt-6">
                            {[
                                { icon: Hammer, label: "Quality Built", sub: "Premium Materials" },
                                { icon: Sprout, label: "Sustainable", sub: "Eco-Friendly Setup" }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <item.icon className="text-brand-bronze" size={24} />
                                    <h4 className="text-[11px] uppercase tracking-widest font-bold">{item.label}</h4>
                                    <p className="text-[11px] text-brand-cream/60 uppercase tracking-widest">{item.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES PILLARS */}
            <section className="py-12 md:py-24 px-4 md:px-6 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {[
                        {
                            title: "Quality Materials",
                            desc: "We use only the finest woods, fabrics, and metals. Every component is rigorously tested for durability.",
                            icon: Shield
                        },
                        {
                            title: "Timeless Design",
                            desc: "Our furniture is designed to transcend fleeting trends, fitting seamlessly into any aesthetic.",
                            icon: Sparkles
                        },
                        {
                            title: "Built to Last",
                            desc: "Furniture is an investment. Our construction is intended to give you pieces that can be enjoyed for generations.",
                            icon: Sprout
                        }
                    ].map((pillar, idx) => (
                        <div key={idx} className="space-y-6 group">
                            <div className="w-14 h-14 border border-brand-ink/10 flex items-center justify-center group-hover:bg-brand-ink group-hover:text-white transition-all duration-500">
                                <pillar.icon strokeWidth={1.5} size={24} />
                            </div>
                            <h3 className="text-2xl font-serif uppercase tracking-tight">{pillar.title}</h3>
                            <p className="text-brand-muted font-light leading-relaxed text-base">
                                {pillar.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
