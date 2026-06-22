import { Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

export default function Footer() {
    const { businessDetails } = useContext(ShopContext);
    return (
        <footer className="bg-brand-ink text-brand-cream pt-12 md:pt-20 pb-8 md:pb-12 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-20">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-serif tracking-[0.2em] uppercase mb-8">
                            LEGACY FURNITURE
                            <span className="text-white/30 font-light"> &</span> CARPETS
                        </h2>
                        <p className="text-brand-cream/50 font-light text-sm leading-relaxed mb-8">
                            Crafting environments that inspire contemplative living. We believe in the beauty of simplicity and the permanence of quality.
                        </p>
                        <div className="flex gap-4">
                            {businessDetails?.socialMedia?.instagram && <a href={businessDetails.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram size={20} /></a>}
                            {businessDetails?.socialMedia?.twitter && <a href={businessDetails.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter size={20} /></a>}
                            {businessDetails?.socialMedia?.facebook && <a href={businessDetails.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook size={20} /></a>}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[12px] md:text-sm uppercase tracking-[0.3em] font-bold text-white/40 mb-8">Shop</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li><Link to="/shop/living" className="hover:text-white transition-colors">Living Room</Link></li>
                            <li><Link to="/shop/dining" className="hover:text-white transition-colors">Dining Room</Link></li>
                            <li><Link to="/shop/bedroom" className="hover:text-white transition-colors">Bedroom</Link></li>
                            <li><Link to="/shop/lighting" className="hover:text-white transition-colors">Lighting</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">All Pieces</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[12px] md:text-sm uppercase tracking-[0.3em] font-bold text-white/40 mb-8">Navigation</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/journal" className="hover:text-white transition-colors">Blogs</Link></li>
                            <li><Link to="/orders" className="hover:text-white transition-colors italic">Orders</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[12px] md:text-sm uppercase tracking-[0.3em] font-bold text-white/40 mb-8">Contact Us</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li className="flex items-start gap-3">
                                <span className="text-white/30 text-xs mt-1">✉</span>
                                <a href={`mailto:${businessDetails?.contact?.customerSupport?.email || "legacyfurniture18@gmail.com"}`} className="hover:text-white transition-colors text-brand-cream/70 break-all">
                                    {businessDetails?.contact?.customerSupport?.email || "legacyfurniture18@gmail.com"}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-white/30 text-xs mt-1">☎</span>
                                <a href={`tel:${businessDetails?.contact?.customerSupport?.phone || "+447424757756"}`} className="hover:text-white transition-colors text-brand-cream/70">
                                    {businessDetails?.contact?.customerSupport?.phone || "+44 7424 757756"}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-white/30 text-xs mt-1">📍</span>
                                <span className="text-brand-cream/70">{businessDetails?.location?.displayAddress || "London, United Kingdom"}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-premium-xs text-white/30">
                        &copy;{new Date().getFullYear()} LEGACY FURNITURE &amp; CARPETS. All rights reserved.
                    </p>
                    <p className="text-premium-xs text-white/20">
                        London, United Kingdom
                    </p>
                </div>
            </div>
        </footer>
    );
}
