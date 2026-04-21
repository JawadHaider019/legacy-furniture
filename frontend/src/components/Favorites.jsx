import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from './ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Favorites({ favorites, onWishlistToggle }) {
    const navigate = useNavigate();
    const { addToCart } = useContext(ShopContext);

    const handleQuickAdd = (product) => {
        // Default variants for quick add
        addToCart(product._id, 'default', 'default');
        toast.success(`${product.name} added to sanctuary bag`, {
            style: {
                background: '#1A1A1A',
                color: '#F4F1ED',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                borderRadius: '0px',
                border: '1px solid rgba(244, 241, 237, 0.1)',
            },
            iconTheme: {
                primary: '#C5A059',
                secondary: '#1A1A1A',
            },
        });
    };

    return (
        <div className="min-h-screen bg-brand-cream pb-16">
            {/* HERO */}
            <section className="relative h-[30vh] flex items-center overflow-hidden mb-12 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&q=80&w=2000"
                        alt="Serene Atmosphere"
                        className="w-full h-full object-cover grayscale brightness-50"
                    />
                    <div className="absolute inset-0 bg-brand-ink/40" />
                </div>
                <div className="relative z-10 max-w-[1600px] mx-auto px-6 w-full mt-10 text-center md:text-left">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-bronze mb-3 block italic"
                    >
                        Your Curated Selection
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-6xl font-serif uppercase tracking-tight leading-tight mb-4"
                    >
                        Your <span className="italic font-light text-brand-bronze">Favorites.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-brand-cream/60 font-light max-w-md italic font-serif text-base md:text-xl"
                    >
                        A personal anthology of pieces that resonate with your design philosophy.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-6">

                {favorites.length === 0 ? (
                    <div className="py-40 text-center border-t border-brand-ink/5">
                        <Heart size={48} strokeWidth={0.5} className="mx-auto mb-8 text-brand-ink/20 animate-pulse" />
                        <h3 className="text-2xl font-serif italic text-brand-ink/40 mb-8">No pieces have been favored yet.</h3>
                        <button
                            onClick={() => navigate('/shop')}
                            className="group relative overflow-hidden px-12 py-5 border border-brand-ink text-brand-ink uppercase text-[10px] tracking-[0.3em] font-black hover:text-brand-cream transition-colors duration-500"
                        >
                            <span className="relative z-10">Discover The Collection</span>
                            <div className="absolute inset-0 bg-brand-ink translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-12 md:gap-y-24">
                        <AnimatePresence mode="popLayout">
                            {favorites.map((product) => (
                                <motion.div
                                    key={product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative group"
                                >
                                    <ProductCard
                                        product={product}
                                        isWishlisted={true}
                                        onWishlistToggle={() => {
                                            onWishlistToggle(product._id);
                                            toast('Piece removed from favorites', {
                                                icon: '🏺',
                                                style: {
                                                    background: '#1A1A1A',
                                                    color: '#F4F1ED',
                                                    fontSize: '10px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.2em',
                                                    borderRadius: '0px',
                                                }
                                            });
                                        }}
                                    />

                                    {/* QUICK ACCESS OVERLAY */}
                                    <div className="mt-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <button
                                            onClick={() => handleQuickAdd(product)}
                                            className="flex-1 py-4 bg-brand-ink text-brand-cream uppercase text-[9px] tracking-[0.2em] font-black flex items-center justify-center gap-3 hover:bg-black transition-colors"
                                        >
                                            Quick Acquire
                                            <ShoppingBag size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
