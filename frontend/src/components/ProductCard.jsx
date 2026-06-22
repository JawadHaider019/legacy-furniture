import { motion } from 'motion/react';
import { Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { slugify } from '../utils/slugify';
import { cleanName as cleanText } from '../utils/cleanText';

export default function ProductCard({ product, isWishlisted, onWishlistToggle }) {
    const navigate = useNavigate();
    const { currency, categories } = useContext(ShopContext);
    const price = Number(product.price);
    const salePrice = Number(product.discountprice);
    const hasDiscount = salePrice > 0 && salePrice < price;

    const currentPrice = hasDiscount ? salePrice : price;
    const originalPrice = hasDiscount ? price : null;
    const discountValue = hasDiscount ? Math.round(((price - salePrice) / price) * 100) : 0;

    const cleanName = cleanText(product.name);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
            onClick={() => navigate(`/product/${slugify(cleanName)}`)}
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
                        <span className="bg-brand-ink px-3 md:px-4 py-1 text-premium-xs text-white shadow-xl">
                            New
                        </span>
                    )}
                    {discountValue > 0 && (
                        <span className="bg-red-600 px-3 md:px-4 py-1 text-premium-xs text-white shadow-xl">
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
                    <button className="w-full py-4 bg-brand-ink text-white text-premium-xs hover:bg-black flex items-center justify-center gap-3">
                        Quick Shop
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <div
                        className="text-brand-ink text-sm md:text-lg tracking-tight group-hover:text-brand-bronze transition-colors leading-none line-clamp-2"
                        style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 500,
                            textTransform: 'uppercase',
                        }}
                    >
                        {cleanName}
                        {product.reviewsCount > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-brand-ink/10 fill-none'}`}
                                            xmlns="http://www.w3.org/2001/svg"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="1"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                    ))}
                                </div>

                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-brand-ink font-sans font-medium text-sm md:text-base">
                            {currency}{currentPrice.toLocaleString()}
                        </p>
                        {originalPrice && (
                            <p className="text-[10px] md:text-xs text-brand-muted line-through opacity-50">
                                {currency}{originalPrice.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>


                <div className="hidden md:flex items-center gap-3">
                    <span className="text-brand-bronze text-premium-xs italic lowercase">
                        {categories.find(c => c._id === product.category || c.name === product.category)?.name || product.category}
                    </span>
                    <div className="h-[1px] flex-1 bg-brand-ink/5" />
                    <span className="text-premium-xs text-brand-ink/20 lowercase">Ready to ship</span>
                </div>
            </div>
        </motion.div>
    );
}
