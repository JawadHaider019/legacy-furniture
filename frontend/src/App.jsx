import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import { ShopContext } from './context/ShopContext';
import LoginModal from './components/LoginModal';
import RouterContent from './components/RouterContent';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
    const [cartOpen, setCartOpen] = useState(false);
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('auden-orders');
        return saved ? JSON.parse(saved) : [];
    });
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const { products, cartItems, getCartAmount, placeOrder, deliverySettings, backendUrl, wishlistItems, toggleFavorite: toggleWishlist } = useContext(ShopContext);

    useEffect(() => {
        localStorage.setItem('auden-orders', JSON.stringify(orders));
    }, [orders]);

    // Sync order statuses with backend on mount
    useEffect(() => {
        syncOrderStatuses();
    }, [backendUrl]);
    const syncOrderStatuses = async () => {
        try {
            if (!orders || orders.length === 0) return;

            const orderIds = orders.map(o => o._id).filter(id => id);
            // Only sync if we have backend URL and actual _ids (not temp ones)
            if (!backendUrl || orderIds.length === 0) return;

            setIsSyncing(true);
            const res = await axios.post(`${backendUrl}/api/order/sync-statuses`, { orderIds });

            if (res.data.success && res.data.orders) {
                setOrders(prevOrders => {
                    const updatedOrders = [...prevOrders];
                    res.data.orders.forEach(liveOrder => {
                        const index = updatedOrders.findIndex(o => o._id === liveOrder._id);
                        if (index !== -1) {
                            updatedOrders[index].status = liveOrder.status;
                        }
                    });
                    return updatedOrders;
                });
            }
        } catch (err) {
            console.error("Failed to sync order statuses:", err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const handlePlaceOrder = async (details) => {
        setIsOrdering(true);

        const items = [];
        Object.keys(cartItems).forEach(itemId => {
            const product = products.find(p => p._id === itemId);
            if (product) {
                Object.keys(cartItems[itemId]).forEach(variantKey => {
                    const quantity = cartItems[itemId][variantKey];
                    if (quantity > 0) {
                        const variantObj = product.variants?.find(v => v.name === variantKey);
                        items.push({
                            id: itemId,
                            name: product.name,
                            quantity: quantity,
                            price: variantObj?.price || product.price,
                            image: (variantObj?.images && variantObj.images[0]) || variantObj?.image || product.image[0],
                            variant: variantKey
                        });
                    }
                });
            }
        });

        const total = getCartAmount();
        const deliveryFee = deliverySettings?.mode === 'fixed'
            ? (deliverySettings.freeDeliveryAbove && total >= deliverySettings.freeDeliveryAbove ? 0 : deliverySettings.fixedCharge)
            : 49;

        const orderData = {
            items,
            amount: total + deliveryFee,
            address: {
                street: details.address,
                city: details.city,
                zipCode: details.zipCode,
                firstName: details.firstName,
                lastName: details.lastName
            },
            deliveryCharges: deliveryFee,
            customerDetails: {
                name: `${details.firstName} ${details.lastName}`,
                email: details.email,
                phone: details.phone
            }
        };

        const result = await placeOrder(orderData);

        if (result.success) {
            setCartOpen(false);
            setOrderSuccess(true);
            setOrders(prev => [{ ...orderData, _id: result.orderId, date: Date.now(), status: 'Order Placed' }, ...prev]);
        }
        setIsOrdering(false);
    };

    return (
        <Router>
            <ScrollToTop />
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
                syncOrders={syncOrderStatuses}
                isSyncing={isSyncing}
            />
            <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
        </Router>
    );
}
