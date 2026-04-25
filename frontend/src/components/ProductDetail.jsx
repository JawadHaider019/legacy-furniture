import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import { slugify } from '../utils/slugify';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowLeft, ShoppingBag, Heart, Share2, Star,
    Truck, Ruler, Package, ChevronRight, Info,
    X, ChevronLeft, Upload, Camera, CheckCircle2,
    Maximize2, ZoomIn, MessageSquare, ArrowRight
} from 'lucide-react';
import ProductCard from './ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail({ onWishlistToggle, isWishlisted, onOpenLogin }) {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, currency, getProductReviews, addProductReview, backendUrl, user, deliverySettings } = useContext(ShopContext);

    // Lightbox State
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Review System State
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [dynamicReviews, setDynamicReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        content: '',
        images: []
    });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const product = useMemo(() => products.find(p => slugify(p.name) === slug), [products, slug]);
    const id = product?._id;
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [zipCode, setZipCode] = useState('');
    const [currentPrice, setCurrentPrice] = useState(0);
    const [currentMSRP, setCurrentMSRP] = useState(0);
    const [qty, setQty] = useState(1);

    const relatedProducts = products
        .filter(p => p.category === product?.category && p._id !== product?._id)
        .slice(0, 4);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (product) {
            setSelectedVariantIndex(0);
            setSelectedImage(0);
            setCurrentPrice(product.price);
            setCurrentMSRP(product.discountprice || product.price);

            // Fetch dynamic reviews
            const fetchReviews = async () => {
                const reviews = await getProductReviews(id);
                setDynamicReviews(reviews);
            };
            fetchReviews();
        }
    }, [id, product, getProductReviews]);

    // Update price when variant changes
    useEffect(() => {
        if (product && product.variants && product.variants[selectedVariantIndex]) {
            const variant = product.variants[selectedVariantIndex];

            // MSRP is the base price of the variant, or falling back to product base price
            const msrp = Number(variant.price) || Number(product.price);

            // Current Price is the variant's discount price, 
            // fallback to variant's base price (if no variant discount), 
            // fallback to product's discount price, 
            // finally fallback to product's base price.
            let price = Number(variant.discountPrice) || Number(variant.price) || Number(product.discountprice) || Number(product.price);

            setCurrentMSRP(msrp);
            setCurrentPrice(price);
        } else if (product) {
            setCurrentPrice(Number(product.discountprice) || Number(product.price));
            setCurrentMSRP(Number(product.price));
        }
    }, [selectedVariantIndex, product]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-cream">
                <div className="text-center">
                    <h2 className="text-3xl font-serif mb-4 text-brand-ink">Piece not found.</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm uppercase tracking-widest luxury-underline font-bold"
                    >
                        Go back to collection
                    </button>
                </div>
            </div>
        );
    }

    const discountValue = currentMSRP ? Math.round(((currentMSRP - currentPrice) / currentMSRP) * 100) : 0;

    return (
        <>


            <div className="min-h-screen pt-16 md:pt-20 pb-8 md:pb-16 px-4 md:px-6 bg-white">

                <div className="max-w-7xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start mb-10 md:mb-20">

                        {/* LEFT: Image Gallery */}
                        <div className="lg:col-span-7 flex flex-col gap-4">
                            {/* Main Image */}
                            <div className="relative aspect-[1/1] overflow-hidden bg-white shadow-sm cursor-zoom-in group">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        src={
                                            (product.variants && product.variants[selectedVariantIndex]?.images && product.variants[selectedVariantIndex].images[0]) ||
                                            (product.variants && product.variants[selectedVariantIndex]?.image) ||
                                            (product.image && product.image[selectedImage])
                                        }
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {/* Variant Specific Images */}
                                {product.variants && product.variants[selectedVariantIndex]?.images?.map((img, idx) => (
                                    <button
                                        key={`variant-${idx}`}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative flex-shrink-0 w-24 aspect-square overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-brand-ink' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`${product.name} variant view ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}

                                {/* Main Product Images */}
                                {product.image?.map((img, idx) => (
                                    <button
                                        key={`main-${idx}`}
                                        onClick={() => {
                                            setLightboxIndex(idx);
                                            setIsLightboxOpen(true);
                                        }}
                                        className="relative flex-shrink-0 w-24 aspect-square overflow-hidden border-2 transition-all border-transparent opacity-60 hover:opacity-100"
                                    >
                                        <img src={img} alt={`${product.name} view ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            <div className="text-[10px] uppercase tracking-widest text-brand-muted text-center mt-2">
                                {selectedImage + 1} / {product.image?.length || 0}
                            </div>
                        </div>

                        {/* RIGHT: Product Information */}
                        <div className="lg:col-span-5 flex flex-col">
                            <div className="mb-8">
                                <h1 className="text-2xl md:text-3xl font-serif text-brand-ink mb-1 uppercase tracking-tight leading-tight">
                                    {product.name} {product.variants && product.variants[selectedVariantIndex] ? `- ${product.variants[selectedVariantIndex].name}` : ''}
                                </h1>
                                <p className="text-[12px] text-brand-muted font-bold tracking-widest mb-4">
                                    by <span className="text-brand-ink italic uppercase">{product.brand || 'Auden Atelier'}</span>
                                </p>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-0.5 text-brand-ink">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} strokeWidth={1} />
                                        ))}
                                    </div>
                                    <div className="h-4 w-[1px] bg-brand-ink/10" />
                                    <button
                                        onClick={() => {
                                            const reviewsSection = document.getElementById('reviews-anchor');
                                            reviewsSection?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-[11px] font-bold tracking-widest text-brand-ink/60 hover:text-brand-ink transition-colors border-b border-brand-ink/20"
                                    >
                                        {product.reviewsCount} Ratings & Reviews
                                    </button>
                                </div>

                                <div className="h-[1px] w-full bg-brand-ink/5 mb-8" />

                                <div className="space-y-4 mb-8">
                                    {currentMSRP > 0 && (
                                        <div className="flex items-center gap-3 text-brand-muted italic">
                                            <span className="text-lg line-through">{currency}{currentMSRP.toFixed(2)}</span>
                                            <span className="text-sm font-bold text-red-600 uppercase tracking-widest">{discountValue}% Off MSRP</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-bronze">Sale Price</span>
                                        <p className="text-4xl md:text-5xl font-sans font-black text-brand-ink">
                                            {currency}{currentPrice.toFixed(2)}
                                        </p>
                                    </div>

                                    {deliverySettings?.freeDeliveryAbove > 0 && (
                                        <div className="flex items-center gap-2 text-[11px] font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-sm w-fit border border-green-100">
                                            <Truck size={14} />
                                            Free Shipping over {currency}{deliverySettings.freeDeliveryAbove.toLocaleString()}
                                        </div>
                                    )}
                                </div>



                                {/* VARIANTS */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="space-y-8 mb-10">
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black mb-4 flex justify-between">
                                                Select Variant
                                                <span className="text-brand-muted font-normal lowercase italic">Current: {product.variants[selectedVariantIndex]?.name}</span>
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {product.variants.map((variant, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedVariantIndex(idx)}
                                                        className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${selectedVariantIndex === idx ? 'border-brand-ink bg-brand-ink text-white' : 'border-brand-ink/10 hover:border-brand-ink/40 bg-white'}`}
                                                    >
                                                        {variant.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* QUANTITY & ACTIONS */}
                                <div className="flex gap-4 mb-10">
                                    <div className="w-24 border border-brand-ink/10 flex items-center justify-between px-3 relative">
                                        <span className="text-[9px] absolute -top-2 left-2 bg-brand-cream px-1 uppercase font-bold text-brand-muted">Qty</span>
                                        <select
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                            className="w-full bg-transparent outline-none text-sm font-bold py-4 appearance-none"
                                        >
                                            {[1, 2, 3, 4, 5, 10].map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => product && addToCart(product._id, product.variants?.[selectedVariantIndex]?.name || 'default')}
                                        className="flex-1 py-6 bg-brand-ink text-brand-cream uppercase text-[12px] tracking-[0.3em] font-black hover:bg-black transition-all flex items-center justify-center gap-4 group shadow-xl"
                                    >
                                        Add to Cart
                                        <ShoppingBag size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-10">
                                    <button
                                        onClick={() => product && onWishlistToggle(product._id)}
                                        className={`py-4 border border-brand-ink/10 flex items-center justify-center gap-3 hover:bg-white transition-all ${product && isWishlisted(product._id) ? 'text-red-600 bg-red-50/30' : ''}`}
                                    >
                                        <Heart size={16} strokeWidth={1.5} fill={product && isWishlisted(product._id) ? "currentColor" : "none"} />
                                        <span className="text-[10px] uppercase tracking-widest font-black">
                                            {product && isWishlisted(product._id) ? 'Favorite' : 'Add to Wishlist'}
                                        </span>
                                    </button>
                                    <button className="py-4 border border-brand-ink/10 flex items-center justify-center gap-3 hover:bg-white transition-all">
                                        <Share2 size={16} strokeWidth={1.5} />
                                        <span className="text-[10px] uppercase tracking-widest font-black">Link</span>
                                    </button>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-brand-ink/5">
                                    <details className="group border-b border-brand-ink/5 pb-4" open>
                                        <summary className="flex items-center justify-between cursor-pointer list-none py-2">
                                            <h5 className="text-[11px] uppercase tracking-[0.2em] font-black group-open:text-brand-ink text-brand-muted transition-colors">Product Details</h5>
                                            <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                                        </summary>
                                        <div className="pt-4 space-y-4">
                                            <p className="text-[11px] font-bold text-brand-ink/40 uppercase tracking-widest italic">Item#: {product.specs?.sku}</p>
                                            <p className="text-[12px] font-light leading-relaxed text-brand-ink mb-6">
                                                {product.variants && product.variants[selectedVariantIndex]?.description ? (
                                                    <span className="block mb-4 p-4 bg-brand-cream/30 border-l-2 border-brand-bronze italic">
                                                        {product.variants[selectedVariantIndex].description}
                                                    </span>
                                                ) : null}
                                                {product.description}
                                            </p>
                                            <div className="p-4 bg-brand-ink/5 rounded-sm">
                                                <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest mb-1 flex items-center gap-2">
                                                    <Info size={12} /> Important WARNING
                                                </p>
                                                <p className="text-[10px] font-light italic text-brand-ink/60">Proposition 65 warning for California residents regarding wood dust and chemical substances.</p>
                                            </div>
                                        </div>
                                    </details>

                                    <details className="group border-b border-brand-ink/5 pb-4">
                                        <summary className="flex items-center justify-between cursor-pointer list-none py-2">
                                            <h5 className="text-[11px] uppercase tracking-[0.2em] font-black text-brand-muted group-open:text-brand-ink transition-colors">Specifications</h5>
                                            <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                                        </summary>
                                        <div className="pt-6 grid grid-cols-2 gap-x-8 gap-y-4 pb-4">
                                            {[
                                                { l: 'Top Material', v: product.specs?.material },
                                                { l: 'Dimensions', v: product.specs?.dimensions },
                                                { l: 'Weight', v: product.specs?.weight },
                                                { l: 'Model Number', v: product.specs?.modelNumber },
                                                { l: 'Assembly', v: product.specs?.assembly ? 'Required' : 'Assembled' },
                                                { l: 'Country of Origin', v: product.specs?.origin },
                                                { l: 'Warranty', v: product.specs?.warranty },
                                            ].map(spec => (
                                                <div key={spec.l} className="space-y-1">
                                                    <p className="text-[9px] uppercase font-black text-brand-muted tracking-widest">{spec.l}</p>
                                                    <p className="text-xs font-bold text-brand-ink">{spec.v}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* REVIEWS SECTION */}
                    <section id="reviews-anchor" className="pt-24 border-t border-brand-ink/10 mb-32">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
                            {/* Review Sentiment Header */}
                            <div>
                                <h3 className="text-3xl font-serif text-brand-ink mb-6 uppercase tracking-tight">Customer Reviews</h3>
                                <div className="flex flex-col gap-2 mb-8">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl md:text-5xl font-sans font-black text-brand-ink">
                                            {dynamicReviews.length > 0
                                                ? (dynamicReviews.reduce((acc, r) => acc + r.rating, 0) / dynamicReviews.length).toFixed(1)
                                                : (product.rating || 0)}
                                        </span>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-0.5 text-brand-ink">
                                                {[...Array(5)].map((_, i) => {
                                                    const avg = dynamicReviews.length > 0
                                                        ? dynamicReviews.reduce((acc, r) => acc + r.rating, 0) / dynamicReviews.length
                                                        : (product.rating || 0);
                                                    return <Star key={i} size={14} fill={i < Math.floor(avg) ? "currentColor" : "none"} strokeWidth={1} />;
                                                })}
                                            </div>
                                            <span className="text-[10px] font-bold tracking-widest text-brand-ink/40 uppercase">
                                                {dynamicReviews.length || product.reviewsCount} Ratings
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-12">
                                    {[
                                        { s: 5, c: 25 },
                                        { s: 4, c: 3 },
                                        { s: 3, c: 2 },
                                        { s: 2, c: 1 },
                                        { s: 1, c: 1 }
                                    ].map(row => (row.c > 0 && (
                                        <div key={row.s} className="flex items-center gap-4 group cursor-pointer">
                                            <span className="text-[10px] font-bold w-4 opacity-40">{row.s}</span>
                                            <div className="flex-1 h-2 bg-brand-ink/5 relative overflow-hidden rounded-full">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${(row.c / product.reviewsCount) * 100}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="absolute inset-y-0 left-0 bg-brand-ink"
                                                />
                                            </div>
                                            <span className="text-[9px] font-bold text-brand-muted w-4">{row.c}</span>
                                        </div>
                                    )))}
                                </div>

                                <button
                                    onClick={() => {
                                        if (!user) {
                                            toast('Please sign in to share a review.', { icon: '🔒', style: { background: '#1A1A1A', color: '#F4F1ED', fontSize: '10px', textTransform: 'uppercase', borderRadius: '0px' } });
                                            if (onOpenLogin) onOpenLogin();
                                        } else {
                                            setIsReviewModalOpen(true);
                                        }
                                    }}
                                    className="w-full py-4 border-2 border-brand-ink text-[11px] font-black uppercase tracking-widest hover:bg-brand-ink hover:text-white transition-all shadow-md group flex items-center justify-center gap-3"
                                >
                                    Write a Review
                                    <MessageSquare size={14} className="group-hover:rotate-12 transition-transform" />
                                </button>
                            </div>

                            {/* Review Gallery & Content */}
                            <div className="lg:col-span-3">
                                <div className="mb-12">
                                    <h4 className="text-[10px] uppercase font-black tracking-widest text-brand-ink/40 mb-6">Customer Artifact Gallery</h4>
                                    <div className="flex flex-wrap gap-4">
                                        {(product.image || []).map((img, i) => (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    setLightboxIndex(i);
                                                    setIsLightboxOpen(true);
                                                }}
                                                className="w-24 aspect-square overflow-hidden bg-brand-ink/5 border border-brand-ink/5 hover:border-brand-ink/20 transition-all cursor-pointer group relative"
                                            >
                                                <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all group-hover:scale-110 duration-700" />
                                                <div className="absolute inset-0 bg-brand-ink/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                    <Maximize2 size={16} className="text-white translate-y-2 group-hover:translate-y-0 transition-transform" />
                                                </div>
                                            </div>
                                        ))}
                                        <div className="w-24 aspect-square bg-brand-ink/5 border-2 border-dashed border-brand-ink/10 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-brand-muted hover:bg-brand-cream transition-colors cursor-pointer">
                                            +12 More
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-b border-brand-ink/5 pb-4 mb-12">
                                    <span className="text-[11px] font-black uppercase tracking-widest">Showing {product.reviews?.length || 0} of {product.reviewsCount} Reviews</span>
                                    <div className="flex gap-4">
                                        <select className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer">
                                            <option>Most Recent</option>
                                            <option>Highest Rating</option>
                                            <option>Lowest Rating</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-16">
                                    {dynamicReviews.length > 0 ? (
                                        dynamicReviews.map(review => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                key={review._id}
                                                className="grid grid-cols-1 md:grid-cols-4 gap-8"
                                            >
                                                <div className="md:col-span-1">
                                                    <h5 className="text-[11px] font-black uppercase tracking-[0.2em] mb-1">{review.author}</h5>
                                                    <span className="text-[8px] font-black px-2 py-0.5 bg-green-100 text-green-800 uppercase tracking-widest rounded-sm">Verified Inhabitant</span>
                                                    <p className="text-[10px] text-brand-muted italic mt-3 uppercase tracking-widest">
                                                        {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="md:col-span-3">
                                                    <div className="flex mb-4 gap-1 text-brand-ink">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={1} />
                                                        ))}
                                                    </div>
                                                    <p className="text-[11px] font-black uppercase tracking-widest mb-3">
                                                        {review.rating >= 4 ? 'EXCELLENT PURCHASE' : 'ARCHIVE PERSPECTIVE'}
                                                    </p>
                                                    <p className="text-sm font-light leading-relaxed text-brand-ink/80 mb-6 italic">
                                                        "{review.content}"
                                                    </p>

                                                    {review.reviewImages && review.reviewImages.length > 0 && (
                                                        <div className="flex gap-4 mb-6">
                                                            {review.reviewImages.map((img, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="w-20 aspect-square overflow-hidden cursor-pointer group"
                                                                    onClick={() => {
                                                                        window.open(img.url, '_blank');
                                                                    }}
                                                                >
                                                                    <img src={img.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all border border-brand-ink/5" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-brand-muted border-t border-brand-ink/5 pt-4">
                                                        <div className="flex gap-4">
                                                            <span>Was this helpful?</span>
                                                            <button className="text-brand-ink hover:text-brand-bronze underline decoration-brand-bronze/30 underline-offset-4">Yes ({review.likes || 0})</button>
                                                            <button className="text-brand-ink hover:text-brand-bronze underline decoration-brand-bronze/30 underline-offset-4">No ({review.dislikes || 0})</button>
                                                        </div>
                                                        {review.hasReply && <span className="bg-brand-bronze/5 px-2 py-1 italic">Atelier Responded</span>}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center bg-brand-cream/30 border border-dashed border-brand-ink/5">
                                            <p className="text-[10px] uppercase font-black tracking-[0.4em] text-brand-ink/30 mb-8">No perspectives shared yet.</p>
                                            <button
                                                onClick={() => {
                                                    if (!user) {
                                                        toast('Please sign in to share a review.', { icon: '🔒', style: { background: '#1A1A1A', color: '#F4F1ED', fontSize: '10px', textTransform: 'uppercase', borderRadius: '0px' } });
                                                        if (onOpenLogin) onOpenLogin();
                                                    } else {
                                                        setIsReviewModalOpen(true);
                                                    }
                                                }}
                                                className="px-8 py-4 border border-brand-ink text-[10px] font-black uppercase tracking-widest hover:bg-brand-ink hover:text-white transition-all"
                                            >
                                                Be the first to share
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* RELATED PRODUCTS */}
                    {relatedProducts.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="pt-16 border-t border-brand-ink/5"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                                <div className="max-w-xl">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-bronze mb-3 block italic">More From This Collection</span>
                                    <h2 className="text-3xl md:text-4xl font-light italic font-serif">Related Products</h2>
                                </div>
                                <button
                                    onClick={() => navigate('/')}
                                    className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                                >
                                    Shop All
                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-12">
                                {relatedProducts.map(relProduct => (
                                    <ProductCard
                                        key={relProduct._id}
                                        product={relProduct}
                                        onWishlistToggle={() => onWishlistToggle(relProduct._id)}
                                        isWishlisted={isWishlisted(relProduct._id)}
                                    />
                                ))}
                            </div>
                        </motion.section>
                    )}
                </div>
                <section className="py-10 md:py-16 px-4 md:px-6 border-t border-brand-ink/5 mt-10 md:mt-16">
                    <div className="flex justify-between items-end mb-10">
                        <div className="max-w-xl">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-bronze mb-3 block italic">You May Also Like</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-brand-ink uppercase leading-none tracking-tight">
                                Complementary <span className="italic font-light text-brand-bronze">Pieces</span>
                            </h2>
                        </div>
                        <button
                            onClick={() => navigate('/shop')}
                            className="text-[10px] uppercase tracking-[0.2em] font-bold luxury-underline pb-1 hidden md:block"
                        >
                            Browse Catalog
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-16">
                        {products
                            .filter(p => p.category === product.category && p._id !== product._id)
                            .slice(0, 4)
                            .map((p) => (
                                <ProductCard
                                    key={p._id}
                                    product={p}
                                    isWishlisted={isWishlisted(p._id)}
                                    onWishlistToggle={() => onWishlistToggle(p._id)}
                                />
                            ))
                        }
                    </div>
                </section>

                {/* RECENTLY VIEWED / BOTTOM CTA */}
                <section className="py-16 bg-brand-ink text-brand-cream text-center">
                    <div className="max-w-2xl mx-auto px-6">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-bronze mb-6 block grayscale opacity-60">Need Help?</span>
                        <h3 className="text-2xl md:text-3xl font-serif italic mb-6">Questions about sizing or style?</h3>
                        <p className="text-brand-cream/60 mb-8 font-light tracking-wide text-sm">Our support team is available to assist you with any inquiries regarding our pieces.</p>
                        <button className="px-10 py-4 border border-brand-bronze text-brand-bronze uppercase text-[10px] tracking-widest font-bold hover:bg-brand-bronze hover:text-white transition-all duration-500">
                            Contact Support
                        </button>
                    </div>
                </section>

                {/* IMAGE LIGHTBOX */}
                <AnimatePresence>
                    {isLightboxOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
                        >
                            <button
                                onClick={() => setIsLightboxOpen(false)}
                                className="absolute top-10 right-10 text-white/40 hover:text-white transition-colors z-[110]"
                            >
                                <X size={40} strokeWidth={1} />
                            </button>

                            <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
                                <motion.img
                                    key={lightboxIndex}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={product.image[lightboxIndex]}
                                    className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                                />

                                <button
                                    onClick={() => setLightboxIndex(prev => (prev > 0 ? prev - 1 : product.image.length - 1))}
                                    className="absolute left-0 h-full px-8 text-white/20 hover:text-white transition-colors group"
                                >
                                    <ChevronLeft size={64} strokeWidth={1} className="group-hover:scale-125 transition-transform" />
                                </button>

                                <button
                                    onClick={() => setLightboxIndex(prev => (prev < product.image.length - 1 ? prev + 1 : 0))}
                                    className="absolute right-0 h-full px-8 text-white/20 hover:text-white transition-colors group"
                                >
                                    <ChevronRight size={64} strokeWidth={1} className="group-hover:scale-125 transition-transform" />
                                </button>
                            </div>

                            <div className="absolute bottom-10 flex gap-4 overflow-x-auto p-4 max-w-full no-scrollbar">
                                {product.image.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setLightboxIndex(i)}
                                        className={`w-20 h-20 overflow-hidden border-2 transition-all shrink-0 ${lightboxIndex === i ? 'border-brand-bronze scale-110 opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* REVIEW MODAL */}
                <AnimatePresence>
                    {isReviewModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsReviewModalOpen(false)}
                                className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="relative w-full max-w-lg bg-white p-8 md:p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[90vh] no-scrollbar"
                            >
                                <button
                                    onClick={() => setIsReviewModalOpen(false)}
                                    className="absolute top-6 right-6 text-brand-ink/40 hover:text-brand-ink transition-colors"
                                >
                                    <X size={24} strokeWidth={1.5} />
                                </button>

                                <div className="mb-10">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-bronze mb-3 block italic">Product Review</span>
                                    <h3 className="text-2xl font-serif text-brand-ink uppercase tracking-tight">Write a <span className="italic">Review.</span></h3>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3 text-center">
                                        <label className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/60">Rating</label>
                                        <div className="flex justify-center gap-4">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                    className={`transition-all ${reviewForm.rating >= star ? 'text-brand-bronze scale-125' : 'text-brand-ink/10 rotate-12 hover:rotate-0'}`}
                                                >
                                                    <Star size={32} fill={reviewForm.rating >= star ? 'currentColor' : 'none'} strokeWidth={1} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Review</label>
                                        <textarea
                                            rows={4}
                                            value={reviewForm.content}
                                            onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                                            className="w-full bg-brand-cream/50 border border-brand-ink/5 p-4 text-sm outline-none focus:bg-white focus:border-brand-bronze/40 transition-all resize-none font-sans"
                                            placeholder="Tell us what you think about this product..."
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Add Photos</label>
                                        <div className="grid grid-cols-4 gap-3">
                                            <label className="aspect-square bg-brand-cream/50 border-2 border-dashed border-brand-ink/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-brand-bronze/40 transition-all group">
                                                <Camera size={18} className="text-brand-ink/20 group-hover:text-brand-bronze transition-colors mb-1" />
                                                <span className="text-[8px] font-bold uppercase tracking-widest text-brand-ink/40">Capture</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files);
                                                        setReviewForm({ ...reviewForm, images: [...reviewForm.images, ...files] });
                                                    }}
                                                />
                                            </label>
                                            {reviewForm.images.map((file, idx) => (
                                                <div key={idx} className="relative aspect-square overflow-hidden border border-brand-ink/5">
                                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => setReviewForm({ ...reviewForm, images: reviewForm.images.filter((_, i) => i !== idx) })}
                                                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-brand-ink"
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmittingReview || !reviewForm.content}
                                        onClick={async () => {
                                            if (!user) {
                                                toast.error('Sign in to submit a review.', {
                                                    style: { background: '#1A1A1A', color: '#F4F1ED', fontSize: '10px', textTransform: 'uppercase', borderRadius: '0px' }
                                                });
                                                return;
                                            }
                                            setIsSubmittingReview(true);
                                            try {
                                                const formData = new FormData();
                                                formData.append('targetType', 'product');
                                                formData.append('productId', id);
                                                formData.append('userId', user._id);
                                                formData.append('content', reviewForm.content);
                                                formData.append('rating', reviewForm.rating);
                                                reviewForm.images.forEach(img => formData.append('reviewImages', img));

                                                await addProductReview(formData);
                                                toast.success('Your review has been submitted.', {
                                                    style: { background: '#1A1A1A', color: '#F4F1ED', fontSize: '10px', textTransform: 'uppercase', borderRadius: '0px' }
                                                });
                                                setIsReviewModalOpen(false);
                                                setReviewForm({ rating: 5, content: '', images: [] });
                                                const updated = await getProductReviews(id);
                                                setDynamicReviews(updated);
                                            } catch (err) {
                                                console.error(err);
                                                toast.error('Failed to submit review.');
                                            } finally {
                                                setIsSubmittingReview(false);
                                            }
                                        }}
                                        className="w-full py-5 bg-brand-ink text-brand-cream uppercase text-[11px] tracking-[0.4em] font-black hover:bg-black transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                    >
                                        {isSubmittingReview ? 'Transmitting...' : 'Exhibit Review'}
                                        {!isSubmittingReview && <ArrowRight size={16} />}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
