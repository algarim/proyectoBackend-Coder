import { productsModel } from "../models/products.model.js"

class ProductsManager {
    async getProducts() {
        const result = await productsModel.find().lean();
        return result;
    };

    async getProductById(id) {
        const result = await productsModel.findById(id);
        return result;
    };

    async addProduct(obj) {
        const result = await productsModel.create(obj);
        return result;
    };

    async updateProduct(id, obj) {
        const result = await productsModel.updateOne( {_id: id}, obj );
        return result;
    };

    async deleteProduct(id) {
        const result = await productsModel.deleteOne( {_id: id} );
        return result;
    };
}

const productsManager = new ProductsManager();

export default productsManager;