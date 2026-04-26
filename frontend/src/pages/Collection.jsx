import { useState, useMemo, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react';

export default function Collection({ wishlistItems, onWishlistToggle }) {
    const { category } = useParams();
    const navigate = useNavigate();
    const { products, categories } = useContext(ShopContext);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [priceRange, setPriceRange] = useState(10000);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sortBy, setBy] = useState('featured');

    // Filter logic
    const filteredProducts = useMemo(() => {
        let result = products;

        // Category filter
        if (category && category !== 'all') {
            result = result.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
        }

        // Price filter
        result = result.filter(p => p.price <= priceRange);

        // Brand filter
        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.includes(p.brand));
        }

        // Sorting
        if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
        if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);

        return result;
    }, [category, priceRange, selectedBrands, sortBy]);

    const allBrands = Array.from(new Set(products.map(p => p.brand)));

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="min-h-screen bg-brand-cream pb-24">
            {/* HERO */}
            <section className="relative h-[40vh] md:h-[50vh] text-center md:text-left flex items-center overflow-hidden mb-12 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/collection-hero.jpg"
                        alt="Collection Atmosphere"
                        className="w-full h-full object-cover grayscale brightness-50"
                    />
                    <div className="absolute inset-0 bg-brand-ink/40" />
                </div>
                <div className="relative z-10 max-w-[1600px] mx-auto px-6 w-full mt-10 text-center md:text-left">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-5xl md:text-7xl font-serif text-white uppercase leading-tight tracking-tight "
                    >
                        {category ? category : 'The Full'} <span className="italic font-light text-brand-bronze">Collection.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-base md:text-2xl text-brand-cream/90 font-light leading-relaxed font-serif italic"
                    >
                        "Curated designs for the modern home. Each piece is selected for quality and durability."
                    </motion.p>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-6">
                {/* REFINED FILTER CONTROLS */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-brand-ink/5">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-4">
                            <span className="text-[11px] uppercase font-bold text-brand-ink/40 tracking-[0.2em]">Sort By</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setBy(e.target.value)}
                                className="bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer text-brand-ink"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-asc">Price Ascending</option>
                                <option value="price-desc">Price Descending</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* SIDEBAR FILTERS (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-10 sticky top-32 h-fit">
                        <div>
                            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4 text-brand-ink/60">Price Range</h4>
                            <div className="space-y-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="10000"
                                    step="100"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full accent-brand-ink cursor-pointer grayscale opacity-50 hover:opacity-100 transition-opacity"
                                />
                                <div className="flex justify-between text-[11px] font-bold tracking-widest text-brand-ink">
                                    <span>$0</span>
                                    <span>Up to ${priceRange.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4 text-brand-ink/60">Brands</h4>
                            <div className="space-y-3">
                                {allBrands.map(brand => (
                                    <button
                                        key={brand}
                                        onClick={() => toggleBrand(brand)}
                                        className="flex items-center gap-3 group w-full text-left"
                                    >
                                        <div className={`w-4 h-4 border border-brand-ink/20 flex items-center justify-center transition-all ${selectedBrands.includes(brand) ? 'bg-brand-ink border-brand-ink' : 'group-hover:border-brand-ink/40'}`}>
                                            {selectedBrands.includes(brand) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                        <span className={`text-[11px] uppercase tracking-widest font-bold transition-colors ${selectedBrands.includes(brand) ? 'text-brand-ink' : 'text-brand-muted group-hover:text-brand-ink'}`}>
                                            {brand}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-4 text-brand-ink/60">Categories</h4>
                            <div className="space-y-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat._id}
                                        onClick={() => navigate(`/collection/${cat.name.toLowerCase()}`)}
                                        className={`block w-full text-left text-[11px] uppercase tracking-widest font-bold transition-colors ${category === cat.name.toLowerCase() ? 'text-brand-bronze italic' : 'text-brand-muted hover:text-brand-ink'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedBrands([]);
                                setPriceRange(10000);
                            }}
                            className="text-[11px] uppercase tracking-[0.3em] font-black luxury-underline text-brand-ink/40 hover:text-red-500"
                        >
                            Reset Filters
                        </button>
                    </aside>

                    {/* PRODUCT GRID */}
                    <main className="lg:col-span-9">
                        {filteredProducts.length === 0 ? (
                            <div className="py-20 text-center border border-dashed border-brand-ink/10">
                                <p className="text-lg font-serif italic text-brand-ink/40">No products match these criteria.</p>
                                <button
                                    onClick={() => {
                                        setSelectedBrands([]);
                                        setPriceRange(10000);
                                    }}
                                    className="mt-4 text-[11px] uppercase tracking-[0.2em] font-bold luxury-underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
                                <AnimatePresence mode="popLayout">
                                    {filteredProducts.map(product => (
                                        <motion.div
                                            key={product._id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <ProductCard
                                                product={product}
                                                isWishlisted={wishlistItems.includes(product._id)}
                                                onWishlistToggle={() => onWishlistToggle(product._id)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* MOBILE FILTERS DRAWER */}
            <AnimatePresence>
                {showMobileFilters && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-brand-ink/40 backdrop-blur-sm lg:hidden"
                    >
                        <div className="absolute inset-0" onClick={() => setShowMobileFilters(false)} />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="absolute inset-x-0 bottom-0 bg-brand-cream p-10 max-h-[90vh] overflow-y-auto rounded-t-3xl shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-2xl font-serif uppercase tracking-tight">Refine Collection</h3>
                                <button onClick={() => setShowMobileFilters(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-12">
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="w-full py-6 bg-brand-ink text-white uppercase text-[12px] tracking-[0.3em] font-black"
                                >
                                    Apply Refinement
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
