const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const productDetails = document.getElementById("productDetails");

fetch("http://localhost:3000/products")
.then(res => res.json())
.then(products => {

    const product = products.find(p => p.id == id);

    if (!product) {

        productDetails.innerHTML = `
            <h2 style="text-align:center;">
                Product not found
            </h2>
        `;
        return;
    }

    productDetails.innerHTML = `
        <img src="../images/${product.image}" alt="${product.name}">

        <div class="details">

            <h1>${product.name}</h1>

            <p>${product.description}</p>

            <p class="price">${product.price} DH</p>

            <p><strong>Category:</strong> ${product.category}</p>

            <p>
                <strong>Stock:</strong>
                ${product.stock}
            </p>

            <button onclick="addToCart(${product.id})">
                Add To Cart
            </button>

        </div>
    `;

})
.catch(error => {
    console.log(error);
});

function addToCart(id) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    fetch("http://localhost:3000/products")

    .then(res => res.json())

    .then(products => {

        const product = products.find(p => p.id == id);

        if (!product) return;

        const existingProduct = cart.find(item => item.id == id);

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                ...product,
                quantity: 1
            });

        }

        localStorage.setItem("cart", JSON.stringify(cart));

        alert(product.name + " added to cart!");

    })

    .catch(error => {
        console.log(error);
    });

}