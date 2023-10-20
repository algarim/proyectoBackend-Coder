import { Router } from "express";
import cartsManager from "../dao/managers/CartsManager.js";

const router = Router();

router.post('/', async (req, res) => {
    try {
        const cart = await cartsManager.createNewCart();
        res.status(200).json({ message: "New cart created", cart });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartsManager.getCartById(cid);
        
        if(!cart?.products) {
            return res.status(404).json({ message: "Cart not found with ID provided." });
        }

        res.status(200).json({ message: "Cart found", cart: cart?.products });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        await cartsManager.deleteCart(cid);
        res.status(200).json({ message: "Cart deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const { cartProducts, newCartItem } = await cartsManager.addProductToCart(pid, cid);

        if (!cartProducts) {
            return res.status(404).json({ message: "Cart not found with ID provided." });
        };

        res.status(200).json({ message: "Product successfully added to cart.", newCartItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const { product, result } = await cartsManager.deleteProductFromCart(pid, cid);

        if (!product) {
            return res.status(404).json({ message: "Product not found with ID provided." });
        };

        res.status(200).json({ message: "Product successfully deleted from cart." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;