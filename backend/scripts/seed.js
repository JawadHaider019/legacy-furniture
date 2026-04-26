import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productModel from '../models/productModel.js';
import { Blog } from '../models/blogModel.js';
import Category from '../models/categoryModel.js';
import { Banner } from '../models/bannerModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const categories = [
    {
        name: "Living Room",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
        description: "Elevate your gathering space with timeless comfort and architectural presence.",
        subcategories: [
            { name: "Sofas" },
            { name: "Coffee Tables" },
            { name: "Armchairs" },
            { name: "TV Units" }
        ]
    },
    {
        name: "Dining",
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200",
        description: "Shared moments deserve a refined setting of marble and solid walnut.",
        subcategories: [
            { name: "Dining Tables" },
            { name: "Dining Chairs" },
            { name: "Sideboards" }
        ]
    },
    {
        name: "Bedroom",
        image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=800",
        description: "Your sanctuary, redefined with sculptural elegance and floating forms.",
        subcategories: [
            { name: "Beds" },
            { name: "Bedside Tables" },
            { name: "Wardrobes" },
            { name: "Dressers" }
        ]
    },
    {
        name: "Lighting",
        image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=1200",
        description: "Artisan luminance that projects soft, atmospheric glows reminiscent of moonlight.",
        subcategories: [
            { name: "Pendants" },
            { name: "Floor Lamps" },
            { name: "Table Lamps" }
        ]
    }
];

