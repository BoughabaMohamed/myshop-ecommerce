
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

  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  if (list.length === 0) {

    productsContainer.innerHTML = `
      <div class="col-span-full text-center py-16">
        <h2 class="text-2xl font-semibold text-gray-700">
          No products found
        </h2>
        <p class="text-gray-500 mt-2">
          Try another search or category.
        </p>
      </div>
    `;

    return;
  }


  list.forEach(product => {

    productsContainer.innerHTML += `

      <div
        class="group bg-white rounded-2xl border border-gray-100
        shadow-sm hover:shadow-xl transition duration-300
        overflow-hidden"
      >

        <!-- Product Image -->
        <a
          href="product-details.html?id=${product.id}"
          class="block bg-gray-50 p-5"
        >

          <img
            src="http://localhost:3000/uploads/${product.image}"
            alt="${product.name}"
            class="w-full h-52 object-contain
            group-hover:scale-105 transition duration-300"
          >

        </a>


        <!-- Product Info -->
        <div class="p-5">

          <!-- Category -->
          <p class="text-sm text-blue-600 font-medium mb-2">
            ${product.category}
          </p>


          <!-- Name -->
          <h3
            class="text-lg font-semibold text-gray-800
            line-clamp-1 mb-2"
          >

            <a
              href="product-details.html?id=${product.id}"
              class="hover:text-blue-600 transition"
            >
              ${product.name}
            </a>

          </h3>


          <!-- Price -->
          <p class="text-xl font-bold text-blue-600 mb-2">
            ${product.price} DH
          </p>


          <!-- Stock -->
          <p class="text-sm text-gray-500 mb-4">
            Stock: ${product.stock}
          </p>


          <!-- Button -->
          <button
            onclick="addToCart(${product.id})"
            class="w-full bg-blue-600 hover:bg-blue-700
            text-white font-medium py-3 px-4
            rounded-xl transition duration-300
            active:scale-95"
          >
            Add to Cart
          </button>

        </div>

      </div>

    `;
  });
}


function addToCart(id) {

  const product = products.find(p => p.id === id);

  if (!product) return;

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

  if (!cartCount) return;

  const totalItems = cart.reduce((sum, item) => {

    return sum + (item.quantity || 1);

  }, 0);


  cartCount.textContent = "Cart: " + totalItems;
}


if (searchInput) {

  searchInput.addEventListener(
    "input",
    filterProducts
  );

}


if (categorySelect) {

  categorySelect.addEventListener(
    "change",
    filterProducts
  );

}


function filterProducts() {

  const search = searchInput
    ? searchInput.value.toLowerCase()
    : "";

  const category = categorySelect
    ? categorySelect.value
    : "all";


  const filtered = products.filter(product => {

    const matchName =
      product.name
        .toLowerCase()
        .includes(search);


    const matchCategory =
      category === "all" ||
      product.category === category;


    return matchName && matchCategory;

  });


  displayProducts(filtered);
}