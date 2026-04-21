import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success('Your message has been sent to the atelier.', {
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

        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-brand-cream pb-24">
            {/* HERO */}
            <section className="relative h-[40vh] flex items-center overflow-hidden mb-16 text-white">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000"
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
                        className="text-2xl md:text-6xl font-serif uppercase tracking-tight leading-[0.85] mb-6"
                    >
                        Contact  <span className="italic font-light text-brand-bronze">Us.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-base md:text-xl text-brand-cream/80 font-light italic font-serif"
                    >
                        Get in touch with our team for any inquiries or support.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">

                {/* CONTACT INFO */}
                <div className="lg:col-span-5 space-y-16">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-serif text-brand-ink uppercase tracking-tight mb-8 md:mb-12">Global <span className="italic">Presence</span></h2>

                        <div className="space-y-12">
                            {[
                                {
                                    icon: MapPin,
                                    title: "London Atelier",
                                    details: ["14 Savile Row, Mayfair", "London W1S 3JN, UK"],
                                    link: "View on Map"
                                },
                                {
                                    icon: MapPin,
                                    title: "Milan Studio",
                                    details: ["Via Montenapoleone, 27", "20121 Milano MI, Italy"],
                                    link: "View on Map"
                                }
                            ].map((loc, i) => (
                                <motion.div
                                    key={loc.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-8 group"
                                >
                                    <div className="w-12 h-12 bg-brand-ink text-brand-cream flex items-center justify-center shrink-0 group-hover:bg-brand-bronze transition-colors">
                                        <loc.icon size={20} strokeWidth={1} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-ink mb-3">{loc.title}</h4>
                                        {loc.details.map(line => (
                                            <p key={line} className="text-sm font-light text-brand-muted opacity-80 leading-relaxed">{line}</p>
                                        ))}
                                        <button className="mt-4 text-[9px] uppercase tracking-widest font-black luxury-underline inline-block">{loc.link}</button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-16 border-t border-brand-ink/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Mail size={16} className="text-brand-bronze" />
                                    <h5 className="text-[10px] uppercase tracking-widest font-black">Digital Inquiries</h5>
                                </div>
                                <p className="text-sm font-serif italic text-brand-ink">concierge@auden.com</p>
                                <p className="text-sm font-serif italic text-brand-ink">press@auden.com</p>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Phone size={16} className="text-brand-bronze" />
                                    <h5 className="text-[10px] uppercase tracking-widest font-black">Direct Line</h5>
                                </div>
                                <p className="text-sm font-serif italic text-brand-ink">+44 20 7946 0000</p>
                                <p className="text-sm font-serif italic text-brand-ink">+39 02 1234 5678</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-brand-ink text-brand-cream space-y-6">
                        <div className="flex items-center gap-4 text-brand-bronze">
                            <Clock size={20} />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black">Atelier Hours</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Mon — Fri</p>
                                <p className="text-lg font-serif italic">09:00 — 18:00</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest opacity-40 mb-1">Sat — Sun</p>
                                <p className="text-lg font-serif italic">10:00 — 16:00</p>
                            </div>
                        </div>
                        <p className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-30 mt-4 leading-relaxed">
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
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-bronze italic">All fields are required</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Full Name</label>
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
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-brand-cream/50 border border-brand-ink/5 px-4 py-3 text-sm tracking-wide outline-none focus:border-brand-bronze/40 focus:bg-white transition-all font-sans"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Subject</label>
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
                                <label className="text-[9px] uppercase tracking-widest font-bold text-brand-ink/60 ml-1">Message</label>
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
                            <div className="flex gap-4">
                                <MessageCircle size={14} className="text-brand-bronze opacity-40" />
                                <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-brand-ink/30">Average Response: 2 — 4 Hours</span>
                            </div>
                            <span className="h-[1px] flex-1 bg-brand-ink/5" />
                        </div>
                    </div>

                    {/* Interactive Map Placeholder */}
                    <div className="mt-20 aspect-video bg-white overflow-hidden shadow-sm grayscale hover:grayscale-0 transition-all duration-1000 group cursor-crosshair">
                        <img
                            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1600"
                            alt="Atelier Interior"
                            className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="px-8 py-4 bg-brand-ink text-brand-cream text-[10px] uppercase tracking-[0.5em] font-black backdrop-blur-md bg-opacity-80">
                                Global Studios
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
