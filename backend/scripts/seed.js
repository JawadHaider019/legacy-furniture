import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productModel from '../models/productModel.js';
import { Blog } from '../models/blogModel.js';
import Category from '../models/categoryModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const categories = [
    {
        name: "Living Room",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
        description: "Elevate your gathering space with timeless comfort and architectural presence."
    },
    {
        name: "Dining",
        image: "https://images.unsplash.com/photo-1617806118233-f8e137453f9c?auto=format&fit=crop&q=80&w=800",
        description: "Shared moments deserve a refined setting of marble and solid walnut."
    },
    {
        name: "Bedroom",
        image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=800",
        description: "Your sanctuary, redefined with sculptural elegance and floating forms."
    },
    {
        name: "Lighting",
        image: "https://images.unsplash.com/photo-1513506191703-327bd47272bf?auto=format&fit=crop&q=80&w=800",
        description: "Artisan luminance that projects soft, atmospheric glows reminiscent of moonlight."
    }
];

const products = [
    {
        name: "Minimalist Oak Sofa",
        description: "A solid oak sofa with premium wool upholstery. Designed for timeless comfort and architectural presence.",
        shortDescription: "Solid oak, premium wool upholstery.",
        category: "living",
        subcategory: "Living Room / Seating / Sofas",
        image: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200"],
        quantity: 10,
        price: 2400,
        discountprice: 1950,
        cost: 1200,
        status: "published",
        date: Date.now()
    },
    {
        name: "Sculptural Marble Dining Table",
        description: "Pietra Grey marble top supported by a solid walnut pedestal. A study in balance and luxury materials.",
        shortDescription: "Grey marble, walnut pedestal.",
        category: "dining",
        subcategory: "Dining Room / Tables",
        image: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200"],
        quantity: 5,
        price: 3800,
        discountprice: 3200,
        cost: 2000,
        status: "published",
        date: Date.now()
    },
    {
        name: "Floating Platform Bed",
        description: "Handcrafted from salvaged maple. The floating design creates an ethereal feel in any bedroom sanctuary.",
        shortDescription: "Salvaged maple, floating design.",
        category: "bedroom",
        subcategory: "Bedroom Furniture / Beds",
        image: ["https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&q=80&w=1200"],
        quantity: 8,
        price: 2900,
        discountprice: 2500,
        cost: 1500,
        status: "published",
        date: Date.now()
    },
    {
        name: "Orbital Brass Pendant",
        description: "Spun brass with a hand-blown glass diffuser. Projects a soft, atmospheric glow reminiscent of moonlight.",
        shortDescription: "Spun brass, hand-blown glass.",
        category: "lighting",
        subcategory: "Lighting / Pendants",
        image: ["https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=1200"],
        quantity: 15,
        price: 850,
        discountprice: 650,
        cost: 300,
        status: "published",
        date: Date.now()
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

const seed = async () => {
    try {
        console.log("🔗 Connecting to database...");
        await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
        console.log("✅ Connected.");

        console.log("🧹 Cleaning old data...");
        await Category.deleteMany({});
        await productModel.deleteMany({});
        await Blog.deleteMany({});

        console.log("📁 Seeding 4 categories...");
        await Category.insertMany(categories);
        console.log("✅ Categories seeded.");

        console.log("📦 Seeding 4 products...");
        await productModel.insertMany(products);
        console.log("✅ Products seeded.");

        console.log("📝 Seeding 4 blogs...");
        await Blog.insertMany(blogs);
        console.log("✅ Blogs seeded.");

        console.log("✨ Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seed();
