import { Router } from "express";
import productsManager from "../dao/managers/ProductsManager.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productsManager.getProducts();
        res.status(200).json({ message: "Products found", products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productsManager.getProductById(pid);

        res.status(200).json({ message: "Product found", product });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "Some data is missing" });
    };

    const newProduct = { title, description, code, price, status, stock, category, thumbnail }

    try {
        const response = await productsManager.addProduct(newProduct);
        res.status(200).json({ message: "Product added", product: response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await productsManager.updateProduct(pid, req.body);

        res.status(200).json( {message: "Product updated"} );
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await productsManager.deleteProduct(pid);

        res.status(200).json({ message: "Product deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;