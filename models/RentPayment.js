import mongoose from "mongoose"

const RentPaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  amount: { type: Number, required: true },
  months: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "Completed" },
  createdAt: { type: Date, default: Date.now },
})

const RentPayment = mongoose.model("RentPayment", RentPaymentSchema)

export default RentPayment
