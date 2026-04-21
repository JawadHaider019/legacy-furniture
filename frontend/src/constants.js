export const CATEGORIES = [
    {
        id: 'living',
        name: 'Living Room',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
        description: 'Elevate your gathering space with timeless comfort.'
    },
    {
        id: 'dining',
        name: 'Dining',
        image: 'https://images.unsplash.com/photo-1617806118233-f8e137453f9c?auto=format&fit=crop&q=80&w=800',
        description: 'Shared moments deserve a refined setting.'
    },
    {
        id: 'bedroom',
        name: 'Bedroom',
        image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=800',
        description: 'Your sanctuary, redefined with sculptural elegance.'
    }
];

export const PRODUCTS = [
    {
        id: 'n-001',
        name: 'Maci 1-Drawer Accent Table Nightstand',
        brand: 'Safavieh',
        price: 199.22,
        originalPrice: 305.00, // MSRP
        category: 'bedroom',
        subCategory: 'Bedroom Furniture / Nightstands',
        image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1620626011761-9963d7521476?auto=format&fit=crop&q=80&w=800'
        ],
        description: "This Nightstand is ideal for today's decor smart bedrooms with its classic silhouette and contemporary chic style. The bold finish on its acacia wood frame beautifully highlights the gold pull on its drawer, while a bottom shelf provides ample space for books, magazines, or accessories.",
        isNew: true,
        variants: [
            {
                id: 'color',
                name: 'Color',
                type: 'color',
                options: [
                    { value: 'Navy', priceOverride: 199.22, msrpOverride: 305.00 },
                    { value: 'Antique White', priceOverride: 215.50, msrpOverride: 320.00 },
                    { value: 'Turquoise', priceOverride: 185.99, msrpOverride: 290.00 },
                    { value: 'Grey', priceOverride: 199.22, msrpOverride: 305.00 },
                    { value: 'Black', priceOverride: 210.00, msrpOverride: 315.00 }
                ]
            }
        ],
        specs: {
            dimensions: '21.0 In. W X 26.0 In. H X 17.0 In. D',
            weight: '28 lbs',
            assembly: false,
            sku: '44096724',
            warranty: '1 Year Limited',
            material: 'Acacia Wood',
            modelNumber: 'E1029TSN',
            origin: 'Vietnam'
        },
        rating: 4.56,
        reviewsCount: 32,
        reviews: [
            {
                id: 'r1',
                author: 'MaryP',
                rating: 1,
                date: '1 month ago',
                content: 'Very rough. Seems like the top coat is missing. Using for Living Room side table. Very rough finish. Ragged.',
                isVerified: true,
                productOption: 'Navy'
            },
            {
                id: 'r2',
                author: 'Anonymous',
                rating: 5,
                date: 'Sept 25, 2024',
                content: 'EXCELLENT PURCHASE. This exceeded my expectations. First, it was packaged so well. It is heavy, looks high quality, and arrived assembled!',
                isVerified: true,
                productOption: 'Antique White'
            }
        ]
    },
    {
        id: 's-001',
        name: 'Sylvan Lounge Chair',
        brand: 'Auden Atelier',
        price: 1850,
        originalPrice: 2400,
        category: 'living',
        subCategory: 'Living Room / Seating / Lounge Chairs',
        image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1581418010544-48286f56822c?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'A sculptural lounge chair that anchors any room with silent confidence. Crafted from solid charred oak and upholstered in premium wool boucle, the Sylvan Lounge Chair is a dialogue between material honesty and modern form.',
        variants: [
            {
                id: 'material',
                name: 'Upholstery',
                type: 'material',
                options: [
                    { value: 'Off-White Bouclé', priceOverride: 1850 },
                    { value: 'Raw Charcoal Linen', priceOverride: 1750 },
                    { value: 'Deep Cognac Leather', priceOverride: 2200 }
                ]
            }
        ],
        specs: {
            dimensions: '32" W × 34" D × 28" H',
            weight: '45 lbs',
            assembly: false,
            sku: 'SLN-CH-2026-BLK',
            warranty: '5 Year Structural',
            material: 'Solid Charred Oak, Premium Wool',
            modelNumber: 'SYL-01',
            origin: 'Denmark'
        },
        rating: 4.9,
        reviewsCount: 12
    },
    {
        id: 't-001',
        name: 'Lune Circular Table',
        brand: 'Minimalist Masters',
        price: 980,
        originalPrice: 1250,
        category: 'dining',
        subCategory: 'Dining Room / Tables / Circular',
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1615064646657-698b98f217bb?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'The Lune Table is a study in geometry and balance. A perfect circular top sits atop a tapered monolithic base, creating an silhouette that feels both grounded and ethereal.',
        variants: [
            {
                id: 'size',
                name: 'Diameter',
                type: 'size',
                options: [
                    { value: '48" (4 Guests)', priceOverride: 980 },
                    { value: '60" (6 Guests)', priceOverride: 1250 },
                    { value: '72" (8 Guests)', priceOverride: 1600 }
                ]
            }
        ],
        specs: {
            dimensions: '48" Diameter × 29.5" H',
            weight: '82 lbs',
            assembly: true,
            sku: 'LNE-DT-48-WHT',
            warranty: '2 Year Limited',
            material: 'Pietra Grey Marble, Steel',
            modelNumber: 'LNE-60',
            origin: 'Italy'
        },
        rating: 4.8,
        reviewsCount: 8
    },
    {
        id: 't-002',
        name: 'Aether Platform Bed',
        brand: 'Auden Atelier',
        price: 3200,
        originalPrice: 4000,
        category: 'bedroom',
        subCategory: 'Bedroom Furniture / Beds',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'],
        description: 'The Aether Platform Bed is a masterpiece of minimalist engineering. Floating above the floor, it offers unparalleled serenity and structural grace.',
        rating: 4.95,
        reviewsCount: 15
    },
    {
        id: 'l-001',
        name: 'Orbital Wall Sconce',
        brand: 'Lumen Lux',
        price: 450,
        originalPrice: 600,
        category: 'lighting',
        subCategory: 'Lighting / Wall Sconces',
        image: 'https://images.unsplash.com/photo-1513506191703-327bd47272bf?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1513506191703-327bd47272bf?auto=format&fit=crop&q=80&w=800'],
        description: 'A atmospheric light source that projects soft, indirect glow, mimicking the phases of the moon.',
        rating: 4.7,
        reviewsCount: 22
    }
];

