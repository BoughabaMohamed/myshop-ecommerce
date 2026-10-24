
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
      <div class="w-full min-w-full text-center py-16">
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

  // Detect homepage carousel
  const isCarousel =
    productsContainer.dataset.carousel === "true";

  list.forEach(product => {

    productsContainer.innerHTML += `

      <div
        class="group bg-white rounded-2xl border border-gray-100
        shadow-sm hover:shadow-xl transition duration-300
        overflow-hidden
        ${isCarousel
          ? "flex-none w-[250px] sm:w-[280px] snap-start"
          : "w-full"}"
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

          <p class="text-sm text-blue-600 font-medium mb-2">
            ${product.category}
          </p>

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

          <p class="text-xl font-bold text-blue-600 mb-2">
            ${product.price} DH
          </p>

          <p class="text-sm text-gray-500 mb-4">
            Stock: ${product.stock}
          </p>

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
  renderCartDrawer();
  openCartDrawer();

  showToast(product.name + " added to cart!", "success");
}



const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const drawerCartItems = document.getElementById("drawerCartItems");
const drawerCartCount = document.getElementById("drawerCartCount");
const drawerCartTotal = document.getElementById("drawerCartTotal");

const closeCartDrawerBtn = document.getElementById("closeCartDrawer");
const continueShoppingBtn = document.getElementById("continueShopping");


function renderCartDrawer() {
  if (!drawerCartItems) return;

  drawerCartItems.innerHTML = "";

  let total = 0;

  const itemCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0
  );

  if (drawerCartCount) {
    drawerCartCount.textContent =
      `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  }

  if (cart.length === 0) {
    drawerCartItems.innerHTML = `
      <div class="flex flex-col items-center text-center py-12">
        <div class="text-5xl mb-4">🛒</div>
        <h3 class="text-lg font-bold text-gray-800">
          Your cart is empty
        </h3>
        <p class="text-gray-500 text-sm mt-2">
          Add some products to get started.
        </p>
      </div>
    `;
  } else {
    cart.forEach((item, index) => {
      const quantity = Number(item.quantity) || 1;
      const subtotal = Number(item.price) * quantity;

      total += subtotal;

      drawerCartItems.innerHTML += `
        <div class="flex gap-4 py-4 border-b border-gray-100">
          <a
            href="product-details.html?id=${item.id}"
            class="w-20 h-20 shrink-0 bg-gray-50 rounded-xl p-2"
          >
            <img
              src="http://localhost:3000/uploads/${item.image}"
              alt="${item.name}"
              class="w-full h-full object-contain"
            >
          </a>

          <div class="flex-1 min-w-0">
            <a
              href="product-details.html?id=${item.id}"
              class="font-semibold text-gray-800 hover:text-blue-600"
            >
              ${item.name}
            </a>

            <p class="text-blue-600 font-bold mt-1">
              ${item.price} DH
            </p>

            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onclick="changeDrawerQuantity(${index}, -1)"
                  aria-label="Decrease quantity"
                  class="w-8 h-8 hover:bg-gray-100"
                >−</button>

                <span class="w-8 text-center text-sm font-semibold">
                  ${quantity}
                </span>

                <button
                  type="button"
                  onclick="changeDrawerQuantity(${index}, 1)"
                  aria-label="Increase quantity"
                  class="w-8 h-8 hover:bg-gray-100"
                >+</button>
              </div>

              <button
                type="button"
                onclick="removeDrawerItem(${index})"
                class="text-sm text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }

  if (drawerCartTotal) {
    drawerCartTotal.textContent = `${total} DH`;
  }
}

function openCartDrawer() {
  if (!cartDrawer || !cartOverlay) return;

  cartDrawer.classList.remove("translate-x-full");
  cartOverlay.classList.remove("invisible", "opacity-0");

  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("overflow-hidden");
}

function closeCartDrawer() {
  if (!cartDrawer || !cartOverlay) return;

  cartDrawer.classList.add("translate-x-full");
  cartOverlay.classList.add("invisible", "opacity-0");

  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("overflow-hidden");
}

function changeDrawerQuantity(index, change) {
  if (!cart[index]) return;

  cart[index].quantity = Math.max(
    1,
    Number(cart[index].quantity || 1) + change
  );

  saveAndRefreshDrawer();
}

function removeDrawerItem(index) {
  if (index < 0 || index >= cart.length) return;

  cart.splice(index, 1);

  saveAndRefreshDrawer();
}

function saveAndRefreshDrawer() {
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  renderCartDrawer();
}

if (closeCartDrawerBtn) {
  closeCartDrawerBtn.addEventListener("click", closeCartDrawer);
}

if (continueShoppingBtn) {
  continueShoppingBtn.addEventListener("click", closeCartDrawer);
}

if (cartOverlay) {
  cartOverlay.addEventListener("click", closeCartDrawer);
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCartDrawer();
  }
});

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