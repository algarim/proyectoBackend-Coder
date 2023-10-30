import { Router } from "express";
import productManager from "../dao/managers/ProductsManager.js";
import cartsManager from "../dao/managers/CartsManager.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await productManager.getProducts(req.query);
        const products = result.docs;
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/products', async (req, res) => {
    try {
        const result = await productManager.getProducts(req.query);
        const { page, ...query } = req.query;

        const queryEntries = Object.entries(query);
        const queryString = queryEntries.reduce((partialRes, entry) => partialRes + '&' + entry.join('='), '');

        const products = result.docs;

        const totalPages = result.totalPages;
        const pagesArray = [...Array(totalPages).keys()].map(n => n + 1);

        const prevLink = products.hasPrevPage
            ? `http://localhost:8080/products?page=${products.prevPage}${queryString}`
            : null;

        const nextLink = products.hasNextPage
            ? `http://localhost:8080/products?page=${products.nextPage}${queryString}`
            : null;

            res.render('products', { products, pagesArray, prevLink, nextLink, queryString });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const result = await productManager.getProducts(req.query);
        const products = result.docs;
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