import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '£';
    const delivery_fee = 49;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [banners, setBanners] = useState([]);
    const [banners2, setBanners2] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const [user, setUser] = useState(null);
    const [deliverySettings, setDeliverySettings] = useState(null);
    const [businessDetails, setBusinessDetails] = useState(null);

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getCategoriesData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/categories/list');
            // Backend returns categories array directly
            if (Array.isArray(response.data)) {
                setCategories(response.data);
            } else if (response.data.success) {
                setCategories(response.data.categories || []);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getBlogsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/blogs');
            if (response.data.success) {
                // Backend returns blogs in 'data' field
                setBlogs(response.data.data || []);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getDeliverySettingsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/delivery-settings');
            if (response.data && response.data.mode) {
                setDeliverySettings(response.data);
            }
        } catch (error) {
            console.log("Error fetching delivery settings:", error);
        }
    };

    const getBannersData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/banners/active?section=1');
            if (response.data.success) {
                console.log("Fetched Banners:", response.data.data);
                setBanners(response.data.data || []);
            }
        } catch (error) {
            console.log("Error fetching banners:", error);
        }
    };

    const getBanners2Data = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/banners/active?section=2');
            if (response.data.success) {
                console.log("Fetched Banners 2:", response.data.data);
                setBanners2(response.data.data || []);
            }
        } catch (error) {
            console.log("Error fetching banners 2:", error);
        }
    };

    const getBusinessDetailsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/business-details');
            if (response.data.success) {
                setBusinessDetails(response.data.data);
            }
        } catch (error) {
            console.log("Error fetching business details:", error);
        }
    };

    const addToCart = async (itemId, variantName = 'default') => {
        let cartData = structuredClone(cartItems);

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        if (!cartData[itemId][variantName]) {
            cartData[itemId][variantName] = 1;
        } else {
            cartData[itemId][variantName] += 1;
        }
        setCartItems(cartData);
        toast.success("Added to cart", {
            style: {
                background: '#1A1A1A',
                color: '#F4F1ED',
                fontSize: '10px',
                textTransform: 'uppercase',
                borderRadius: '0px',
                border: '1px solid rgba(244, 241, 237, 0.1)'
            },
            iconTheme: {
                primary: '#C5A059',
                secondary: '#F4F1ED',
            },
        });
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, variantKey, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][variantKey] = quantity;
        setCartItems(cartData);
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue;
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
        return totalAmount;
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                return { success: true };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                return { success: true };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: error.message };
        }
    };

    const getProductReviews = async (productId) => {
        try {
            const response = await axios.get(`${backendUrl}/api/comments?productId=${productId}`);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const addProductReview = async (formData) => {
        try {
            const response = await axios.post(`${backendUrl}/api/comments`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    const logout = () => {
        setToken("");
        setUser(null);
        localStorage.removeItem('token');
        toast.success("Signed out successfully");
    };

    const getUserProfile = async (tk) => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/data`, {
                headers: { token: tk }
            });
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [wishlistItems, setWishlistItems] = useState([]);

    const getWishlistData = async (tk) => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/favorites`, {
                headers: { token: tk }
            });
            if (response.data.success) {
                setWishlistItems(response.data.favorites);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleFavorite = async (itemId) => {
        if (!token) {
            toast.error("Please login to add favorites", {
                style: {
                    background: '#1A1A1A',
                    color: '#C5A059',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    borderRadius: '0px'
                }
            });
            return;
        }
        try {
            const response = await axios.post(`${backendUrl}/api/user/favorites-toggle`, { itemId }, {
                headers: { token }
            });
            if (response.data.success) {
                setWishlistItems(response.data.favorites);
                toast.success(response.data.message, {
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
            }
        } catch (error) {
            console.log(error);
            if (error.response?.status === 401) {
                toast.error("Login Required", {
                    style: {
                        background: '#1A1A1A',
                        color: '#C5A059',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        borderRadius: '0px'
                    }
                });
            } else {
                toast.error(error.message);
            }
        }
    };

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            await Promise.all([getProductsData(), getCategoriesData(), getBlogsData(), getDeliverySettingsData(), getBannersData(), getBanners2Data(), getBusinessDetailsData()]);
            if (token) {
                await Promise.all([getUserProfile(token), getWishlistData(token)]);
            } else {
                setWishlistItems([]);
            }
            setLoading(false);
        };
        initData();
    }, [token]);

    const placeOrder = async (orderData) => {
        try {
            const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
                headers: { token }
            });
            if (response.data.success) {
                setCartItems({});
                toast.success("Order Placed Successfully", {
                    style: {
                        background: '#1A1A1A',
                        color: '#F4F1ED',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        borderRadius: '0px'
                    }
                });
                return { success: true, orderId: response.data.orderId };
            } else {
                toast.error(response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error("Order placement error:", error);
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return { success: false, message };
        }
    };

    const value = {
        products, categories, blogs, banners, banners2, currency, delivery_fee, deliverySettings,
        cartItems, addToCart, getCartCount, updateQuantity,
        getCartAmount, backendUrl, loading,
        getProductReviews, addProductReview,
        token, setToken, user, setUser, logout,
        login, register, placeOrder,
        wishlistItems, toggleFavorite,
        businessDetails
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
