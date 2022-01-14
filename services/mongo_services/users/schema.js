/** @format */

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("User", usersSchema);
