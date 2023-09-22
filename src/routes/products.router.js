import { Router } from "express";
import productManager from "../ProductManager.js";

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
    const { title, description, code, price, status = true, stock, category, thumbnail = 'Sin imagen' } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "Some data is missing" });
    };

    const newProduct = { title, description, code, price, status, stock, category, thumbnail }

    try {
        const response = await productManager.addProduct(newProduct);
        res.status(200).json({ message: "Product added", product: response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    };
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const response = await productManager.updateProduct(+pid, req.body);

        if(!response) {
            return res.status(404).json( {message: "Product not found with ID provided."} );
        }

        res.status(200).json( {message: "Product updated", response} );
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await productManager.deleteProduct(+pid);

        if (!response) {
            return res.status(404).json({ message: "Product not found with ID provided." });
        }

        res.status(200).json({ message: "Product deleted", response });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;