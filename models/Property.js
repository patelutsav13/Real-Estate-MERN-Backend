import mongoose from "mongoose"

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: String, required: true }, // Display string like "1.5 Cr"
  priceValue: { type: Number, required: true }, // Numeric value for sorting/filtering
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  image: { type: String, required: true }, // URL or Base64
  area: { type: String, required: false },
  type: { type: String, required: true }, // Villa, Apartment, House
  status: { type: String, required: true }, // "For Rent", "For Sale"
  priceType: { type: String }, // "month" or null/undefined for sale
  description: { type: String, required: false },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true // Open for now to support legacy data
  },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Property", PropertySchema)
