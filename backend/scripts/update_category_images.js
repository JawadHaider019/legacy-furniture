import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/categoryModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const updates = [
    {
        name: "Dining",
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=1200"
    },
    {
        name: "Lighting",
        image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=1200"
    }
];

const update = async () => {
    try {
        console.log("🔗 Connecting to database...");
        await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
        console.log("✅ Connected.");

        for (const item of updates) {
            console.log(`Updating ${item.name}...`);
            const result = await Category.updateOne(
                { name: item.name },
                { $set: { image: item.image } }
            );
            if (result.matchedCount > 0) {
                console.log(`✅ ${item.name} updated.`);
            } else {
                console.log(`⚠️ ${item.name} not found.`);
            }
        }

        console.log("✨ All updates complete.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Update failed:", error);
        process.exit(1);
    }
};

update();
