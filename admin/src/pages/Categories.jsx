import React from 'react';
import CategoriesTab from '../components/ContentManagement/Tabs/CategoriesTab.jsx';

const Categories = () => {
    return (
        <div className="w-full">
            <div className="mb-12 text-left">
                <div className="flex items-center justify-start gap-3 mb-3">
                    <div className="h-[1px] w-8 bg-brand-bronze/40"></div>
                    <p className="text-[11px] tracking-[0.4em] text-brand-bronze uppercase font-bold">Structure</p>
                </div>
                <h1 className="text-4xl sm:text-5xl font-serif text-brand-ink tracking-tight">Categories</h1>
                <p className="text-brand-muted mt-4 text-sm sm:text-base font-medium italic">
                    Organize your product collections and structure for seamless browsing.
                </p>
            </div>

            <CategoriesTab />
        </div>
    );
};

export default Categories;
