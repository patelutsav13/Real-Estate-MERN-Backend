import express from "express"
import Property from "../models/Property.js"

const router = express.Router()

import { protect } from "../middleware/authMiddleware.js"

import upload from "../middleware/uploadMiddleware.js"

// GET ALL PROPERTIES
router.get("/", async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 })
        res.json(properties)
    } catch (err) {
        res.status(500).json({ message: "Error fetching properties", error: err.message })
    }
})

// GET MY LISTINGS
router.get("/my-listings", protect, async (req, res) => {
    try {
        const properties = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 })
        res.json(properties)
    } catch (err) {
        res.status(500).json({ message: "Error fetching your properties", error: err.message })
    }
})

// ADD NEW PROPERTY (Protected)
router.post("/", protect, upload.single('image'), async (req, res) => {
    try {
        const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

        let imagePath = "";
        if (req.file) {
            imagePath = `${BASE_URL}/uploads/${req.file.filename}`;
        } else if (req.body.image) {
            imagePath = req.body.image; // Fallback to URL if provided textually
        }

        const newProperty = new Property({
            ...req.body,
            image: imagePath,
            owner: req.user.id
        })
        await newProperty.save()
        res.status(201).json({ message: "Property listed successfully!", property: newProperty })
    } catch (err) {
        res.status(500).json({ message: "Error adding property", error: err.message })
    }
})

export default router
