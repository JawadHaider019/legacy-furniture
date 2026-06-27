import { useContext } from 'react';
import { Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import OrderSuccessOverlay from './OrderSuccessOverlay';

// Pages
import Home from '../pages/Home';
import Collection from '../pages/Collection';
import Orders from '../pages/Orders';
import Favorites from '../pages/Favorites';
import Checkout from '../pages/Checkout';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Journal from '../pages/Journal';
import BlogDetail from '../pages/BlogDetail';
import ProductDetail from '../pages/ProductDetail';

// Helper for legacy redirects with params
const RedirectToShop = () => {
    const { category } = useParams();
    return <Navigate to={`/shop/${category}`} replace />;
};


export default function RouterContent({
    cartOpen, setCartOpen, wishlistItems, toggleWishlist,
    handlePlaceOrder, isOrdering,
    orderSuccess, setOrderSuccess, orders,
    onOpenLogin, syncOrders, isSyncing
}) {
    const navigate = useNavigate();
    const { products, getCartCount, getCartAmount, token } = useContext(ShopContext);

    const handleToggleWishlist = (id) => {
        if (!token) {
            onOpenLogin();
            return;
        }
        toggleWishlist(id);
    };

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
                    {/* Legacy Redirects */}
                    <Route path="/collection" element={<Navigate to="/shop" replace />} />
                    <Route path="/collection/:category" element={<RedirectToShop />} />

                    <Route path="/" element={
                        <Home
                            products={products}
                            wishlistItems={wishlistItems}
                            toggleWishlist={handleToggleWishlist}
                        />
                    } />
                    <Route path="/shop" element={
                        <Collection
                            wishlistItems={wishlistItems}
                            onWishlistToggle={handleToggleWishlist}
                        />
                    } />
                    <Route path="/orders" element={
                        <Orders orders={orders} syncOrders={syncOrders} isSyncing={isSyncing} />
                    } />
                    <Route path="/favorites" element={
                        <Favorites
                            favorites={products.filter(p => wishlistItems.includes(p._id))}
                            onWishlistToggle={handleToggleWishlist}
                        />
                    } />
                    <Route path="/shop/:category" element={
                        <Collection
                            wishlistItems={wishlistItems}
                            onWishlistToggle={handleToggleWishlist}
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
                            onWishlistToggle={handleToggleWishlist}
                            isWishlisted={(id) => wishlistItems.includes(id)}
                            onOpenLogin={onOpenLogin}
                        />
                    } />
                </Routes>
            </main>


            <Footer />
            <Toaster position="bottom-left" />

            <OrderSuccessOverlay
                orderSuccess={orderSuccess}
                setOrderSuccess={setOrderSuccess}
            />

            <CartSidebar
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
            />
        </div>
    );
}
