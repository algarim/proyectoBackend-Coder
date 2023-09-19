import express from 'express';
import { manager } from './ProductManager.js';

const app = express();
const port = 8080;

app.get('/products', async (req, res) => {
    try {
        const products = await manager.getProducts(req.query);
        res.status(200).json( { message: "Products found", products} );
    } catch (error) {
        res.status(500).json( { message: error.message } );
    }
});

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await manager.getProductById( +pid );

        if (!product) {
            return res.status(404).json({ message: "Product not found with ID provided" })
        };

        res.status(200).json( { message: "Product found", product } );

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});