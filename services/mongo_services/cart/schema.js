import mongoose from 'mongoose'

const { Schema, model } = mongoose

const CartSchema = new Schema(
    {

    }
)

export default model("Cart", CartSchema)