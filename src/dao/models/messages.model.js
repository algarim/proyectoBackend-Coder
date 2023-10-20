import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
});

export const cartsModel = mongoose.model("Products", cartsSchema);