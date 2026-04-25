import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productModel from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedComplexProduct = async () => {
    try {
        console.log("🔗 Connecting to database...");
        await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
        console.log("✅ Connected.");

        // 1. Ensure Category Exists
        let category = await Category.findOne({ name: "Living Room" });
        if (!category) {
            category = new Category({
                name: "Living Room",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
                description: "Elevate your gathering space with timeless comfort and architectural presence.",
                subcategories: [{ name: "Living Room / Seating / Sofas" }]
            });
            await category.save();
            console.log("📁 Category 'Living Room' created.");
        }

        const subcategory = "Living Room / Seating / Sofas";

        // 2. Define Complex Product
        const complexProductData = {
            name: "Arlow Modular Sofa System",
            shortDescription: "Precision-engineered modular seating wrapped in exclusive Italian textiles.",
            description: "A pinnacle of modular design, the Arlow system adapts to your spatial narrative. Crafted with precision-engineered inner frames and wrapped in exclusive Italian textiles, it represents the intersection of structural integrity and aesthetic softness.",
            category: category.name, // The model uses String with ref
            subcategory: subcategory,
            price: 3200,
            discountprice: 2950,
            cost: 1500,
            quantity: 50,
            image: [
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200",
                "https://images.unsplash.com/photo-1550254478-ead40cc54513?auto=format&fit=crop&q=80&w=1200"
            ],
            status: "published",
            visibility: "public",
            featuredProduct: true,
            bestseller: true,
            date: Date.now(),
            variants: [
                {
                    name: "Nordic Grey (Wool)",
                    price: 3200,
                    stock: 20,
                    sku: "ARLOW-MOD-GRY",
                    description: "Hand-woven wool blend in Nordic Grey. Sustainable birch feet and high-resilience foam core.",
                    images: [
                        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1200",
                        "https://images.unsplash.com/photo-1484101403033-57105d2b77ca?auto=format&fit=crop&q=80&w=1200",
                        "https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=1200"
                    ]
                },
                {
                    name: "Cognac (Full-Grain Leather)",
                    price: 4500,
                    stock: 10,
                    sku: "ARLOW-MOD-COG",
                    description: "Full-grain aniline leather in Cognac. Polished brass accents and deep-seated comfort that develops a beautiful patina over time.",
                    images: [
                        "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=1200",
                        "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&q=80&w=1200"
                    ]
                },
                {
                    name: "Midnight (Performance Velvet)",
                    price: 3800,
                    stock: 15,
                    sku: "ARLOW-MOD-MID",
                    description: "High-density performance velvet in Midnight Blue. Blackened steel base for a contemporary silhouette and soft-touch finish.",
                    images: [
                        "https://images.unsplash.com/photo-1549187771-b4e9b0445b41?auto=format&fit=crop&q=80&w=1200",
                        "https://images.unsplash.com/photo-1519961655809-34fa156820ff?auto=format&fit=crop&q=80&w=1200"
                    ]
                }
            ],
            specs: {
                dimensions: "W: 320cm x D: 105cm x H: 72cm",
                material: "Sustainable Birch / Italian Textile",
                assembly: "Professional Installation Included",
                warranty: "10 Year Structural Warranty"
            }
        };

        // 3. Save Product
        const product = new productModel(complexProductData);
        await product.save();
        console.log("✅ Complex Product 'Arlow Modular Sofa System' seeded with variants.");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
};

seedComplexProduct();
