import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const syncRatings = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
        console.log('Connected to MongoDB:', process.env.DB_NAME);

        const db = mongoose.connection.db;
        const products = await db.collection('products').find({}).toArray();
        console.log(`Found ${products.length} products`);

        for (const product of products) {
            const productStrId = product._id.toString();
            const reviews = await db.collection('comments').find({
                $and: [
                    { targetType: "product" },
                    {
                        $or: [
                            { productId: product._id },
                            { productId: productStrId }
                        ]
                    }
                ]
            }).toArray();

            const count = reviews.length;
            const avg = count > 0 ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / count : 0;

            await db.collection('products').updateOne(
                { _id: product._id },
                { $set: { rating: avg, reviewsCount: count } }
            );
            if (count > 0) {
                console.log(`✅ Synced ${product.name}: ${avg.toFixed(1)} stars (${count} reviews)`);
            }
        }

        console.log('Sync complete');
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
};
syncRatings();