export const BLOGS = [
    {
        id: 'b-001',
        title: 'The Art of Contemplative Living',
        excerpt: 'How to design spaces that allow for silence, reflection, and intentionality in a fast-paced world.',
        content: 'Long form content about contemplative living... Design is more than aesthetic; it is an orientation towards the soul. In this piece, we explore how minimizing visual noise can maximize internal peace.',
        image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200',
        date: 'April 10, 2026',
        category: 'Philosophy',
        author: 'Elias Thorne'
    },
    {
        id: 'b-002',
        title: 'Material Honesty: Why We Use Charred Oak',
        excerpt: 'Exploring the ancient techniques of Shousugi Ban and its place in modern architectural interiors.',
        content: 'Exploring the ancient techniques of Shousugi Ban... The carbonized layer is not just a protection, but a testimony to endurance through fire.',
        image: 'https://images.unsplash.com/photo-1581418010544-48286f56822c?auto=format&fit=crop&q=80&w=1200',
        date: 'March 28, 2026',
        category: 'Craftsmanship',
        author: 'Sarah Jenkins'
    },
    {
        id: 'b-003',
        title: 'Sculptural Lighting for Small Sanctuaries',
        excerpt: 'Maximize the emotional resonance of compact spaces with strategic point-source lighting.',
        content: 'Maximize the emotional resonance... Lighting should not fill a room; it should highlight the shadows that define it.',
        image: 'https://images.unsplash.com/photo-1513506191703-327bd47272bf?auto=format&fit=crop&q=80&w=1200',
        date: 'March 15, 2026',
        category: 'Interior Design',
        author: 'Liam Vance'
    }
];
