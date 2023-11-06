import { Router } from "express";
import productManager from "../dao/managers/ProductsManager.js";
import cartsManager from "../dao/managers/CartsManager.js";

const router = Router();

router.get('/', async (req, res) => {
    res.redirect("/login");
    // try {
    //     const result = await productManager.getProducts(req.query);
    //     const products = result.docs;
    //     res.render('home', { products });
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }
});

router.get('/products', async (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    try {
        const result = await productManager.getProducts(req.query);
        const { page, ...query } = req.query;

        const queryEntries = Object.entries(query);
        const queryString = queryEntries.reduce((partialRes, entry) => partialRes + '&' + entry.join('='), '');

        const products = result.docs;

        const totalPages = result.totalPages;
        const pagesArray = [...Array(totalPages).keys()].map(n => n + 1);

        const prevLink = result.hasPrevPage
            ? `/products?page=${result.prevPage}${queryString}`
            : null;

        const nextLink = result.hasNextPage
            ? `/products?page=${result.nextPage}${queryString}`
            : null;

        res.render('products', { products, pagesArray, prevLink, nextLink, queryString, user: req.session.user });
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


//CHAT

router.get('/chat', async (req, res) => {
    try {
        res.render('chat');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// SESSIONS

router.get("/login", (req, res) => {
    if (req.session?.user) {
        return res.redirect("/products");
    }
    res.render("login");
});

router.get("/signup", (req, res) => {
    if (req.session.user) {
        return res.redirect("/products");
    }
    res.render("signup");
});

export default router;