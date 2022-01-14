import mongoose from 'mongoose'

const { Schema, model } = mongoose

const CartSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [{ name: String, price: Number, quantity: Number, originalId: Schema.Types.ObjectId }],
        status: { type: String, required: true, enum: ["active", "paid"] }
    },
    { timestamps: true }
)

export default model("Cart", CartSchema)