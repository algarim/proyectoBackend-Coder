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

    async emptyCart(id) {
        const result = await cartsModel.updateOne({ _id: id }, { products: [] });
        return result;
    };

    async getCartById(id) {
        const result = await cartsModel
            .findById(id)
            .populate("products.product")
            .lean();
        return result;
    };

    async addProductToCart(productId, cartId) {
        try {
            const cart = await cartsModel.findById(cartId);
            const cartProducts = cart?.products;
            const product = await productsManager.getProductById(productId);

            let newCartItem;

            if (product && cartProducts) {
                const existingProduct = cartProducts.find(item => item.product.equals(productId));

                console.log(existingProduct);

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

    async updateCart(cartId, productsArray) {
        try {
            const cart = await cartsModel.findById(cartId);
            const cartProducts = cart?.products;
            let updatedCartProducts;

            if (cartProducts) {
                if (cartProducts.length === 0) {
                    await cartsModel.updateOne({ _id: cartId }, { products: productsArray });
                    updatedCartProducts = productsArray;
                } else {
                    const productsArrayIds = [];
                    for (let i = 0; i < productsArray.length; i++) {
                        productsArrayIds.push(productsArray[i].product.toString());
                    };

                    const filteredProducts = cartProducts.filter((p) => !productsArrayIds.includes(p.product.toString()));

                    console.log(filteredProducts);

                    updatedCartProducts = [...filteredProducts, ...productsArray];
                    await cartsModel.updateOne({ _id: cartId }, { products: updatedCartProducts });
                };
            }

            return updatedCartProducts;

        } catch (error) {
            throw new Error(error.message);
        }
    };

    async updateProductQuantity(productId, cartId, quantity) {
        try {
            const cart = await cartsModel.findById(cartId);
            const cartProducts = cart?.products;
            const product = await productsManager.getProductById(productId);

            let updatedCartItem;

            if (product && cartProducts) {
                const existingProduct = cartProducts.find(item => item.product.equals(productId));

                console.log(existingProduct);

                if (existingProduct) {
                    existingProduct.quantity = quantity;
                    updatedCartItem = existingProduct;
                    await cartsModel.updateOne({ _id: cartId }, cart);
                }
            }

            return { cartProducts, updatedCartItem };

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProductFromCart(productId, cartId) {
        try {
            const cart = await this.getCartById(cartId);
            const cartProducts = cart.products;
            const existingProduct = cartProducts.find(item => item.product.equals(productId));

            if (existingProduct) {
                let index = cartProducts.indexOf(existingProduct);
                cartProducts.splice(index, 1);
            };

            const result = await cartsModel.updateOne({ _id: cartId }, cart);

            return { product: existingProduct, result };

        } catch (error) {
            throw new Error(error.message);
        }
    };
};

const cartsManager = new CartsManager();

export default cartsManager;


