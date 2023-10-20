const socketClient = io();

const addForm = document.getElementById("add-form");
const addFormInputs = addForm.getElementsByTagName('input');

addForm.onsubmit = (e) => {
    e.preventDefault();
    const newProduct = {};
    for( let i = 0; i < addFormInputs.length; i++ ) {
        newProduct[ addFormInputs[i].name ] = addFormInputs[i].value;
        addFormInputs[i].value = "";
    };

    socketClient.emit( "addProduct", newProduct );
};

const deleteForm = document.getElementById("delete-form");
const deleteInput = document.getElementById("id");

deleteForm.onsubmit = (e) => {
    e.preventDefault();
    const deletedProductId = deleteInput.value;

    socketClient.emit('deleteProduct', deletedProductId);
};


const productsList = document.querySelector(".products-list");

socketClient.on('productAdded', (newProduct) => {
    const { _id, title, description, price, stock, code } = newProduct;

    let newProductDom = document.createElement("div");
    newProductDom.id = `product-${_id}`
    newProductDom.innerHTML = `
    <h3>${title} - ID: ${_id}</h3>
    <p>${description}</p>
    <p> Price: ${ price } </p>
    <p> Stock: ${ stock } </p>
    <p> Code: ${ code } </p>
    `;

    productsList.append(newProductDom);
});

socketClient.on('productDeleted', (deletedProductId) => {
    const deletedProduct = document.getElementById(`product-${deletedProductId}`);

    deletedProduct.remove();
});

