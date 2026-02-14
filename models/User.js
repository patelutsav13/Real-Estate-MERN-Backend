import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user", // future admin support
    },
    // Agent Specific Fields
    image: { type: String },
    title: { type: String },
    address: { type: String },
    experience: { type: Number },
    experience: { type: Number },
    expertise: { type: String },

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
)

export default mongoose.model("User", userSchema)
