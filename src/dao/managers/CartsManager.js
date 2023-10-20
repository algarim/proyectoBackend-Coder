import { cartsModel } from '../models/carts.model.js';
import productsManager from './ProductsManager.js';

class CartsManager {
    async getCarts() {
        const carts = await cartsModel.find().lean();
        return carts;
    };

    async createNewCart() {
        const result = await cartsModel.create({ products: [] });
        return result;
    };

    async deleteCart(id) {
        const result = await cartsModel.deleteOne({ _id: id });
        return result;
    };

    async getCartById(id) {
        const result = await cartsModel.findById(id);
        return result;
    };

    async addProductToCart(productId, cartId) {
        try {
            const cart = await this.getCartById(cartId);
            const cartProducts = cart?.products;
            const product = await productsManager.getProductById(productId);

            let newCartItem;

            if (product && cartProducts) {
                const existingProduct = cartProducts.find(item => item.product === productId);

                if (existingProduct) {
                    existingProduct.quantity++;
                    newCartItem = existingProduct;
                } else {
                    newCartItem = { product: productId, quantity: 1 };
                    cartProducts.push(newCartItem);
                };

                await cartsModel.updateOne({ _id: cartId }, cart);
            }

            return { cartProducts, newCartItem };

        } catch (error) {
            throw new Error(error.message);
        }
    };

    async deleteProductFromCart(productId, cartId) {
        try {
            const cart = await this.getCartById(cartId);
            const cartProducts = cart.products;
            const existingProduct = cartProducts.find(item => item.product === productId);

            if (existingProduct) {
                let index = cartProducts.indexOf(existingProduct);
                cartProducts.splice(index, 1);
            };

            const result = await cartsModel.updateOne({ _id: cartId }, cart);

            return {product: existingProduct, result};

        } catch (error) {
            throw new Error(error.message);
        }
    };
};

const cartsManager = new CartsManager();

export default cartsManager;


