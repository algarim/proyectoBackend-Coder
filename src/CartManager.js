import fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const cartsFile = await fs.promises.readFile(this.path, 'utf-8');
                const cartsData = JSON.parse(cartsFile);
                return cartsData;
            } else {
                return [];
            }
        }
        catch (error) {
            throw new Error(error.message);
        };
    };

    async createNewCart() {
        try {
            const carts = await this.getCarts();

            let id = (carts.length === 0) ? 1 : carts[carts.length - 1].id + 1;
            const newCart = { id, products: [] };
            carts.push(newCart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts));

        } catch (error) {
            throw new Error(error.message);
        }
    };
    
    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            const searchedCart = carts.find(c => c.id === id);

            return searchedCart.products;

        } catch (error) {
            throw new Error(error.message);
        }
    };

    async addProductToCart(productId, cartId) {
        try {
            const cartsArray = await this.getCarts();
            const cart = cartsArray.find(c => c.id === cartId).products;

            const existingProduct = cart.find( item => item.product === productId);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                const newItem = { product: productId, quantity: 1 };
                cart.push(newItem);
            };

            await fs.promises.writeFile(this.path, JSON.stringify(cartsArray));
            
        } catch (error) {
            throw new Error(error.message);
        }
    };
};

const cartManager = new CartManager("./src/CartFile.json");

export default cartManager;


