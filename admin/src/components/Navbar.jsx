import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faPlus,
  faList,
  faShoppingCart,
  faBars,
  faTimes,
  faLayerGroup,
  faStore
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { backendUrl } from "../App";
import { assets } from "../assets/assets"; // Import your assets

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminLogo, setAdminLogo] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch admin logo from backend
  useEffect(() => {
    const fetchAdminLogo = async () => {
      try {
        console.log('🔄 Fetching admin logo for navbar...');
        const response = await axios.get(`${backendUrl}/api/business-details`);

        if (response.data.success && response.data.data?.logos?.admin?.url) {
          setAdminLogo(response.data.data.logos.admin.url);
          console.log('✅ Admin logo loaded for navbar:', response.data.data.logos.admin.url);
        } else {
          console.log('ℹ️ No admin logo found, will use asset logo');
          setAdminLogo(""); // This will trigger the asset logo fallback
        }
      } catch (error) {
        console.error('❌ Error fetching admin logo:', error);
        setAdminLogo(""); // This will trigger the asset logo fallback
      } finally {
        setLoading(false);
      }
    };

    fetchAdminLogo();
  }, []);

  // Logo display component
  const LogoDisplay = ({ isMobile = false }) => {
    if (loading) {
      return (
        <div className={`animate-pulse bg-gray-300 rounded flex items-center justify-center ${isMobile ? 'w-20 h-8' : 'w-32 h-10'}`}>
          <FontAwesomeIcon icon={faStore} className="text-gray-400 text-sm" />
        </div>
      );
    }

    // If we have a backend admin logo, use it
    if (adminLogo) {
      return (
        <img
          src={adminLogo}
          alt="Admin Logo"
          className={isMobile ? "w-20 h-20 object-contain" : "w-20 h-20 object-contain"}
          onError={(e) => {
            console.error('❌ Failed to load admin logo from backend, using asset logo');
            // If backend logo fails to load, show asset logo instead
            e.target.style.display = 'none';
            // The parent component will show the asset logo as fallback
          }}
        />
      );
    }

    // Fallback to your original asset logo when no backend logo is available
    return (
      <img
        src={assets.logo}
        alt="Logo"
        className={isMobile ? "w-20 h-auto object-contain" : "w-32 h-auto object-contain"}
      />
    );
  };

  return (
    <>
      {/* Mobile Header with Logo + Settings + Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-brand-cream border-b border-brand-bronze/10 z-50 shadow-sm">
        <div className="flex justify-between items-center px-4">
          {/* Logo links to dashboard */}
          <Link to="/" className="p-1">
            <LogoDisplay isMobile={true} />
          </Link>

          <div className="flex items-center gap-2">
            {/* Settings (Mobile) */}
            <Link to="/settings" className="p-2">
              <FontAwesomeIcon
                icon={faCog}
                className="text-brand-muted hover:text-brand-bronze transition-colors"
              />
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-sm hover:bg-brand-bronze/5 transition-colors"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon
                icon={isMenuOpen ? faTimes : faBars}
                className="text-brand-ink text-lg"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 bg-brand-cream border-b border-brand-bronze/20 z-40 shadow-xl animate-slideDown">
          <div className="flex flex-col p-4 space-y-1">
            <NavLink
              to="/content-management"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-sm transition-all font-serif text-lg ${isActive
                  ? "bg-brand-ink text-brand-cream"
                  : "text-brand-ink hover:bg-brand-bronze/10"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faLayerGroup} className="w-5" />
              <span>Content Management</span>
            </NavLink>

            <NavLink
              to="/add"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-sm transition-all font-serif text-lg ${isActive
                  ? "bg-brand-ink text-brand-cream"
                  : "text-brand-ink hover:bg-brand-bronze/10"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faPlus} className="w-5" />
              <span>Add Product</span>
            </NavLink>

            <NavLink
              to="/list"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-sm transition-all font-serif text-lg ${isActive
                  ? "bg-brand-ink text-brand-cream"
                  : "text-brand-ink hover:bg-brand-bronze/10"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faList} className="w-5" />
              <span>Product List</span>
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-sm transition-all font-serif text-lg ${isActive
                  ? "bg-brand-ink text-brand-cream"
                  : "text-brand-ink hover:bg-brand-bronze/10"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="w-5" />
              <span>Orders</span>
            </NavLink>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:block w-full bg-brand-cream border-b border-brand-bronze/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between py-2">
            {/* Logo links to dashboard */}
            <div className="flex-shrink-0">
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <LogoDisplay isMobile={false} />
              </Link>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex space-x-6">
              <NavLink
                to="/content-management"
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-1 py-6 transition-all font-serif text-lg relative ${isActive ? "text-brand-ink" : "text-brand-muted hover:text-brand-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FontAwesomeIcon icon={faLayerGroup} className="text-sm opacity-70" />
                    <span>Content Management</span>
                    <span className={`absolute bottom-5 left-0 h-[1.5px] bg-brand-ink transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/add"
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-1 py-6 transition-all font-serif text-lg relative ${isActive ? "text-brand-ink" : "text-brand-muted hover:text-brand-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FontAwesomeIcon icon={faPlus} className="text-sm opacity-70" />
                    <span>Add Product</span>
                    <span className={`absolute bottom-5 left-0 h-[1.5px] bg-brand-ink transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/list"
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-1 py-6 transition-all font-serif text-lg relative ${isActive ? "text-brand-ink" : "text-brand-muted hover:text-brand-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FontAwesomeIcon icon={faList} className="text-sm opacity-70" />
                    <span>Product List</span>
                    <span className={`absolute bottom-5 left-0 h-[1.5px] bg-brand-ink transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `group flex items-center gap-2 px-1 py-6 transition-all font-serif text-lg relative ${isActive ? "text-brand-ink" : "text-brand-muted hover:text-brand-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FontAwesomeIcon icon={faShoppingCart} className="text-sm opacity-70" />
                    <span>Orders</span>
                    <span className={`absolute bottom-5 left-0 h-[1.5px] bg-brand-ink transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </>
                )}
              </NavLink>
            </nav>

            <div className="flex items-center gap-4">
              <Link
                to="/settings"
                className="p-2 text-brand-muted hover:text-brand-bronze transition-colors duration-300"
                title="Settings"
              >
                <FontAwesomeIcon icon={faCog} className="text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding for mobile header */}
      <div className="md:hidden h-14"></div>
    </>
  );
};

export default Navbar;
