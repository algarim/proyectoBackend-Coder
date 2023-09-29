import { Router } from "express";
import productManager from "../ProductManager.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realtimeproducts', { products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;