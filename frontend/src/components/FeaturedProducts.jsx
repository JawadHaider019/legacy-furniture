import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function FeaturedProducts({ products, wishlistItems, toggleWishlist }) {
    const navigate = useNavigate();

    return (
        <section className="py-12 px-6 max-w-[1600px] mx-auto ">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div className="max-w-xl">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-bronze mb-3 block italic">Featured Selection</span>
                    <h2 className="text-2xl md:text-3xl font-serif text-brand-ink uppercase leading-none tracking-tight">
                        Latest <span className="italic">Collection</span>
                    </h2>
                    <p className="mt-4 text-brand-muted text-sm max-w-md font-light">Explore our latest acquisitions in minimalist furniture design. Each piece is selected for quality and craftsmanship.</p>
                </div>
                <button
                    onClick={() => navigate('/shop')}
                    className="text-[11px] uppercase tracking-[0.2em] font-bold luxury-underline pb-1 mt-4 md:mt-0"
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
    );
}
