import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { slugify } from '../utils/slugify';

export default function CartSidebar({ cartOpen, setCartOpen }) {
    const navigate = useNavigate();
    const { products, cartItems, getCartCount, getCartAmount, updateQuantity, currency } = useContext(ShopContext);

    return (
        <AnimatePresence>
            {cartOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-brand-ink/40 backdrop-blur-sm flex justify-end"
                >
                    <div className="absolute inset-0" onClick={() => setCartOpen(false)} />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="w-full max-w-xl bg-brand-cream h-full flex flex-col shadow-2xl relative"
                    >
                        <div className="p-6 flex justify-between items-center border-b border-brand-ink/5 bg-brand-cream/50 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-bronze">Shopping Cart</span>
                                <span className="text-[11px] bg-brand-ink text-white w-5 h-5 flex items-center justify-center rounded-full font-bold">{getCartCount()}</span>
                            </div>
                            <button onClick={() => setCartOpen(false)} className="hover:rotate-90 transition-transform duration-300">
                                <X size={24} strokeWidth={1.5} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                            {Object.keys(cartItems).length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <ShoppingBag size={40} strokeWidth={1} className="mb-4 opacity-20" />
                                    <h4 className="text-lg font-serif italic text-brand-ink/40 mb-4">Your cart is empty.</h4>
                                    <button
                                        onClick={() => {
                                            setCartOpen(false);
                                            navigate('/shop');
                                        }}
                                        className="text-[11px] uppercase tracking-wider font-bold luxury-underline"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                Object.keys(cartItems).map((itemId) => {
                                    const productData = products.find((p) => p._id === itemId);
                                    if (!productData) return null;

                                    return Object.keys(cartItems[itemId]).map((variantKey) => {
                                        if (cartItems[itemId][variantKey] <= 0) return null;

                                        return (
                                            <motion.div
                                                key={`${itemId}-${variantKey}`}
                                                layout
                                                className="flex gap-4 group"
                                            >
                                                <div
                                                    className="w-20 aspect-square border border-brand-ink/5 bg-white overflow-hidden shadow-sm flex-shrink-0 cursor-pointer"
                                                    onClick={() => {
                                                        setCartOpen(false);
                                                        navigate(`/product/${slugify(productData.name)}`);
                                                    }}
                                                >
                                                    <img src={productData.image[0]} alt={productData.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div className="flex justify-between items-start">
                                                        <div
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                setCartOpen(false);
                                                                navigate(`/product/${slugify(productData.name)}`);
                                                            }}
                                                        >
                                                            <h5 className="text-xs font-bold uppercase tracking-wider mb-1 leading-tight">{productData.name}</h5>
                                                            <div className="flex flex-wrap gap-x-2 gap-y-1 mb-1">
                                                                <span className="text-[11px] uppercase tracking-wider text-brand-muted font-semibold">
                                                                    {variantKey}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => updateQuantity(itemId, variantKey, 0)}
                                                            className="text-brand-ink/20 hover:text-red-500 transition-colors p-1 -mr-1"
                                                        >
                                                            <Trash2 size={14} strokeWidth={1.5} />
                                                        </button>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-widest">Qty:</span>
                                                            <div className="flex items-center border border-brand-ink/10 h-6">
                                                                <button
                                                                    onClick={() => updateQuantity(itemId, variantKey, cartItems[itemId][variantKey] - 1)}
                                                                    className="w-6 h-full flex items-center justify-center text-brand-ink hover:bg-brand-ink/5 transition-colors"
                                                                >-</button>
                                                                <span className="w-6 text-center text-[11px] font-bold text-brand-ink">
                                                                    {cartItems[itemId][variantKey]}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(itemId, variantKey, cartItems[itemId][variantKey] + 1)}
                                                                    className="w-6 h-full flex items-center justify-center text-brand-ink hover:bg-brand-ink/5 transition-colors"
                                                                >+</button>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-sans font-bold">{currency}{(productData.price * cartItems[itemId][variantKey]).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    });
                                })
                            )}
                        </div>

                        {getCartCount() > 0 && (
                            <div className="p-6 bg-white border-t border-brand-ink/5 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center text-[11px] uppercase tracking-wider font-bold text-brand-muted">
                                        <span>Delivery Fee</span>
                                        <span className="text-green-600">Calculated at Checkout</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-[11px] uppercase tracking-wider font-bold text-brand-ink">Subtotal</span>
                                        <span className="text-xl font-sans font-bold">{currency}{getCartAmount().toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setCartOpen(false);
                                        navigate('/checkout');
                                    }}
                                    className="w-full py-4 bg-brand-ink text-brand-cream uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all flex items-center justify-center gap-3 group"
                                >
                                    Proceed to Checkout
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <p className="text-center text-[11px] text-brand-ink/40 mt-4 font-semibold italic">
                                    Delivery details carefully handled.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
