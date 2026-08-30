let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

displayCart();

function displayCart() {

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <tr>
                <td colspan="6">Your cart is empty.</td>
            </tr>
        `;

        totalPrice.textContent = "Total: 0 DH";
        return;
    }

    cart.forEach((product, index) => {

        const subtotal =
            product.price * product.quantity;

        total += subtotal;

        cartItems.innerHTML += `
            <tr>

                <td>
                    <img
                        src="../images/${product.image}"
                        alt="${product.name}"
                    >
                </td>

                <td>${product.name}</td>

                <td>${product.price} DH</td>

                <td>
                    <button onclick="decrease(${index})">
                        -
                    </button>

                    ${product.quantity}

                    <button onclick="increase(${index})">
                        +
                    </button>
                </td>

                <td>${subtotal} DH</td>

                <td>
                    <button
                        class="remove-btn"
                        onclick="removeItem(${index})"
                    >
                        Remove
                    </button>
                </td>

            </tr>
        `;
    });

    totalPrice.textContent =
        "Total: " + total + " DH";

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