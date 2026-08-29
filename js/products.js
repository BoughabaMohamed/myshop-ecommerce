let products = [];

fetch("http://localhost:3000/products")
   .then(response => response.json())
   .then(data => {

    products = data;

    console.log(products);

    displayProducts(products);
   })
   .catch(error => {
    console.error(error);
   });

const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const cartCount = document.getElementById("cartCount");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

updateCartCount();

function displayProducts(list) {
  productsContainer.innerHTML = "";

  if (list.length === 0) {
    productsContainer.innerHTML = "<h2>No products found</h2>";
    return;
}

  list.forEach(product => {
    console.log(product.image);
    productsContainer.innerHTML += `
    <div class="card">
    <a href="product-details.html?id=${product.id}">
      <img src="http://localhost:3000/uploads/${product.image}" alt="${product.name}">
    </a>
      <h3>
        <a href="product-details.html?id=${product.id}">
      ${product.name}
        </a>
      </h3>
      <p>${product.price} DH</p>
      <p>Category: ${product.category}</p>
      <p>Stock: ${product.stock}</p>
      <button onclick="addToCart(${product.id})">
        Add to Cart
      </button>
    </div> 
    `;
  });
}


function addToCart(id) {

  const product = products.find(p => p.id === id);

  const existingProduct = cart.find(item => item.id === id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  alert("Product added to cart successfully.");
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => {
    return sum + (item.quantity || 1);
  }, 0);
  
  cartCount.textContent = "Cart: " + totalItems;
}

searchInput.addEventListener("input", filterProducts);

categorySelect.addEventListener("change", filterProducts);

function filterProducts() {

  const search = searchInput.value.toLowerCase();

  const category = categorySelect.value;

  const filtered = products.filter(product => {

    const matchName =
    product.name.toLowerCase().includes(search);

    const matchCategory =
      category === "all" ||
      product.category === category;

    return matchName && matchCategory;
  });

  displayProducts(filtered);
}


