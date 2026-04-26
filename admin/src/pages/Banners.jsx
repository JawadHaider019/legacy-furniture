import React, { useState } from 'react';
import { BannerManager } from '../components/ContentManagement/Tabs/BannerTab.jsx';

const Banners = () => {
    const [activeTab, setActiveTab] = useState('hero');

    return (
        <div className="w-full">
            <div className="mb-8 text-left">
                <div className="flex items-center justify-start gap-3 mb-3">
                    <div className="h-[1px] w-8 bg-brand-bronze/40"></div>
                    <p className="text-[11px] tracking-[0.4em] text-brand-bronze uppercase font-bold">Visual Curation</p>
                </div>
                <h1 className="text-4xl sm:text-5xl font-serif text-brand-ink tracking-tight">Banners</h1>
                <p className="text-brand-muted mt-4 text-sm sm:text-base font-medium italic">
                    Manage the cinematic hero carousels that define the first impression of your showroom.
                </p>
            </div>




            <BannerManager section={1} key="hero-manager" />

        </div>
    );
};

export default Banners;
