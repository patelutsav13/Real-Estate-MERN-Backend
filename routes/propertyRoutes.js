// import express from "express"
// import Property from "../models/Property.js"

// const router = express.Router()

// import { protect } from "../middleware/authMiddleware.js"

// import upload from "../middleware/uploadMiddleware.js"

// // GET ALL PROPERTIES
// router.get("/", async (req, res) => {
//     try {
//         const properties = await Property.find().sort({ createdAt: -1 })
//         res.json(properties)
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching properties", error: err.message })
//     }
// })

// // GET MY LISTINGS
// router.get("/my-listings", protect, async (req, res) => {
//     try {
//         const properties = await Property.find({ owner: req.user.id }).sort({ createdAt: -1 })
//         res.json(properties)
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching your properties", error: err.message })
//     }
// })

// // ADD NEW PROPERTY (Protected)
// router.post("/", protect, upload.single('image'), async (req, res) => {
//     try {
//         let imagePath = "";
//         if (req.file) {
//             // Convert buffer to Base64
//             const b64 = Buffer.from(req.file.buffer).toString('base64');
//             const mimeType = req.file.mimetype;
//             imagePath = `data:${mimeType};base64,${b64}`;
//         } else if (req.body.image) {
//             imagePath = req.body.image; // Fallback to URL if provided textually
//         }

//         const newProperty = new Property({
//             ...req.body,
//             image: imagePath,
//             owner: req.user.id
//         })
//         await newProperty.save()
//         res.status(201).json({ message: "Property listed successfully!", property: newProperty })
//     } catch (err) {
//         res.status(500).json({ message: "Error adding property", error: err.message })
//     }
// })

// export default router



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
        let imagePath = "";
        if (req.file) {
            console.log("Processing file upload...");
            // Convert buffer to Base64
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const mimeType = req.file.mimetype;
            imagePath = `data:${mimeType};base64,${b64}`;
            console.log("Image converted to Base64 length:", imagePath.length);
        } else if (req.body.image) {
            console.log("Using provided image string");
            imagePath = req.body.image; // Fallback to URL if provided textually
        }

        const newProperty = new Property({
            ...req.body,
            image: imagePath,
            owner: req.user.id
        })
        await newProperty.save()
        console.log("Property saved successfully:", newProperty._id);
        res.status(201).json({ message: "Property listed successfully!", property: newProperty })
    } catch (err) {
        res.status(500).json({ message: "Error adding property", error: err.message })
    }
})

export default router

