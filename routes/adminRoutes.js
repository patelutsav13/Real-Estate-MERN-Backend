import express from "express"
import User from "../models/User.js"
import Property from "../models/Property.js"
import BuyPayment from "../models/BuyPayment.js"
import { protect } from "../middleware/authMiddleware.js"
import { admin } from "../middleware/adminMiddleware.js"
import bcrypt from "bcryptjs"

const router = express.Router()

// GET SYSTEM STATS
router.get("/stats", protect, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments()
        const propertyCount = await Property.countDocuments()
        const agentCount = await User.countDocuments({ role: "agent" })
        const buyPaymentCount = await BuyPayment.countDocuments()

        res.json({
            users: userCount,
            properties: propertyCount,
            agents: agentCount,
            buyPayments: buyPaymentCount,
        })
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats", error: err.message })
    }
})

// GET ALL USERS
router.get("/users", protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 })
        res.json(users)
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err.message })
    }
})

// UPDATE USER ROLE (Promote/Demote)
router.put("/users/:id/role", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (user) {
            user.role = req.body.role || user.role
            const updatedUser = await user.save()
            res.json(updatedUser)
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (err) {
        res.status(500).json({ message: "Error updating user", error: err.message })
    }
})

// DELETE USER
router.delete("/users/:id", protect, admin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ message: "User removed" })
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message })
    }
})

// DELETE PROPERTY (Admin Override)
router.delete("/properties/:id", protect, admin, async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id)
        res.json({ message: "Property removed by Admin" })
    } catch (err) {
        res.status(500).json({ message: "Error deleting property", error: err.message })
    }
})

import upload from "../middleware/uploadMiddleware.js"

// ... (previous imports)

// CREATE AGENT (Admin Only) - Updated with Image Upload
router.post("/add-agent", protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, email, phone, password, title, address, experience, expertise } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: "User already exists" })

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

        let imagePath = ""
        if (req.file) {
            imagePath = `${BASE_URL}/uploads/${req.file.filename}`
        }

        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "agent",
            image: imagePath,
            title,
            address,
            experience,
            expertise
        })

        await user.save()

        res.status(201).json({ message: "Agent created successfully", user })
    } catch (err) {
        res.status(500).json({ message: "Error creating agent", error: err.message })
    }
})

export default router

