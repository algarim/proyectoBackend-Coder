import productsManager from "../dao/managers/ProductsManager.js";

export const getProducts = async (req, res) => {
    try {
        const { page, ...query } = req.query;

        const queryEntries = Object.entries(query);
        const queryString = queryEntries.reduce((partialRes, entry) => partialRes + '&' + entry.join('='), '');

        const products = await productsManager.findAll(req.query);
        res.status(200).json({
            status: "Success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage
                ? `http://localhost:8080/api/products?page=${products.prevPage}${queryString}`
                : null,
            nextLink: products.hasNextPage
                ? `http://localhost:8080/api/products?page=${products.nextPage}${queryString}`
                : null,
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productsManager.findById(pid);

        res.status(200).json({ message: "Product found", product });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addProduct = async (req, res) => {
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
};

export const updateProduct = async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await productsManager.updateProduct(pid, req.body);

        res.status(200).json({ message: "Product updated" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        await productsManager.deleteProduct(pid);

        res.status(200).json({ message: "Product deleted" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};