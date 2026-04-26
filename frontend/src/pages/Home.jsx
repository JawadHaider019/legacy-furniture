import Hero from '../components/Hero';
import CategoryScroll from '../components/CategoryScroll';
import FeaturedProducts from '../components/FeaturedProducts';

import ArtisanSpotlight from '../components/ArtisanSpotlight';
import ModernLiving from '../components/ModernLiving';
import PressLogos from '../components/PressLogos';
import BlogSection from '../components/BlogSection';

export default function Home({ wishlistItems, toggleWishlist, products }) {
    return (
        <>
            <Hero />
            <CategoryScroll />
            <FeaturedProducts
                products={products}
                wishlistItems={wishlistItems}
                toggleWishlist={toggleWishlist}
            />

            <ArtisanSpotlight />
            <ModernLiving />
            <PressLogos />
            <BlogSection />
        </>
    );
}
