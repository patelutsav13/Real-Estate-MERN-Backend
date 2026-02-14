
import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/User.js"

dotenv.config()

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB Connected")

        const email = "admin@realestate.com" // CHANGE THIS if you want to promote a different email

        const user = await User.findOne({ email })

        if (user) {
            user.role = "admin"
            await user.save()
            console.log(`🎉 User ${email} is now an ADMIN!`)
        } else {
            console.log(`❌ User ${email} not found. Please sign up first.`)
        }

        mongoose.connection.close()
    })
    .catch((err) => console.error(err))
