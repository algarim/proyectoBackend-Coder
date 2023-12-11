import cartsManager from "../dao/managers/CartsManager.js";

export const createNewCart = async (req, res) => {
    try {
        const cart = await cartsManager.createNewCart();
        res.status(200).json({ message: "New cart created", cart });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCartById = async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartsManager.findById(cid);

        if (!cart?.products) {
            return res.status(404).json({ message: "Cart not found with ID provided." });
        }

        res.status(200).json({ message: "Cart found", cart: cart?.products });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const emptyCart = async (req, res) => {
    const { cid } = req.params;

    try {
        await cartsManager.emptyCart(cid);
        res.status(200).json({ message: "Cart emptied" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addProductToCart = async (req, res) => {
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
};

export const updateCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const updatedCartProducts = await cartsManager.updateOne(cid, req.body);

        res.status(200).json({ message: "Cart successfully updated.", updatedCart: updatedCartProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const { cartProducts, updatedCartItem } = await cartsManager.updateProductQuantity(pid, cid, quantity);

        if (!cartProducts) {
            return res.status(404).json({ message: "Cart not found with ID provided." });
        };

        res.status(200).json({ message: "Product quantity successfully updated.", updatedCartItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProductFromCart = async (req, res) => {
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
};