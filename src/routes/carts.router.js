import { Router } from "express";
import { 
    createNewCart, 
    getCartById, 
    emptyCart, 
    addProductToCart, 
    updateCart, 
    updateProductQuantity, 
    deleteProductFromCart 
} from "../controllers/carts.controller.js";

const router = Router();

router.post('/', createNewCart)

router.get('/:cid', getCartById);

router.delete('/:cid', emptyCart);

router.post('/:cid/product/:pid', addProductToCart);

router.put('/:cid/', updateCart);

router.put('/:cid/product/:pid', updateProductQuantity);

router.delete('/:cid/product/:pid', deleteProductFromCart);

export default router;