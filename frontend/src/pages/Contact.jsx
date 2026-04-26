import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Contact() {
    const { businessDetails, backendUrl } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.subject) {
            toast.error('Please select a subject');
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${backendUrl}/api/contact`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message
            });

            if (response.data.success) {
                toast.success('Your message has been sent to our desk.', {
                    style: {
                        background: '#1A1A1A',
                        color: '#F4F1ED',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        borderRadius: '0px',
                        border: '1px solid rgba(244, 241, 237, 0.1)',
                    }
                });
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                toast.error(response.data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Contact submission error:', error);
            toast.error('Could not send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream pb-24">
            {/* HERO */}
            <section className="relative h-[40vh] md:h-[50vh] text-center md:text-left flex items-center overflow-hidden mb-16 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/contact-hero.jpg"
                        alt="Atelier Entrance"
                        className="w-full h-full object-cover grayscale brightness-50"
                    />
                    <div className="absolute inset-0 bg-brand-ink/40" />
                </div>
                <div className="relative z-10 max-w-[1600px] mx-auto px-6 w-full mt-10 text-center md:text-left">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-5xl md:text-7xl font-serif text-white uppercase leading-tight tracking-tight "
                    >
                        Contact  <span className="italic font-light text-brand-bronze">Us.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-base md:text-2xl text-brand-cream/90 font-light leading-relaxed font-serif italic"
                    >
                        "Get in touch with our team for any inquiries or support."
                    </motion.p>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">

                {/* CONTACT INFO */}
                <div className="lg:col-span-5 space-y-16">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif text-brand-ink uppercase tracking-tight mb-8 md:mb-12">Global <span className="italic">Presence</span></h2>

                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="flex gap-8 group"
                            >
                                <div className="w-12 h-12 bg-brand-ink text-brand-cream flex items-center justify-center shrink-0 group-hover:bg-brand-bronze transition-colors">
                                    <MapPin size={20} strokeWidth={1} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-brand-ink mb-3">Headquarters</h4>
                                    <p className="text-sm font-light text-brand-muted opacity-80 leading-relaxed max-w-[250px]">
                                        {businessDetails?.location?.displayAddress || "14 Savile Row, Mayfair, London W1S 3JN, UK"}
                                    </p>

                                </div>

                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="flex gap-8 group"
                            >
                                <div className="w-12 h-12 bg-brand-ink text-brand-cream flex items-center justify-center shrink-0 group-hover:bg-brand-bronze transition-colors">
                                    <Mail size={20} strokeWidth={1} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-brand-ink mb-3">Email</h4>
                                    <p className="text-sm font-light text-brand-muted opacity-80 leading-relaxed max-w-[250px]">
                                        {businessDetails?.contact?.customerSupport?.email || "legacyfurniture18@gmail.com"}
                                    </p>

                                </div>

                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="flex gap-8 group"
                            >
                                <div className="w-12 h-12 bg-brand-ink text-brand-cream flex items-center justify-center shrink-0 group-hover:bg-brand-bronze transition-colors">
                                    <Phone size={20} strokeWidth={1} />
                                </div>
                                <div>
                                    <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-brand-ink mb-3">Headquarters</h4>
                                    <p className="text-sm font-light text-brand-muted opacity-80 leading-relaxed max-w-[250px]">
                                        {businessDetails?.contact?.customerSupport?.phone || "+447424757756"}
                                    </p>

                                </div>

                            </motion.div>

                            {businessDetails?.multiStore?.enabled && businessDetails.multiStore.stores.filter(s => s.status === 'active').map((store, i) => (
                                <motion.div
                                    key={store.storeName}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (i + 1) * 0.1 }}
                                    className="flex gap-8 group"
                                >
                                    <div className="w-12 h-12 border border-brand-ink/10 text-brand-ink flex items-center justify-center shrink-0 group-hover:bg-brand-ink group-hover:text-brand-cream transition-all">
                                        <MapPin size={20} strokeWidth={1} />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-brand-ink mb-3">{store.storeName}</h4>
                                        <p className="text-sm font-light text-brand-muted opacity-80 leading-relaxed max-w-[250px]">
                                            {store.location?.address?.street}, {store.location?.address?.city}
                                        </p>
                                        {store.location?.googleMapsLink && (
                                            <a
                                                href={store.location.googleMapsLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 text-[11px] uppercase tracking-widest font-black luxury-underline inline-block"
                                            >
                                                Visit Store
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>



                    <div className="p-10 bg-brand-ink text-brand-cream space-y-6">
                        <div className="flex items-center gap-4 text-brand-bronze">
                            <Clock size={20} />
                            <span className="text-[11px] uppercase tracking-[0.3em] font-black">Atelier Hours</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <p className="text-[11px] uppercase tracking-widest opacity-40 mb-1">Standard Support Hours</p>
                                <p className="text-lg font-serif italic">{businessDetails?.contact?.customerSupport?.hours || "Mon — Fri, 09:00 — 18:00"}</p>
                            </div>
                        </div>
                        <p className="text-[11px] uppercase tracking-[0.2em] font-bold opacity-30 mt-4 leading-relaxed">
                            Private consultations available by appointment only.
                        </p>
                    </div>
                </div>

                {/* CONTACT FORM */}
                <div className="lg:col-span-7">
                    <div className="bg-white p-10 md:p-16 shadow-2xl relative overflow-hidden group">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-bronze/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-bronze/10 transition-colors duration-1000" />

                        <div className="relative z-10 mb-10">
                            <h3 className="text-2xl font-serif text-brand-ink uppercase tracking-tight mb-3">Send a <span className="italic">Message</span></h3>
                            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-bronze italic">All fields are required</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-brand-cream/50 border border-brand-ink/5 px-4 py-3 text-sm tracking-wide outline-none focus:border-brand-bronze/40 focus:bg-white transition-all font-sans"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-brand-cream/50 border border-brand-ink/5 px-4 py-3 text-sm tracking-wide outline-none focus:border-brand-bronze/40 focus:bg-white transition-all font-sans"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-brand-cream/50 border border-brand-ink/5 px-4 py-3 text-sm tracking-wide outline-none focus:border-brand-bronze/40 focus:bg-white transition-all font-sans"
                                        placeholder="+44 20 7424 7577"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Subject</label>
                                <select
                                    className="w-full bg-brand-cream/50 border border-brand-ink/5 px-4 py-3 text-sm tracking-wide outline-none focus:border-brand-bronze/40 focus:bg-white transition-all appearance-none font-sans"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option value="">Select Subject</option>
                                    <option value="support">Customer Support</option>
                                    <option value="shipping">Shipping & Delivery</option>
                                    <option value="returns">Returns</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-brand-cream/50 border border-brand-ink/5 px-4 py-3 text-sm tracking-wide outline-none focus:border-brand-bronze/40 focus:bg-white transition-all resize-none font-sans"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="w-full py-4 bg-brand-ink text-brand-cream uppercase text-[12px] tracking-widest font-bold hover:bg-black transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                <Send size={16} className={`transition-transform duration-500 ${isSubmitting ? 'translate-x-20 opacity-0' : 'group-hover:translate-x-1'}`} />
                            </button>
                        </form>

                        <div className="mt-12 flex items-center gap-6 justify-center">
                            <span className="h-[1px] flex-1 bg-brand-ink/5" />
                            <div className="flex gap-6">
                                {businessDetails?.socialMedia?.instagram && (
                                    <a href={businessDetails.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-brand-ink hover:text-brand-bronze transition-colors">
                                        <Instagram size={18} strokeWidth={1.5} />
                                    </a>
                                )}
                                {businessDetails?.socialMedia?.facebook && (
                                    <a href={businessDetails.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-brand-ink hover:text-brand-bronze transition-colors">
                                        <Facebook size={18} strokeWidth={1.5} />
                                    </a>
                                )}
                                {businessDetails?.socialMedia?.twitter && (
                                    <a href={businessDetails.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-brand-ink hover:text-brand-bronze transition-colors">
                                        <Twitter size={18} strokeWidth={1.5} />
                                    </a>
                                )}
                            </div>
                            <span className="h-[1px] flex-1 bg-brand-ink/5" />
                        </div>
                    </div>

                    {businessDetails?.location?.googleMapsLink && (
                        <div className="mt-20 aspect-video bg-white overflow-hidden shadow-sm shadow-brand-ink/5 border border-brand-ink/5 group relative">
                            <iframe
                                title="Studio Location"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src={`${businessDetails.location.googleMapsLink.replace('maps/place', 'maps/embed')}`}
                                className="grayscale hover:grayscale-0 transition-all duration-1000"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
