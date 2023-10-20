import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnails: {
        type: Array,
        default: undefined,
    }
});

export const productsModel = mongoose.model("Products", productsSchema);