import { Router } from "express";
import productManager from "../dao/managers/ProductsManager.js";
import cartsManager from "../dao/managers/CartsManager.js";

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

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartsManager.getCartById(cid);
        const cartProducts = cart.products;
        res.render('cart', { cartProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/chat', async (req, res) => {
    try {
        res.render('chat');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;