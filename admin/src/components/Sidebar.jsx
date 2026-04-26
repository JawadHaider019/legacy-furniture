import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCog,
    faPlus,
    faList,
    faShoppingCart,
    faLayerGroup,
    faStore,
    faSignOutAlt,
    faChartLine,
    faTags,
    faNewspaper,
    faImages,
    faCommentDots,
    faReply,
    faUsers,
    faEllipsisH,
    faChevronDown,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const [adminLogo, setAdminLogo] = useState("");
    const [loading, setLoading] = useState(true);
    const [isContentOpen, setIsContentOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { logout } = useAuth();
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname, location.search]);

    useEffect(() => {
        const fetchAdminLogo = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/business-details`);
                if (response.data.success && response.data.data?.logos?.admin?.url) {
                    setAdminLogo(response.data.data.logos.admin.url);
                }
            } catch (error) {
                console.error('Error fetching admin logo:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminLogo();
    }, []);

    const allLinks = [
        { to: "/", icon: faChartLine, label: "Dashboard" },
        { to: "/add", icon: faPlus, label: "Add Product" },
        { to: "/list", icon: faList, label: "Product List" },
        { to: "/orders", icon: faShoppingCart, label: "Orders" },
        { to: "/categories", icon: faTags, label: "Categories" },
        { to: "/blogs", icon: faNewspaper, label: "Blogs" },
        { to: "/banners", icon: faImages, label: "Banners" },
        // { to: "/testimonials", icon: faCommentDots, label: "Testimonials" },
        { to: "/comments", icon: faReply, label: "Comments" },
        // { to: "/teams", icon: faUsers, label: "Teams" },
        { to: "/other", icon: faEllipsisH, label: "Delivery" },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-ink text-brand-bronze rounded-full shadow-2xl flex items-center justify-center z-40 border border-brand-bronze/20 active:scale-95 transition-transform"
            >
                <FontAwesomeIcon icon={faLayerGroup} className="text-xl" />
            </button>

            {/* Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-brand-ink/80 backdrop-blur-sm z-50 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 w-72 bg-brand-ink h-screen flex flex-col z-[60] shadow-2xl overflow-y-auto scrollbar-hide transition-transform duration-500 lg:sticky lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Brand Branding */}
                <div className="p-8 border-b border-white/5 relative">
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden absolute top-4 right-4 text-brand-cream/40 hover:text-brand-bronze p-2"
                    >
                        <FontAwesomeIcon icon={faEllipsisH} />
                    </button>

                    <Link to="/" className="flex flex-col items-center group">
                        <h2 className="text-brand-cream font-serif text-xl tracking-[0.1em] text-center">LEGACY</h2>
                        <p className="text-brand-bronze text-[11px] font-bold tracking-[0.4em] uppercase mt-1">Furniture</p>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {allLinks.map((link) => {
                        const isActive = link.to.includes('?')
                            ? (location.pathname === "/content-management" && location.search.includes(link.to.split('?')[1]))
                            : (location.pathname === link.to && !location.search);

                        return (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={() =>
                                    `flex items-center gap-4 px-6 py-3.5 rounded-sm transition-all duration-500 group relative border border-transparent ${isActive
                                        ? "bg-brand-bronze/10 border-brand-bronze/20 text-brand-bronze font-bold"
                                        : "text-brand-cream/60 hover:text-brand-bronze hover:bg-white/5"
                                    }`
                                }
                            >
                                <FontAwesomeIcon icon={link.icon} className={`w-5 text-lg transition-colors ${isActive ? 'text-brand-bronze' : 'text-brand-cream/20 group-hover:text-brand-bronze'}`} />
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{link.label}</span>
                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-1/2 bg-brand-bronze" />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer / Account */}
                <div className="p-4 mt-auto">
                    <div className="bg-white/5 p-4 rounded-sm border border-white/5">
                        <Link to="/settings" className="flex items-center gap-4 px-2 py-3 text-brand-cream/60 hover:text-brand-bronze transition-colors group">
                            <FontAwesomeIcon icon={faCog} className="w-4 group-hover:rotate-90 transition-transform duration-700" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Settings</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-4 px-2 py-3 text-red-400/60 hover:text-red-400 transition-colors group mt-2"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-left">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
