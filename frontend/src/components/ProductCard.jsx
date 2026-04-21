import { motion } from 'motion/react';
import { Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { slugify } from '../utils/slugify';

export default function ProductCard({ product, isWishlisted, onWishlistToggle }) {
    const navigate = useNavigate();
    const currentPrice = product.discountprice && product.discountprice < product.price ? product.discountprice : product.price;
    const originalPrice = product.discountprice && product.discountprice < product.price ? product.price : null;
    const discountValue = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
            onClick={() => navigate(`/product/${slugify(product.name)}`)}
        >
            <div className="relative aspect-[4/5] overflow-hidden mb-3 md:mb-8 bg-white shadow-sm ring-1 ring-brand-ink/5">
                <img
                    src={product.image[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 md:top-6 md:left-6 flex flex-col gap-1 md:gap-2">
                    {product.isNew && (
                        <span className="bg-brand-ink px-2 md:px-4 py-1 text-[7px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white shadow-xl">
                            New
                        </span>
                    )}
                    {discountValue > 0 && (
                        <span className="bg-red-600 px-2 md:px-4 py-1 text-[7px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white shadow-xl">
                            -{discountValue}% Off
                        </span>
                    )}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onWishlistToggle?.();
                    }}
                    className={`absolute top-6 right-6 p-2 transition-all opacity-0 group-hover:opacity-100 duration-300 ${isWishlisted ? 'text-red-500 scale-110 opacity-100' : 'text-brand-ink/40 hover:text-red-500'}`}
                >
                    <Heart size={18} strokeWidth={1.5} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

                {/* Hover Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/20 to-transparent">
                    <button className="w-full py-4 bg-brand-ink text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black flex items-center justify-center gap-3">
                        Quick Shop
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-brand-ink font-serif text-sm md:text-2xl uppercase tracking-tight group-hover:text-brand-bronze transition-colors leading-none line-clamp-2">
                        {product.name}
                    </h3>
                    <div className="flex flex-col items-end">
                        <p className="text-brand-ink font-sans font-medium text-sm md:text-lg">
                            ${currentPrice.toLocaleString()}
                        </p>
                        {originalPrice && (
                            <p className="text-brand-muted text-sm line-through opacity-50">
                                ${originalPrice.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <span className="text-brand-bronze text-[10px] uppercase tracking-[0.3em] font-bold italic">
                        {product.category}
                    </span>
                    <div className="h-[1px] flex-1 bg-brand-ink/5" />
                    <span className="text-[10px] font-bold text-brand-ink/30 uppercase tracking-[0.2em]">Ready to ship</span>
                </div>
            </div>
        </motion.div>
    );
}
