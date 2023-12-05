import { productsModel } from "../models/products.model.js"

class ProductsManager {
    async findAll(obj) {
        const { limit = 10, page = 1, sort, ...query } = obj;
        let sortObj
        if (sort) {
            sortObj = { price: sort };
        };
        const result = await productsModel.paginate(
            query,
            { limit, page, sort: sortObj, lean: true }
        );
        return result;
    };

    async findById(id) {
        const result = await productsModel.findById(id);
        return result;
    };

    async createOne(obj) {
        const result = await productsModel.create(obj);
        return result;
    };

    async updateOne(id, obj) {
        const result = await productsModel.updateOne( {_id: id}, obj );
        return result;
    };

    async deleteOne(id) {
        const result = await productsModel.deleteOne( {_id: id} );
        return result;
    };
}

const productsManager = new ProductsManager();

export default productsManager;