const products = [
    {
        name: "Minimalist Oak Sofa",
        description: "A solid oak sofa with premium wool upholstery. Designed for timeless comfort and architectural presence. Each piece is handcrafted over 120 hours using traditional joinery techniques.",
        shortDescription: "Solid oak, premium wool upholstery.",
        category: "Living Room",
        subcategory: "Sofas",
        image: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"],
        quantity: 10,
        price: 2400,
        discountprice: 1950,
        cost: 1200,
        status: "public",
        date: Date.now(),
        variants: [
            { name: "Grey Wool", price: 2400, cost: 1200, stock: 5, sku: "SOFA-OAK-GRY", description: "Standard grey wool upholstery.", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"] },
            { name: "Forest Green", price: 2600, cost: 1350, stock: 3, sku: "SOFA-OAK-GRN", description: "Premium forest green velvet finish.", images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200"] },
            { name: "Charcoal Canvas", price: 2200, stock: 2, sku: "SOFA-OAK-CHR", description: "Durable charcoal canvas for high-traffic areas.", images: ["https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&q=80&w=1200"] }
        ],
        dynamicAttributes: [
            { key: "Frame", value: "Solid Oak" },
            { key: "Origin", value: "Handcrafted in UK" }
        ]
    },
    {
        name: "Sculptural Marble Dining Table",
        description: "Pietra Grey marble top supported by a solid walnut pedestal. A study in balance and luxury materials. The marble is sealed with a breathable satin finish to prevent staining while maintaining natural texture.",
        shortDescription: "Grey marble, walnut pedestal.",
        category: "Dining",
        subcategory: "Dining Tables",
        image: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200"],
        quantity: 5,
        price: 3800,
        discountprice: 3200,
        cost: 2000,
        status: "public",
        date: Date.now(),
        variants: [
            { name: "Pietra Grey", price: 3800, cost: 2000, stock: 2, sku: "TBL-MARB-GRY", images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200"] },
            { name: "Carrara White", price: 4200, cost: 2200, stock: 3, sku: "TBL-MARB-WHT", images: ["https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=1200"] }
        ],
        dynamicAttributes: [
            { key: "Top Material", value: "Natural Marble" },
            { key: "Base", value: "Solid Walnut" }
        ]
    },
    {
        name: "Floating Platform Bed",
        description: "Handcrafted from salvaged maple. The floating design creates an ethereal feel in any bedroom sanctuary. Includes integrated slats and hidden storage options.",
        shortDescription: "Salvaged maple, floating design.",
        category: "Bedroom",
        subcategory: "Beds",
        image: ["https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=1200"],
        quantity: 8,
        price: 2900,
        discountprice: 2500,
        cost: 1500,
        status: "public",
        date: Date.now(),
        variants: [
            { name: "Queen", price: 2900, cost: 1500, stock: 4, sku: "BED-MAPL-Q", images: ["https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=1200"] },
            { name: "King", price: 3400, cost: 1800, stock: 4, sku: "BED-MAPL-K", images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200"] }
        ]
    },
    {
        name: "Orbital Brass Pendant",
        description: "Spun brass with a hand-blown glass diffuser. Projects a soft, atmospheric glow reminiscent of moonlight. Includes a adjustable 2m woven cable.",
        shortDescription: "Spun brass, hand-blown glass.",
        category: "Lighting",
        subcategory: "Pendants",
        image: ["https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=1200"],
        quantity: 15,
        price: 850,
        discountprice: 650,
        cost: 300,
        status: "public",
        date: Date.now(),
        variants: [
            { name: "Aged Brass", price: 850, cost: 300, stock: 10, sku: "LGT-ORB-BRS", images: ["https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=1200"] },
            { name: "Matte Black", price: 750, cost: 250, stock: 5, sku: "LGT-ORB-BLK", images: ["https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=1200"] }
        ]
    }
];

const blogs = [
    {
        title: "The Architecture of Silence",
        content: "Designing for silence is not about the absence of noise, but the presence of peace. In the modern world, our homes are our final sanctuaries.",
        excerpt: "How to design spaces that allow for silence and reflection in a fast-paced world.",
        category: ["Philosophy"],
        imageUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200",
        author: "Elias Thorne",
        status: "published"
    },
    {
        title: "Material Honesty: Charred Oak",
        content: "Shousugi Ban is an ancient technique that makes wood more durable and incredibly beautiful. The carbonized layer tells a story of survival.",
        excerpt: "Exploring the ancient techniques of Shousugi Ban and its place in modern architectural interiors.",
        category: ["Craftsmanship"],
        imageUrl: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=1200",
        author: "Sarah Jenkins",
        status: "published"
    },
    {
        title: "The Curation of Light",
        content: "Lighting should not fill a room; it should highlight the shadows that define it. Strategic lighting changes how we feel in a space.",
        excerpt: "Maximize the emotional resonance of your home with strategic point-source lighting.",
        category: ["Design"],
        imageUrl: "https://images.unsplash.com/photo-1542728928-1413d1894ed1?auto=format&fit=crop&q=80&w=1200",
        author: "Liam Vance",
        status: "published"
    },
    {
        title: "Living with Intent",
        content: "Minimalism is not about having less; it's about making weight for what matters. Every piece in your home should have a purpose or bring joy.",
        excerpt: "Designing a life of intentionality starting with the artifacts we surround ourselves with.",
        category: ["Lifestyle"],
        imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200",
        author: "Maya Lin",
        status: "published"
    }
];

const banners = [
    {
        headingLine1: "Database Loaded",
        headingLine2: "Primary Banner",
        subtext: "If you see this, the banners are successfully loading from the MongoDB database for the hero section.",
        buttonText: "Explore Collection",
        redirectUrl: "/shop",
        imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000",
        section: 1,
        order: 0,
        isActive: true
    },
    {
        headingLine1: "Sequential Slide",
        headingLine2: "Database Entry 2",
        subtext: "This is the second slide coming from your admin panel settings. Verify movement here.",
        buttonText: "View New Arrivals",
        redirectUrl: "/shop",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000",
        section: 1,
        order: 1,
        isActive: true
    },
    {
        headingLine1: "Minimalist",
        headingLine2: "Sanctuaries",
        subtext: "Elevate your sanctuary with sculptural elegance and floating forms handcrafted from salvaged maple.",
        buttonText: "Bedroom Collection",
        redirectUrl: "/shop",
        imageUrl: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=2000",
        section: 2,
        order: 0,
        isActive: true
    }
];

const seed = async () => {
    try {
        console.log("🔗 Connecting to database...");
        await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
        console.log("✅ Connected.");

        console.log("🧹 Cleaning old data...");
        await Category.deleteMany({});
        await productModel.deleteMany({});
        await Blog.deleteMany({});
        await Banner.deleteMany({});

        console.log("📁 Seeding 4 categories...");
        await Category.insertMany(categories);
        console.log("✅ Categories seeded.");

        console.log("📦 Seeding 4 products...");
        await productModel.insertMany(products);
        console.log("✅ Products seeded.");

        console.log("📝 Seeding 4 blogs...");
        await Blog.insertMany(blogs);
        console.log("✅ Blogs seeded.");

        console.log("🖼️ Seeding 3 banners...");
        await Banner.insertMany(banners);
        console.log("✅ Banners seeded.");

        console.log("✨ Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`- Field '${key}': ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

seed();
