const socketClient = io();

const addToCartButtons = document.querySelectorAll(".add-product-btn");

addToCartButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const newProductId = btn.id.replace('add-', '');
        socketClient.emit("addProductToCart", newProductId);
        
        Toastify({
            text: "Product added to cart",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            duration: 5000,
          }).showToast();
    })
});
