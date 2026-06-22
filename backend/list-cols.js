import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const list = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(collections.map(c => c.name));
    process.exit(0);
};
list();
