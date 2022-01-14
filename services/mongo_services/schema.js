import mongoose from 'mongoose'

const { Schema, model } = mongoose

const ReviewSchema = new Schema(
    {
        comment: { type: String, required: true },
        rate: { type: Number, min: [0, 'rate cannot be below zero'], max: [5, 'rate cannot be above five'], default: 5 }
    },
    { timestamps: true }
)

const ProductSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        brand: { type: String, required: true },
        imageUrl: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true, enum: ["Digital Art", "Fandom", "Tech", "Meme"] },
        reviews: { type: [ReviewSchema], default: [] }
    },
    { timestamps: true }
)

export default model("Products", ProductSchema)