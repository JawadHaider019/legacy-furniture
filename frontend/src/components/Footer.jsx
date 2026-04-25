import { Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-brand-ink text-brand-cream pt-12 md:pt-20 pb-8 md:pb-12 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-20">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-serif tracking-[0.2em] uppercase mb-8">


                            LEGACY FURNITURE




                            <span className="text-white/30 font-light">&</span> CARPETS
                        </h2>
                        <p className="text-brand-cream/50 font-light text-sm leading-relaxed mb-8">
                            Crafting environments that inspire contemplative living. We believe in the beauty of simplicity and the permanence of quality.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold text-white/40 mb-8">Collection</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li><Link to="/collection/living" className="hover:text-white transition-colors">Living Room</Link></li>
                            <li><Link to="/collection/dining" className="hover:text-white transition-colors">Dining Room</Link></li>
                            <li><Link to="/collection/bedroom" className="hover:text-white transition-colors">Bedroom</Link></li>
                            <li><Link to="/collection/lighting" className="hover:text-white transition-colors">Lighting</Link></li>
                            <li><Link to="/shop" className="hover:text-white transition-colors">All Pieces</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold text-white/40 mb-8">Service</h4>
                        <ul className="space-y-4 text-sm font-light">
                            <li><Link to="/about" className="hover:text-white transition-colors italic">Discover More</Link></li>
                            <li><Link to="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">Trade Program</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold text-white/40 mb-8">Auden Journal</h4>
                        <p className="text-sm font-light text-brand-cream/50 mb-6">
                            Design stories delivered to your inbox.
                        </p>
                        <form className="relative" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm font-light focus:outline-none focus:border-white transition-colors"
                            />
                            <button
                                type="submit"
                                className="absolute right-0 bottom-2 text-[10px] uppercase tracking-widest font-bold"
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] uppercase tracking-widest text-white/30">
                        @{new Date().getFullYear()} LEGACY FURNITURE & CARPETS. All rights reserved.
                    </p>

                </div>
            </div>
        </footer>
    );
}
