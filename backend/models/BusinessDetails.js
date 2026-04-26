import mongoose from "mongoose";

const businessDetailsSchema = new mongoose.Schema(
  {
    company: {
      name: { type: String, default: "Legacy Furniture" },
      tagline: { type: String, default: "Timeless Craftsmanship" },
      description: {
        type: String,
      },
      foundedYear: { type: Number, default: 2025 },
    },

    contact: {
      customerSupport: {
        email: String,
        phone: { type: String },
        hours: { type: String },
      },
    },

    location: {
      displayAddress: {
        type: String,
        default: "London, United Kingdom",
      },
      googleMapsLink: String,
    },

    socialMedia: {
      facebook: String,
      instagram: String,
      tiktok: String,
      whatsapp: String,
    },

    multiStore: {
      enabled: { type: Boolean, default: false },
      defaultStore: { type: String, default: null },
      stores: [
        {
          storeId: String,
          storeName: String,
          storeType: {
            type: String,
            enum: ["warehouse", "showroom", "atelier"],
            default: "warehouse",
          },
          location: {
            displayName: String,
            address: {
              street: String,
              city: String,
              state: String,
              zipCode: String,
            },
            coordinates: {
              lat: { type: Number, default: 0 },
              lng: { type: Number, default: 0 },
            },
            googleMapsLink: String,
          },
          contact: {
            phone: String,
            manager: String,
          },
          operatingHours: {
            monday: Object,
            tuesday: Object,
            wednesday: Object,
            thursday: Object,
            friday: Object,
            saturday: Object,
            sunday: Object,
          },
          status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
          },
          isActive: { type: Boolean, default: true },
          storeLogo: {
            url: String,
            public_id: String,
          },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },

    logos: {
      website: { url: String, public_id: String },
      admin: { url: String, public_id: String },
      favicon: { url: String, public_id: String },
    },
  },
  { timestamps: true }
);

// 📦 Static method: find or create business details
businessDetailsSchema.statics.getBusinessDetails = async function () {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not connected");
  }

  let businessDetails = await this.findOne();

  if (!businessDetails) {
    businessDetails = await this.create({});
    console.log("✅ Default business details created");
  }

  return businessDetails;
};

// 🔌 Connection state helper
businessDetailsSchema.statics.checkConnection = function () {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return {
    state: states[mongoose.connection.readyState],
    readyState: mongoose.connection.readyState,
  };
};

const BusinessDetails = mongoose.model("BusinessDetails", businessDetailsSchema);

export default BusinessDetails;
