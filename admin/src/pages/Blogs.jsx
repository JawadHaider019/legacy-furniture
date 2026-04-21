import React, { useState } from 'react';
import BlogsTab from '../components/ContentManagement/Tabs/BlogsTab.jsx';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    return (
        <div className="w-full">
            <div className="mb-12 text-left">
                <div className="flex items-center justify-start gap-3 mb-3">
                    <div className="h-[1px] w-8 bg-brand-bronze/40"></div>
                    <p className="text-[10px] tracking-[0.4em] text-brand-bronze uppercase font-bold">Information Architecture</p>
                </div>
                <h1 className="text-4xl sm:text-5xl font-serif text-brand-ink tracking-tight">Blogs</h1>
                <p className="text-brand-muted mt-4 text-sm sm:text-base font-medium italic">
                    Share your brand's story and interior design insights with your audience.
                </p>
            </div>

            <BlogsTab blogs={blogs} setBlogs={setBlogs} />
        </div>
    );
};

export default Blogs;
