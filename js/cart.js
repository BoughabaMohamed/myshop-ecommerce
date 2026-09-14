let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

displayCart();


function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;


    // Empty cart
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-16 text-center">

                    <div class="flex flex-col items-center">

                        <div class="text-5xl mb-4">
                            🛒
                        </div>

                        <h2 class="text-2xl font-bold text-gray-800 mb-2">
                            Your cart is empty
                        </h2>

                        <p class="text-gray-500 mb-6">
                            Add some products to your cart.
                        </p>

                        <a
                            href="products.html"
                            class="inline-block bg-blue-600
                            hover:bg-blue-700
                            text-white font-semibold
                            px-6 py-3 rounded-xl
                            transition duration-300"
                        >
                            Start Shopping
                        </a>

                    </div>

                </td>
            </tr>
        `;

        totalPrice.textContent = "Total: 0 DH";

        return;
    }


    // Display cart products
    cart.forEach((product, index) => {

        const subtotal =
            product.price * product.quantity;

        total += subtotal;


        cartItems.innerHTML += `
            <tr class="border-b border-gray-100
                       hover:bg-gray-50 transition">


                <!-- Image -->
                <td class="px-6 py-5">

                    <a href="product-details.html?id=${product.id}">

                        <div class="w-20 h-20 bg-gray-50
                                    rounded-xl p-2
                                    flex items-center justify-center">

                            <img
                                src="http://localhost:3000/uploads/${product.image}"
                                alt="${product.name}"
                                class="w-full h-full
                                       object-contain
                                       hover:scale-105
                                       transition duration-300"
                            >

                        </div>

                    </a>

                </td>


                <!-- Product -->
                <td class="px-6 py-5">

                    <a
                        href="product-details.html?id=${product.id}"
                        class="font-semibold text-gray-800
                               hover:text-blue-600
                               transition"
                    >
                        ${product.name}
                    </a>

                    <p class="text-sm text-gray-500 mt-1">
                        ${product.category || ""}
                    </p>

                </td>


                <!-- Price -->
                <td class="px-6 py-5">

                    <span class="font-semibold text-blue-600">
                        ${product.price} DH
                    </span>

                </td>


                <!-- Quantity -->
                <td class="px-6 py-5">

                    <div class="inline-flex items-center
                                border border-gray-200
                                rounded-xl overflow-hidden">

                        <button
                            onclick="decrease(${index})"
                            class="w-9 h-9
                                   flex items-center justify-center
                                   text-gray-600
                                   hover:bg-gray-100
                                   hover:text-blue-600
                                   transition"
                        >
                            −
                        </button>


                        <span
                            class="w-10 text-center
                                   font-semibold text-gray-800"
                        >
                            ${product.quantity}
                        </span>


                        <button
                            onclick="increase(${index})"
                            class="w-9 h-9
                                   flex items-center justify-center
                                   text-gray-600
                                   hover:bg-gray-100
                                   hover:text-blue-600
                                   transition"
                        >
                            +
                        </button>

                    </div>

                </td>


                <!-- Subtotal -->
                <td class="px-6 py-5">

                    <span class="font-bold text-gray-800">
                        ${subtotal} DH
                    </span>

                </td>


                <!-- Remove -->
                <td class="px-6 py-5">

                    <button
                        onclick="removeItem(${index})"
                        class="text-red-500
                               hover:text-red-700
                               hover:bg-red-50
                               px-3 py-2
                               rounded-lg
                               font-medium
                               transition"
                    >
                        Remove
                    </button>

                </td>

            </tr>
        `;
    });


    // Total
    totalPrice.textContent =
        "Total: " + total + " DH";


    // Save cart
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}



function increase(index) {

    cart[index].quantity++;

    displayCart();
}



function decrease(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    }

    displayCart();
}



function removeItem(index) {

    cart.splice(index, 1);

    displayCart();
}



function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }


    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );


    fetch("http://localhost:3000/orders", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            total_price: total,

            address: "Casablanca",

            cart: cart

        })

    })


    .then(async response => {

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Error while placing order."
            );
        }

        return data;

    })


    .then(data => {

        alert(
            data.message ||
            "Order placed successfully!"
        );


        cart = [];

        localStorage.removeItem("cart");

        displayCart();


        window.location.href =
            "products.html";

    })


    .catch(error => {

        console.error(
            "Checkout error:",
            error
        );

        alert(
            error.message ||
            "Error while placing order."
        );

    });

}