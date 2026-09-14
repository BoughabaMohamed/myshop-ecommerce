const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const productDetails = document.getElementById("productDetails");

fetch("http://localhost:3000/products")
  .then(res => res.json())
  .then(products => {

    const product = products.find(p => p.id == id);

    if (!product) {
      productDetails.innerHTML = `
        <div class="text-center py-16">
          <div class="text-5xl mb-4">🔍</div>

          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            Product not found
          </h2>

          <p class="text-gray-500 mb-6">
            The product you are looking for does not exist.
          </p>

          <a
            href="products.html"
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Back to Products
          </a>
        </div>
      `;

      return;
    }

    productDetails.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        <!-- Product Image -->
        <div class="bg-gray-50 rounded-2xl p-6 sm:p-10 flex items-center justify-center min-h-[300px]">
          <img
            src="http://localhost:3000/uploads/${product.image}"
            alt="${product.name}"
            class="w-full max-w-md h-72 sm:h-96 object-contain hover:scale-105 transition duration-300"
          >
        </div>

        <!-- Product Information -->
        <div class="flex flex-col">

          <span class="inline-block w-fit bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            ${product.category}
          </span>

          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ${product.name}
          </h1>

          <p class="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
            ${product.description || "No description available."}
          </p>

          <!-- Price -->
          <div class="mb-5">
            <span class="text-3xl sm:text-4xl font-bold text-blue-600">
              ${product.price} DH
            </span>
          </div>

          <!-- Stock -->
          <div class="flex items-center gap-2 mb-7">

            <span class="font-semibold text-gray-800">
              Stock:
            </span>

            <span class="${
              product.stock > 0
                ? "text-green-600 bg-green-100"
                : "text-red-600 bg-red-100"
            } px-3 py-1 rounded-full text-sm font-semibold">
              ${product.stock > 0 ? product.stock + " available" : "Out of stock"}
            </span>

          </div>

          <!-- Add To Cart -->
          <button
            onclick="addToCart(${product.id})"
            class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold px-8 py-4 rounded-xl transition duration-300 shadow-lg shadow-blue-200"
          >
            🛒 Add To Cart
          </button>

          <!-- Back -->
          <a
            href="products.html"
            class="mt-4 text-center sm:text-left text-gray-500 hover:text-blue-600 font-medium transition"
          >
            ← Back to Products
          </a>

        </div>

      </div>
    `;

  })
  .catch(error => {
    console.log(error);

    productDetails.innerHTML = `
      <div class="text-center py-16">
        <div class="text-5xl mb-4">⚠️</div>

        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h2>

        <p class="text-gray-500">
          Could not load the product.
        </p>
      </div>
    `;
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