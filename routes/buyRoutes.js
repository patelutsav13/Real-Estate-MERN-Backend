import express from "express"
import BuyPayment from "../models/BuyPayment.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// GET MY PURCHASES
router.get("/my-purchases", protect, async (req, res) => {
    try {
        const purchases = await BuyPayment.find({ user: req.user.id }).populate("property")
        res.json(purchases)
    } catch (err) {
        res.status(500).json({ message: "Error fetching purchases", error: err.message })
    }
})

import Property from "../models/Property.js"

// ... imports

// PAY FOR PROPERTY
router.post("/pay", protect, async (req, res) => {
    try {
        const { propertyId, amount, paymentMethod } = req.body

        const newPayment = new BuyPayment({
            user: req.user.id,
            property: propertyId,
            amount,
            paymentMethod
        })

        await newPayment.save()

        // UPDATE PROPERTY STATUS
        await Property.findByIdAndUpdate(propertyId, { status: "Booked" })

        res.status(201).json({ message: "Property purchase successful!" })
    } catch (err) {
        res.status(500).json({ message: "Payment failed", error: err.message })
    }
})

export default router
