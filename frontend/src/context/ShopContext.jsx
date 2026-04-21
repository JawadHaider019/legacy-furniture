import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 49;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const [user, setUser] = useState(null);
    const [deliverySettings, setDeliverySettings] = useState(null);

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

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            await Promise.all([getProductsData(), getCategoriesData(), getBlogsData(), getDeliverySettingsData()]);
            if (token) {
                await getUserProfile(token);
            }
            setLoading(false);
        };
        initData();
    }, [token]);

    const value = {
        products, categories, blogs, currency, delivery_fee, deliverySettings,
        cartItems, addToCart, getCartCount, updateQuantity,
        getCartAmount, backendUrl, loading,
        getProductReviews, addProductReview,
        token, setToken, user, setUser, logout,
        login, register
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
