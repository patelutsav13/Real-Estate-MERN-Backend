import express from "express"
import RentPayment from "../models/RentPayment.js"

const router = express.Router()

import { protect } from "../middleware/authMiddleware.js"

// GET MY RENTALS
router.get("/my-rentals", protect, async (req, res) => {
  try {
    const rentals = await RentPayment.find({ user: req.user.id }).populate("property")
    res.json(rentals)
  } catch (err) {
    res.status(500).json({ message: "Error fetching rentals", error: err.message })
  }
})

import Property from "../models/Property.js"

// ... imports

// PAY RENT
router.post("/pay", protect, async (req, res) => {
  try {
    const { propertyId, amount, months, paymentMethod } = req.body

    const newPayment = new RentPayment({
      user: req.user.id,
      property: propertyId,
      amount,
      months,
      paymentMethod
    })

    await newPayment.save()

    // UPDATE PROPERTY STATUS
    await Property.findByIdAndUpdate(propertyId, { status: "Rented" })

    res.status(201).json({ message: "Rent payment successful!" })
  } catch (err) {
    res.status(500).json({ message: "Payment failed", error: err.message })
  }
})

export default router
