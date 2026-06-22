import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ArrowUpRight } from 'lucide-react';

export default function BlogSection() {
    const navigate = useNavigate();
    const { blogs, backendUrl } = useContext(ShopContext);

    return (
        <section className="py-12 md:py-20 px-4 md:px-6 max-w-[1600px] mx-auto border-t border-brand-ink/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 md:mb-16">
                <div className="max-w-xl">
                    <span className="text-premium-sm text-brand-bronze mb-6 block italic">The Auden Journal</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-brand-ink uppercase leading-none tracking-tight">
                        Design <span className="font-serif-italic">Diaries</span>
                    </h2>
                </div>
                <p className="text-brand-muted max-w-sm font-light leading-relaxed">
                    Exploring the intersections of architecture, philosophy, and the intentional home.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
                {(blogs || []).slice(0, 3).map((blog, idx) => (
                    <motion.div
                        key={blog._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/blog/${blog.slug || blog._id}`)}
                    >
                        <div className="aspect-[16/10] overflow-hidden mb-8 relative">
                            <img
                                src={(blog.imageUrl || '').startsWith('http') ? blog.imageUrl : `${backendUrl}/${blog.imageUrl}`}
                                alt={blog.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-6 left-6 sm:block hidden">
                                <span className="px-4 py-2 bg-brand-cream/90 backdrop-blur-sm text-[11px] uppercase tracking-[0.2em] font-black text-brand-ink">
                                    {Array.isArray(blog.category) ? blog.category[0] : blog.category}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <span className="text-premium-xs text-brand-bronze lowercase">{new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            <h3 className="text-base md:text-xl font-serif text-brand-ink group-hover:text-brand-bronze transition-colors duration-500 flex justify-between items-start gap-2 uppercase tracking-tight">
                                {blog.title}
                                <ArrowUpRight size={20} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            {/* <p className="text-brand-muted text-xs md:text-sm font-light leading-relaxed line-clamp-2">
                                {blog.excerpt}
                            </p> */}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-20 flex justify-center">
                <button
                    onClick={() => navigate('/journal')}
                    className="group flex items-center gap-6 text-premium-sm luxury-underline pb-2"
                >
                    View All Journal Stories
                    <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
                </button>
            </div>
            {blogs.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-brand-muted uppercase tracking-widest text-[11px] font-black">No stories found in the journal yet.</p>
                </div>
            )}
        </section>
    );
}
