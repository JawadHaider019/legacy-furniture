import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryScroll() {
    const navigate = useNavigate();
    const { categories } = useContext(ShopContext);

    return (
        <section className="py-12 border-b border-brand-ink/5 bg-brand-cream/50">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="mb-4 flex justify-between items-end">
                    <div>
                        <span className="text-premium-sm text-brand-bronze mb-4 block italic">Discover Your Space</span>
                        <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-tight text-brand-ink">Shop by <span className="font-serif-italic">Category</span></h2>
                    </div>
                    <button
                        onClick={() => navigate('/shop')}
                        className="text-premium-xs luxury-underline pb-1"
                    >
                        View All Spaces
                    </button>
                </div>

                <div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar  snap-x">
                    {categories.map((category, idx) => (
                        <motion.div
                            key={category._id}
                            onClick={() => navigate(`/shop/${category.name.toLowerCase()}`)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group cursor-pointer snap-start shrink-0 w-[calc(50%-12px)] md:w-[350px] lg:w-[calc(25%-24px)]"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden mb-6 rounded-sm">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-brand-ink/20 group-hover:bg-brand-ink/5 transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-premium-sm text-brand-ink group-hover:text-brand-bronze transition-colors flex justify-between items-center pr-4 font-serif italic lowercase font-light">
                                    {category.name}
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h3>
                                <p className="text-premium-xs text-brand-muted opacity-60 leading-relaxed line-clamp-2 italic lowercase font-normal">
                                    {category.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}


                </div>
            </div>
        </section>
    );
}
