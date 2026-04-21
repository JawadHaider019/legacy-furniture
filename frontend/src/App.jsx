import { useContext, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import { slugify } from './utils/slugify';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryScroll from './components/CategoryScroll';
import Collection from './components/Collection';
import ProductDetail from './components/ProductDetail';
import Favorites from './components/Favorites';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import ProductCard from './components/ProductCard';
import About from './components/About';
import BlogDetail from './components/BlogDetail';
import Journal from './components/Journal';
import BlogSection from './components/BlogSection';
import LoginModal from './components/LoginModal';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MessageCircle, Phone, CheckCircle2, ShieldMinus, Gift, CreditCard, X, ShoppingBag, Trash2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function Home({ wishlistItems, toggleWishlist }) {
    const navigate = useNavigate();
    const { products } = useContext(ShopContext);

    return (
        <>
            <Hero />
            <CategoryScroll />

            {/* FEATURED PRODUCT GRID/SLIDER */}
            <section className="py-12 px-6 max-w-[1600px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                    <div className="max-w-xl">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-bronze mb-3 block italic">Featured Selection</span>
                        <h2 className="text-2xl md:text-3xl font-serif text-brand-ink uppercase leading-none tracking-tight">
                            Curated <span className="italic">Products</span>
                        </h2>
                        <p className="mt-4 text-brand-muted text-sm max-w-md font-light">Explore our latest acquisitions in minimalist furniture design. Each piece is selected for quality and craftsmanship.</p>
                    </div>
                    <button
                        onClick={() => navigate('/shop')}
                        className="text-[10px] uppercase tracking-[0.2em] font-bold luxury-underline pb-1 mt-4 md:mt-0"
                    >
                        Explore Collection
                    </button>
                </div>

                {/* REVERTED TO ONE-LINE SLIDER - Showing exactly 3 on LG */}
                <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-8 snap-x">
                    {products.slice(0, 9).map((product) => (
                        <div key={product._id} className="w-[calc(50%-8px)] md:w-[350px] lg:w-[calc(33.333%-1rem)] snap-start shrink-0">
                            <ProductCard
                                product={product}
                                isWishlisted={wishlistItems.includes(product._id)}
                                onWishlistToggle={() => toggleWishlist(product._id)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ARTISAN SPOTLIGHT */}
            <section className="py-12 bg-brand-ink text-brand-cream overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">
                    <div className="relative group">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-[4/5] overflow-hidden"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=1000"
                                alt="Modern Interior Design"
                                className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 transform group-hover:scale-105"
                                referrerPolicy="no-referrer"
                            />
                        </motion.div>
                        <div className="absolute -bottom-6 -right-6 w-48 aspect-square bg-brand-bronze p-6 hidden md:flex flex-col justify-end">
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2 opacity-60 text-white">Est. 1994</span>
                            <p className="text-base font-serif leading-tight text-white italic">Design that transcends seasons.</p>
                        </div>
                    </div>
                    <div className="max-w-md px-2 md:px-0">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-bronze mb-4 block italic">Our Workshop</span>
                        <h2 className="text-3xl md:text-4xl font-light leading-tight mb-6 font-serif uppercase tracking-tight">
                            Timeless <br />
                            <span className="italic text-brand-bronze">Quality.</span>
                        </h2>
                        <p className="text-brand-cream/60 font-light text-sm mb-8 leading-relaxed font-sans">
                            Legacy Furniture specializes in high-end, contemporary pieces. Each product is a testament to the endurance of sustainable wood, the honesty of natural stone, and the comfort of refined fabrics.
                        </p>
                        <button
                            onClick={() => navigate('/about')}
                            className="luxury-underline-white inline-block text-[11px] uppercase tracking-[0.2em] font-bold pb-2"
                        >
                            Our Philosophy
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-8 md:py-12 px-4 md:px-6 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-4 space-y-6 md:space-y-8">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-bronze italic">Modern Living</span>
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

            <section className="py-8 md:py-12 border-t border-b border-brand-ink/5 flex items-center justify-center gap-6 md:gap-16 opacity-40 grayscale overflow-x-auto px-4 md:px-6 no-scrollbar scrolling-touch">
                <span className="text-xl font-serif tracking-wides whitespace-nowrap uppercase italic font-light">Vogue Living</span>
                <span className="text-xl font-serif tracking-wides whitespace-nowrap uppercase font-medium">Arch Digest</span>
                <span className="text-xl font-serif tracking-wides whitespace-nowrap uppercase italic font-light">Elle Decor</span>
                <span className="text-xl font-serif tracking-wides whitespace-nowrap uppercase font-medium">Hypebeast</span>
            </section>

            <BlogSection />
        </>
    );
}

export default function App() {
    const [cartOpen, setCartOpen] = useState(false);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('auden-orders');
        return saved ? JSON.parse(saved) : [];
    });
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('auden-orders', JSON.stringify(orders));
    }, [orders]);

    const toggleWishlist = (id) => {
        setWishlistItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handlePlaceOrder = async (details) => {
        setIsOrdering(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Logic will be updated when order API is integrated
        setCartOpen(false);
        setIsOrdering(false);
        setOrderSuccess(true);
    };

    return (
        <Router>
            <RouterContent
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
                wishlistItems={wishlistItems}
                toggleWishlist={toggleWishlist}
                handlePlaceOrder={handlePlaceOrder}
                isOrdering={isOrdering}
                orderSuccess={orderSuccess}
                setOrderSuccess={setOrderSuccess}
                orders={orders}
                onOpenLogin={() => setLoginOpen(true)}
            />
            <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
        </Router>
    );
}

function RouterContent({
    cartOpen, setCartOpen, wishlistItems, toggleWishlist,
    handlePlaceOrder, isOrdering,
    orderSuccess, setOrderSuccess, orders,
    onOpenLogin
}) {
    const navigate = useNavigate();
    const { products, cartItems, getCartCount, getCartAmount, updateQuantity, removeFromCart, currency } = useContext(ShopContext);

    return (
        <div className="min-h-screen bg-brand-cream selection:bg-brand-bronze selection:text-white">
            <Navbar
                cartCount={getCartCount()}
                wishlistCount={wishlistItems.length}
                onOpenCart={() => setCartOpen(true)}
                onOpenLogin={onOpenLogin}
            />

            <main>
                <Routes>
                    <Route path="/" element={
                        <Home
                            wishlistItems={wishlistItems}
                            toggleWishlist={toggleWishlist}
                        />
                    } />
                    <Route path="/shop" element={
                        <Collection
                            wishlistItems={wishlistItems}
                            onWishlistToggle={toggleWishlist}
                        />
                    } />
                    <Route path="/orders" element={
                        <Orders orders={orders} />
                    } />
                    <Route path="/favorites" element={
                        <Favorites
                            favorites={products.filter(p => wishlistItems.includes(p._id))}
                            onWishlistToggle={toggleWishlist}
                        />
                    } />
                    <Route path="/collection/:category" element={
                        <Collection
                            wishlistItems={wishlistItems}
                            onWishlistToggle={toggleWishlist}
                        />
                    } />
                    <Route path="/checkout" element={
                        <Checkout
                            onPlaceOrder={handlePlaceOrder}
                            isOrdering={isOrdering}
                        />
                    } />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/product/:slug" element={
                        <ProductDetail
                            onWishlistToggle={toggleWishlist}
                            isWishlisted={(id) => wishlistItems.includes(id)}
                            onOpenLogin={onOpenLogin}
                        />
                    } />
                </Routes>
            </main>

            <Footer />
            <Toaster position="bottom-left" />

            {/* ORDER SUCCESS OVERLAY */}
            <AnimatePresence>
                {orderSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-brand-ink flex items-center justify-center p-6 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-brand-cream max-w-xl w-full p-10 md:p-12 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 inset-x-0 h-1 bg-brand-bronze" />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.3 }}
                                className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
                            >
                                <CheckCircle2 size={40} />
                            </motion.div>

                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-bronze mb-4 block">Order Successfully Placed</span>
                            <h2 className="text-2xl md:text-3xl font-serif text-brand-ink mb-6 uppercase leading-tight">Your order is <span className="italic">confirmed.</span></h2>
                            <p className="text-brand-muted font-light text-sm mb-10 max-w-md mx-auto leading-relaxed">
                                We have received your order. Our team will process and ship it shortly. You will receive an email confirmation.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                {[
                                    { icon: ShieldMinus, label: "Secured", sub: "Checkout" },
                                    { icon: Gift, label: "Wrapped", sub: "Premium Care" },
                                    { icon: CreditCard, label: "Settled", sub: "Processed" }
                                ].map(feat => (
                                    <div key={feat.label} className="p-4 bg-brand-ink text-brand-cream flex flex-col items-center gap-2">
                                        <feat.icon size={18} className="text-brand-bronze" />
                                        <span className="text-[9px] uppercase tracking-widest font-bold leading-none">{feat.label}</span>
                                        <span className="text-[8px] uppercase tracking-wider text-brand-cream/60">{feat.sub}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    setOrderSuccess(false);
                                    navigate('/');
                                }}
                                className="w-full py-4 bg-brand-ink text-white uppercase text-xs tracking-widest font-semibold hover:bg-black transition-all"
                            >
                                Continue Shopping
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CART SIDEBAR */}
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
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-bronze">Shopping Cart</span>
                                    <span className="text-[10px] bg-brand-ink text-white w-5 h-5 flex items-center justify-center rounded-full font-bold">{getCartCount()}</span>
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
                                                                    <span className="text-[9px] uppercase tracking-wider text-brand-muted font-semibold">
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
                                                            <span className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest">Qty: {cartItems[itemId][variantKey]}</span>
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
                                        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold text-brand-muted">
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

                                    <p className="text-center text-[9px] text-brand-ink/40 mt-4 font-semibold italic">
                                        Delivery details carefully handled.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-18 right-10 z-[40] flex flex-col gap-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 bg-white border border-brand-ink/5 shadow-2xl rounded-full flex items-center justify-center text-brand-ink hover:bg-brand-ink hover:text-white transition-all group"
                >
                    <MessageCircle size={24} strokeWidth={1.5} />
                    <div className="absolute right-20 bg-brand-ink text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-sm shadow-xl">
                        Chat with Expert
                    </div>
                </motion.button>

            </div>
        </div>
    );
}
