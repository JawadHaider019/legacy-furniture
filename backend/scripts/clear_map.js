import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import BusinessDetails from '../models/BusinessDetails.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const clearMapLink = async () => {
    try {
        console.log("🔗 Connecting to database...");
        await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
        console.log("✅ Connected.");

        // Aggressively delete all business detail documents
        const deleteResult = await BusinessDetails.deleteMany({});
        console.log(`🧹 Deleted ${deleteResult.deletedCount} business detail records.`);

        // Recreate one document with fresh defaults from schema
        const freshDetails = await BusinessDetails.create({});
        console.log("✨ Initialized fresh business record with brand defaults.");

        console.log("🔍 Verification - Company Name:", freshDetails.company?.name);
        console.log("🔍 Verification - Map Link:", freshDetails.location?.googleMapsLink || "EMPTY");

        process.exit(0);
    } catch (error) {
        console.error("❌ Cleanup failed:", error);
        process.exit(1);
    }
};

clearMapLink();
