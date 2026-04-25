import { ShoppingBag, Menu, X, Heart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export default function Navbar({ cartCount, wishlistCount, onOpenCart, onOpenLogin }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { categories, deliverySettings, currency } = useContext(ShopContext);

    const forceDarkText = location.pathname.startsWith('/product');
    const isDarkText = scrolled || forceDarkText;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <>
            {/* ANNOUNCEMENT BAR */}
            {deliverySettings?.freeDeliveryAbove > 0 && <div className={`bg-brand-ink text-brand-cream py-1.5 px-6 text-center text-[10px] uppercase tracking-[0.2em] font-bold z-[100] relative transition-all duration-500 overflow-hidden ${deliverySettings?.freeDeliveryAbove ? 'h-auto opacity-100' : 'h-0 opacity-0 py-0'}`}>
                {deliverySettings?.freeDeliveryAbove ? `Free Shipping Over   ${deliverySettings.freeDeliveryAbove.toLocaleString()}*` : ''}
            </div>}

            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-3 sm:px-6 md:px-12 ${scrolled ? 'py-3 bg-brand-cream/80 backdrop-blur-md border-b border-brand-ink/5' : 'py-3 bg-transparent'
                    }`}
                style={{ top: scrolled ? '0' : '36px' }}
            >
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">

                    {/* NAVIGATION (Left) */}
                    <div className="hidden lg:flex items-center gap-10 w-1/3">
                        <button onClick={() => navigate('/')} className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors luxury-underline ${isDarkText ? 'text-brand-ink' : 'text-white'}`}>Home</button>
                        <button onClick={() => navigate('/shop')} className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors luxury-underline ${isDarkText ? 'text-brand-ink' : 'text-white'}`}>Collection</button>
                        <button onClick={() => navigate('/orders')} className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors luxury-underline ${isDarkText ? 'text-brand-ink' : 'text-white'}`}>Orders</button>
                    </div>

                    {/* LOGO (Center) */}
                    <div className="flex-1 flex justify-center lg:w-1/3">
                        <button
                            onClick={() => navigate('/')}
                            className="group flex flex-col items-center"
                        >
                            <h1 className={`text-[12px] sm:text-sm md:text-base lg:text-xl font-serif tracking-[1px] transition-all font-medium uppercase whitespace-nowrap leading-tight ${isDarkText ? 'text-brand-ink' : 'text-white'}`}>
                                LEGACY FURNITURE & CARPETS
                            </h1>
                            <span className={`text-[8px] uppercase tracking-[0.2em] font-bold opacity-80 mt-0.5 ${isDarkText ? 'text-brand-bronze' : 'text-white/60'}`}>
                                Fine Furnishings
                            </span>
                        </button>
                    </div>

                    {/* ACTIONS (Right) */}
                    <div className="flex items-center justify-end gap-2 md:gap-8 w-1/3">
                        <div className="hidden lg:flex items-center gap-6">
                            <button
                                onClick={() => navigate('/favorites')}
                                className={`transition-colors relative ${isDarkText ? 'text-brand-ink' : 'text-white'}`}
                            >
                                <Heart size={18} strokeWidth={1.5} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-bronze text-white text-[8px] rounded-full flex items-center justify-center font-black">{wishlistCount}</span>
                                )}
                            </button>

                            <button
                                onClick={onOpenLogin}
                                className={`transition-colors ${isDarkText ? 'text-brand-ink' : 'text-white'}`}
                            >
                                <User size={18} strokeWidth={1.5} />
                            </button>
                        </div>

                        <button
                            onClick={onOpenCart}
                            className={`relative p-2 transition-colors ${isDarkText ? 'text-brand-ink' : 'text-white'}`}
                        >
                            <ShoppingBag size={18} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-brand-bronze text-white text-[8px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                            )}
                        </button>

                        <button
                            onClick={() => setIsOpen(true)}
                            className={`p-2 transition-colors lg:ml-2 ${isDarkText ? 'text-brand-ink' : 'text-white'}`}
                        >
                            <Menu size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-brand-ink/40 backdrop-blur-sm flex justify-end"
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-full max-w-sm bg-brand-cream h-full p-8 flex flex-col shadow-2xl overflow-y-auto no-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-bronze">Navigation</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-brand-ink hover:rotate-90 transition-transform duration-300"
                                >
                                    <X size={24} strokeWidth={1.5} />
                                </button>
                            </div>

                            <div className="space-y-8 pb-10">
                                {[
                                    { label: "Shop All", sub: "Explore All Pieces", path: "/shop" },
                                    { label: "My Orders", sub: "View Your Purchases", path: "/orders" },
                                    ...categories.map(cat => ({
                                        label: cat.name,
                                        sub: cat.description.split('.')[0], // Short summary
                                        path: `/collection/${cat.name.toLowerCase()}`
                                    })),
                                    { label: "Contact Us", sub: "Get in touch", path: "/contact" }
                                ].map((item, idx) => (
                                    <motion.button
                                        key={item.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + idx * 0.1 }}
                                        className="group flex flex-col items-start w-full text-left"
                                        onClick={() => {
                                            navigate(item.path);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <span className="text-2xl md:text-3xl font-serif text-brand-ink italic group-hover:text-brand-bronze transition-colors flex items-center gap-4 uppercase leading-none">
                                            {item.label}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-ink/40 mt-1">
                                            {item.sub}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Mobile-only: Login + Favorites quick actions */}
                            <div className="flex gap-3 lg:hidden mt-4 pt-6 border-t border-brand-ink/5">
                                <button
                                    onClick={() => { setIsOpen(false); onOpenLogin?.(); }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-brand-ink/10 hover:bg-brand-ink hover:text-brand-cream transition-all group"
                                >
                                    <User size={16} strokeWidth={1.5} />
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Login</span>
                                </button>
                                <button
                                    onClick={() => { setIsOpen(false); navigate('/favorites'); }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-brand-ink/10 hover:bg-brand-ink hover:text-brand-cream transition-all group relative"
                                >
                                    <Heart size={16} strokeWidth={1.5} />
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Favorites</span>
                                    {wishlistCount > 0 && (
                                        <span className="absolute top-2 right-2 w-4 h-4 bg-brand-bronze text-white text-[8px] rounded-full flex items-center justify-center font-black">{wishlistCount}</span>
                                    )}
                                </button>
                            </div>

                            <div className="mt-auto pt-8 border-t border-brand-ink/5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="text-[9px] uppercase tracking-widest font-black text-brand-ink/40 mb-2">Contact</h5>
                                        <p className="text-xs font-light">legacyfurniture18@gmail.com</p>
                                        <p className="text-xs font-light">+44 7424 757756</p>

                                    </div>
                                    <div>
                                        <h5 className="text-[9px] uppercase tracking-widest font-black text-brand-ink/40 mb-3">Social Presence</h5>
                                        <div className="flex gap-4">
                                            <span className="text-[10px] uppercase tracking-widest font-bold luxury-underline cursor-pointer">IG</span>
                                            <span className="text-[10px] uppercase tracking-widest font-bold luxury-underline cursor-pointer">TW</span>
                                            <span className="text-[10px] uppercase tracking-widest font-bold luxury-underline cursor-pointer">FB</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
