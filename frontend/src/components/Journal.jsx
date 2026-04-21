import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Clock, User } from 'lucide-react';

export default function Journal() {
    const { blogs, backendUrl } = useContext(ShopContext);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-brand-cream pb-16">
            {/* HERO */}
            <section className="relative h-[40vh] flex items-center overflow-hidden mb-16">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=2000"
                        alt="Reading Atmosphere"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-brand-ink/40" />
                </div>
                <div className="relative z-10 max-w-[1600px] mx-auto px-6 w-full">
                    <div className="max-w-4xl">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] uppercase tracking-widest font-bold text-brand-bronze mb-4 block italic"
                        >
                            The Journal
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl md:text-7xl font-serif text-white uppercase leading-tight tracking-tight mb-6 md:mb-8"
                        >
                            Design <br />
                            <span className="italic font-light text-brand-cream">Articles.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-base md:text-xl text-brand-cream/80 font-light leading-relaxed font-serif italic max-w-2xl"
                        >
                            Exploring design concepts, architectural details, and modern interiors.
                        </motion.p>
                    </div>
                </div>
            </section>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6">

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-12 md:gap-y-24">
                    {(blogs || []).map((blog, idx) => (
                        <motion.div
                            key={blog._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group cursor-pointer"
                            onClick={() => navigate(`/blog/${blog._id}`)}
                        >
                            <div className="aspect-[16/10] overflow-hidden mb-10 relative">
                                <img
                                    src={(blog.imageUrl || '').startsWith('http') ? blog.imageUrl : `${backendUrl}/${blog.imageUrl}`}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-8 left-8">
                                    <span className="px-5 py-2 bg-brand-cream/90 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] font-black text-brand-ink">
                                        {Array.isArray(blog.category) ? blog.category[0] : blog.category}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold text-brand-bronze">
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} strokeWidth={2} />
                                        <span>{new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={12} strokeWidth={2} />
                                        <span>{blog.author}</span>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-serif text-brand-ink group-hover:text-brand-bronze transition-colors duration-500">
                                    {blog.title}
                                </h3>
                                <p className="text-brand-muted text-lg font-light leading-relaxed line-clamp-3">
                                    {blog.excerpt}
                                </p>
                                <div className="pt-4">
                                    <button className="text-[10px] uppercase tracking-[0.4em] font-black luxury-underline-dark pb-2 inline-flex items-center gap-4">
                                        Read Narrative <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {blogs.length === 0 && (
                    <div className="text-center py-40 border-t border-brand-ink/5 mt-20">
                        <p className="text-brand-muted uppercase tracking-[0.5em] text-[12px] font-black opacity-30 italic">Our archives are currently being curated.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
