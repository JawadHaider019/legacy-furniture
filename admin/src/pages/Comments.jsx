import React from 'react';
import CommentsTab from '../components/ContentManagement/Tabs/CommentsTab.jsx';

const Comments = () => {
    return (
        <div className="w-full">
            <div className="mb-12 text-left">
                <div className="flex items-center justify-start gap-3 mb-3">
                    <div className="h-[1px] w-8 bg-brand-bronze/40"></div>
                    <p className="text-[11px] tracking-[0.4em] text-brand-bronze uppercase font-bold">Information Architecture</p>
                </div>
                <h1 className="text-4xl sm:text-5xl font-serif text-brand-ink tracking-tight">Comments</h1>
                <p className="text-brand-muted mt-4 text-sm sm:text-base font-medium italic">
                    Engage with your community and manage feedback across your platform.
                </p>
            </div>

            <CommentsTab />
        </div>
    );
};

export default Comments;
