import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    // 1. PRODUCT MEDIA
    image: { type: Array, required: true }, // [0] can be featured image

    // 2. BASIC PRODUCT DETAILS
    name: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        ref: 'Category'
    },
    subcategory: {
        type: String,
        required: true
    },

    // 3. PRODUCT SPECIFICATIONS (DYNAMIC)
    dynamicAttributes: [{
        key: { type: String },
        value: { type: String }
    }],
    specs: { type: mongoose.Schema.Types.Mixed, default: {} }, // Keep old specs as mixed type to avoid backward compatibility crash

    // 4. VARIANTS
    variants: [{
        name: { type: String },
        price: { type: Number },
        stock: { type: Number },
        sku: { type: String },
        images: { type: Array }, // Support multiple images per variant
        description: { type: String }, // Support description per variant
        discountPrice: { type: Number, default: 0 } // Support discount price per variant
    }],

    // 5. INVENTORY
    quantity: { type: Number, required: true },
    trackInventory: { type: Boolean, default: true },
    stockStatus: { type: String, enum: ['in_stock', 'out_of_stock', 'pre_order'], default: 'in_stock' },
    lowStockAlert: { type: Number, default: 5 },

    // 6. PRICING
    price: { type: Number, required: true },
    discountprice: { type: Number, required: true },
    cost: { type: Number, required: true },
    discountStartDate: { type: Date },
    discountEndDate: { type: Date },
    taxIncluded: { type: Boolean, default: true },

    // 7. SHIPPING
    weight: { type: Number, default: 0 },
    shippingClass: { type: String, enum: ['normal', 'heavy'], default: 'normal' },
    deliveryTime: { type: String, default: "3-7 days" },
    freeShipping: { type: Boolean, default: false },


    // 9. PRODUCT STATUS & VISIBILITY
    status: {
        type: String,
        enum: ['draft', 'private', 'public'],
        default: 'draft'
    },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    featuredProduct: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },

    // 10. EXTRA
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    warrantyDetails: { type: String, default: "" },
    returnPolicy: { type: String, default: "" },
    careInstructions: { type: String, default: "" },

    // Internal & Legacy fields
    date: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    reviews: [{
        author: { type: String },
        rating: { type: Number },
        date: { type: String },
        content: { type: String },
        isVerified: { type: Boolean, default: false },
        productOption: { type: String }
    }],
    totalSales: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    notificationSent: { type: Boolean, default: false }
});

// Add index for better category queries
productSchema.index({ category: 1 });
productSchema.index({ subcategory: 1 });
productSchema.index({ slug: 1 });

// Pre-save middleware for product
productSchema.pre('save', function (next) {
    if (!this.date) {
        this.date = Date.now();
    }
    if (this.discountprice >= this.price) {
        this.discountprice = this.price;
    }
    if (this.trackInventory) {
        if (this.quantity <= 0 && this.stockStatus !== 'pre_order') {
            this.stockStatus = 'out_of_stock';
        } else if (this.quantity > 0 && this.stockStatus === 'out_of_stock') {
            this.stockStatus = 'in_stock';
        }
    }
    next();
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;