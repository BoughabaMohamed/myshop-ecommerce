let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");
const subtotalPrice = document.getElementById("subtotalPrice");
const cartItemCount = document.getElementById("cartItemCount");
const checkoutButton = document.getElementById("checkoutButton");

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function displayCart() {
    cartItems.innerHTML = "";

    const total = cart.reduce((sum, item) =>
        sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

    const count = cart.reduce((sum, item) =>
        sum + (Number(item.quantity) || 0), 0);

    cartItemCount.textContent =
        `${count} ${count === 1 ? "item" : "items"}`;

    subtotalPrice.textContent = `${total} DH`;
    totalPrice.textContent = `${total} DH`;
    checkoutButton.disabled = cart.length === 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
          <div class="bg-white rounded-2xl border border-gray-100
                      p-8 text-center">
            <div class="w-16 h-16 mx-auto rounded-full bg-blue-50
                        flex items-center justify-center text-3xl mb-4">
              🛒
            </div>
            <h2 class="font-bold text-xl mb-2">Your cart is empty</h2>
            <p class="text-sm text-gray-500 mb-5">
              Find something you love and add it to your cart.
            </p>
            <a href="products.html"
               class="inline-block rounded-xl bg-blue-600
                      hover:bg-blue-700 text-white font-semibold
                      px-6 py-3">
              Start Shopping
            </a>
          </div>
        `;
        localStorage.setItem("cart", JSON.stringify(cart));
        return;
    }

    cart.forEach((product, index) => {
        const price = Number(product.price) || 0;
        const quantity = Number(product.quantity) || 1;
        const subtotal = price * quantity;
        const image = product.image
            ? `http://localhost:3000/uploads/${encodeURIComponent(product.image)}`
            : "";

        cartItems.insertAdjacentHTML("beforeend", `
          <article class="bg-white rounded-2xl border border-gray-100
                          p-3 sm:p-4 shadow-sm flex gap-3 sm:gap-4">

            <a href="product-details.html?id=${encodeURIComponent(product.id)}"
               class="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl
                      bg-blue-50 flex items-center justify-center p-2">
              ${image
                ? `<img src="${image}" alt="${escapeHTML(product.name)}"
                        class="w-full h-full object-contain"
                        onerror="this.style.display='none'">`
                : `<span class="text-3xl">📦</span>`}
            </a>

            <div class="flex-1 min-w-0 flex flex-col justify-between gap-3">
              <div>
                <div class="flex justify-between items-start gap-2">
                  <a href="product-details.html?id=${encodeURIComponent(product.id)}"
                     class="font-semibold text-sm sm:text-base
                            hover:text-blue-600 break-words">
                    ${escapeHTML(product.name)}
                  </a>

                  <button type="button" onclick="removeItem(${index})"
                    aria-label="Remove product"
                    class="shrink-0 w-8 h-8 rounded-full
                           text-gray-400 hover:text-red-500
                           hover:bg-red-50 text-xl">
                    ×
                  </button>
                </div>

                <p class="text-xs text-gray-500 mt-1">
                  ${escapeHTML(product.category || "")}
                </p>
                <p class="text-sm font-bold text-blue-600 mt-2">
                  ${price} DH
                </p>
              </div>

              <div class="flex items-center justify-between gap-2 flex-wrap">
                <div class="inline-flex items-center gap-3
                            rounded-full border border-gray-200 px-2 py-1">
                  <button type="button" onclick="decrease(${index})"
                    aria-label="Decrease quantity"
                    class="w-7 h-7 rounded-full text-lg
                           hover:bg-blue-50 hover:text-blue-600">−</button>

                  <span class="min-w-4 text-center text-sm font-semibold">
                    ${quantity}
                  </span>

                  <button type="button" onclick="increase(${index})"
                    aria-label="Increase quantity"
                    class="w-7 h-7 rounded-full text-lg
                           hover:bg-blue-50 hover:text-blue-600">+</button>
                </div>

                <span class="text-sm font-bold text-gray-800">
                  ${subtotal} DH
                </span>
              </div>
            </div>
          </article>
        `);
    });

    localStorage.setItem("cart", JSON.stringify(cart));
}

function increase(index) {
    if (!cart[index]) return;
    cart[index].quantity = Number(cart[index].quantity || 1) + 1;
    displayCart();
}

function decrease(index) {
    if (!cart[index]) return;

    if (Number(cart[index].quantity) > 1) {
        cart[index].quantity = Number(cart[index].quantity) - 1;
    }
    displayCart();
}

function removeItem(index) {
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    displayCart();
}

async function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty!", "warning");
        return;
    }

    const address = prompt("Please enter your delivery address:");
    if (address === null) return;

    if (!address.trim()) {
        showToast("Delivery address is required.", "warning");
        return;
    }

    const orderCart = cart.map(item => ({
        id: Number(item.id),
        quantity: Number(item.quantity)
    }));

    if (orderCart.some(item =>
        !Number.isInteger(item.id) || item.id <= 0 ||
        !Number.isInteger(item.quantity) || item.quantity <= 0
    )) {
        showToast("Your cart contains invalid product information.", "error");
        return;
    }

    try {
        checkoutButton.disabled = true;
        checkoutButton.textContent = "Processing...";

        const response = await fetch("http://localhost:3000/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                address: address.trim(),
                cart: orderCart
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error while placing order.");
        }

        showToast(
            `Order placed successfully! Order ID: ${data.orderId}`,
            "success"
        );

        cart = [];
        localStorage.removeItem("cart");
        displayCart();
        window.location.href = "products.html";

    } catch (error) {
        console.error("Checkout error:", error);
        showToast(error.message || "Error while placing order.", "error");
    } finally {
        checkoutButton.disabled = cart.length === 0;
        checkoutButton.textContent = "Next";
    }
}

displayCart();