import { Router } from "express";
import productManager from "../ProductManager";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts(req.query);
        res.status(200).json({ message: "Products found", products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(+pid);

        if (!product) {
            return res.status(404).json({ message: "Product not found with ID provided" })
        };

        res.status(200).json({ message: "Product found", product });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status = true, } = req.body;
        if (!first_name || !course || !password) {
            return res.status(400).json({ message: "Some data is missing" });
        }
        try {
            const response = await manager.createUser(req.body);
            res.status(200).json({ message: "User created", user: response });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
});

export default router;