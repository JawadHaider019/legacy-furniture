import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ArrowLeft, Clock, User, Share2 } from 'lucide-react';

export default function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { blogs, backendUrl, loading } = useContext(ShopContext);

    const blog = blogs.find(b => b._id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-cream flex items-center justify-center">
                <p className="text-[10px] uppercase tracking-[0.5em] font-black animate-pulse">Loading Story...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center gap-8">
                <p className="text-[10px] uppercase tracking-[0.5em] font-black">Story not found.</p>
                <button onClick={() => navigate('/')} className="px-10 py-4 bg-brand-ink text-white text-[10px] uppercase tracking-widest font-black">Back Home</button>
            </div>
        );
    }

    const blogImage = (blog.imageUrl || '').startsWith('http') ? blog.imageUrl : `${backendUrl}/${blog.imageUrl}`;

    return (
        <div className="min-h-screen bg-brand-cream">
            {/* HERO SECTION */}
            <section className="relative h-[60vh] min-h-[400px] flex items-end pb-16 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={blogImage}
                        alt={blog.title}
                        className="w-full h-full object-cover grayscale brightness-[0.4]"
                        referrerPolicy="no-referrer"
                    />
                </div>

                <div className="max-w-[1600px] mx-auto w-full relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] uppercase tracking-widest font-bold italic">Return to Journal</span>
                    </button>

                    <div className="max-w-4xl">
                        <span className="px-5 py-2 bg-brand-bronze text-white text-[10px] uppercase tracking-widest font-bold mb-6 inline-block">
                            {Array.isArray(blog.category) ? blog.category[0] : blog.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif text-white uppercase leading-tight tracking-tight mb-8">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-12 border-t border-white/10 pt-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.author || 'Author'}`} alt={blog.author} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <span className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">Written by</span>
                                    <span className="text-[11px] uppercase tracking-widest text-white font-black">{blog.author || 'Legacy Furniture Team'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-10">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-brand-bronze" />
                                    <span className="text-[11px] uppercase tracking-widest text-white/60 font-black">
                                        {new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-white/40 hover:text-white transition-colors cursor-pointer">
                                    <Share2 size={16} />
                                    <span className="text-[11px] uppercase tracking-widest font-black">Share Story</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <article className="py-16 px-6 max-w-4xl mx-auto">
                <div className="prose prose-stone lg:prose-lg max-w-none">
                    <p className="text-xl font-serif italic text-brand-ink leading-relaxed mb-8 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:mt-1">
                        {blog.excerpt}
                    </p>
                    <div className="text-brand-muted font-light leading-loose space-y-8 text-base">
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                        <p>
                            In the quiet corners of the home, we find the echoes of our own character. Architecture is the skeleton, but the artifacts we choose are the soul. At Legacy Furniture, we prioritize material honesty—allowing wood to remain wood, and stone to feel cold and heavy.
                        </p>
                        <div className="my-16 p-8 bg-brand-ink text-brand-cream relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="text-3xl font-serif italic mb-4">"Design is the silent ambassador of your values."</h4>
                            </div>
                            <div className="absolute top-[-10%] right-[-10%] opacity-5 rotate-12 scale-150">
                                <img src={blogImage} className="w-96 grayscale" alt="decoration" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RELATED FOOTER */}
                <div className="mt-24 pt-16 border-t border-brand-ink/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div>
                        <h4 className="text-2xl font-serif uppercase mb-2">Continue Reading</h4>
                        <p className="text-brand-muted text-sm font-light">Explore more from the Auden Journal.</p>
                    </div>
                    <button
                        onClick={() => navigate('/shop')}
                        className="px-12 py-5 bg-brand-ink text-white uppercase text-[10px] tracking-[0.3em] font-black hover:bg-black transition-all"
                    >
                        Explore Collection
                    </button>
                </div>
            </article>
        </div>
    );
}
