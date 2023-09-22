import { Router } from "express";
import cartManager from "../CartManager.js";

const router = Router();

router.post('/', async (req, res) => {
    try {
        const response = await cartManager.createNewCart();
        res.status(200).json({ message: "New cart created", cart: response });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartManager.getCartById(+cid);
        
        if(!cart){
            return res.status(404).json({ message: "Cart not found with ID provided." });
        };

        res.status(200).json( {message: "Cart found", cart} );

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post( '/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const { cart, product, newCartItem } = await cartManager.addProductToCart(+pid, +cid);

        if(!cart) {
            return res.status(404).json({ message: "Cart not found with ID provided." });
        } else if(!product) {
            return res.status(404).json({ message: "Product not found with ID provided." });
        };

        res.status(200).json({ message: "Product successfully added to cart.", newCartItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} )

export default router;