import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts( queryObj = {} ) {
        try {
            const { limit } = queryObj;
            if (fs.existsSync(this.path)) {
                const productsFile = await fs.promises.readFile(this.path, 'utf-8');
                const productsData = JSON.parse(productsFile);
                return limit ? productsData.slice(0, +limit) : productsData;
            } else {
                return [];
            }
        }
        catch (error) {
            throw new Error(error.message);
        };
    };

    async addProduct(product) {
        try {
            const products = await this.getProducts({});

            const existingProduct = products.find(p => p.code === product.code);

            if (existingProduct) {
                throw new Error('Error: Product with that code already exists.')
            } else {

                let id = (products.length === 0) ? 1 : products[products.length - 1].id + 1;
                const productWithId = { id, ...product };
                products.push(productWithId);

                await fs.promises.writeFile(this.path, JSON.stringify(products));
                return productWithId;
            }

        } catch (error) {
            throw new Error(error.message);
        }
    }


    async getProductById(id) {
        try {
            const products = await this.getProducts({});
            const searchedProduct = products.find(p => p.id === id);

            return searchedProduct;

        } catch (error) {
            throw new Error(error.message);
        }
    };

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts({});
            const index = products.findIndex(p => p.id === id);

            if (index === -1) {
                return null
            };

            const updatedProduct = { ...products[index], ...updatedFields };
            products[index] = updatedProduct;

            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return updatedProduct;

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts({});
            const product = products.find(p => p.id === id);

            if (product) {
                const newArrayProducts = products.filter(p => p.id !== id);
                await fs.promises.writeFile(this.path, JSON.stringify(newArrayProducts));
            }

            return product;

        } catch (error) {
            throw new Error(error.message);
        }
    }

};

const productManager = new ProductManager("./src/ProductFile.json");

export default productManager;