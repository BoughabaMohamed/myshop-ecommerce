console.log("Admin orders JS loaded");

const API = "http://localhost:3000";

const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    "";

const ordersTable =
    document.getElementById("ordersTable");


// =====================================================
// LOAD ORDERS
// =====================================================

async function loadOrders() {

    if (!ordersTable) {
        console.error("ordersTable not found.");
        return;
    }

    try {

        // Loading
        ordersTable.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="px-6 py-12 text-center"
                >
                    <div class="text-4xl mb-3">
                        ⏳
                    </div>

                    <p class="text-lg font-semibold text-slate-700">
                        Loading orders...
                    </p>
                </td>
            </tr>
        `;


        const response = await fetch(
            API + "/orders",
            {
                headers: token
                    ? {
                        "Authorization": "Bearer " + token
                    }
                    : {}
            }
        );


        if (!response.ok) {
            throw new Error(
                "Failed to load orders."
            );
        }


        const data =
            await response.json();


        let orders = [];


        if (Array.isArray(data)) {

            orders = data;

        } else if (
            Array.isArray(data.orders)
        ) {

            orders = data.orders;
        }


        ordersTable.innerHTML = "";


        // =================================================
        // NO ORDERS
        // =================================================

        if (orders.length === 0) {

            ordersTable.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="px-6 py-12 text-center"
                    >

                        <div class="text-4xl mb-3">
                            📦
                        </div>

                        <p class="text-lg font-semibold text-slate-700">
                            No orders found
                        </p>

                        <p class="text-sm text-slate-500 mt-1">
                            There are no customer orders yet.
                        </p>

                    </td>
                </tr>
            `;

            return;
        }


        // =================================================
        // DISPLAY ORDERS
        // =================================================

        orders.forEach(order => {

            let statusClass =
                "bg-slate-100 text-slate-700";


            if (order.status === "Pending") {

                statusClass =
                    "bg-yellow-100 text-yellow-700";

            }

            else if (
                order.status === "Processing"
            ) {

                statusClass =
                    "bg-blue-100 text-blue-700";

            }

            else if (
                order.status === "Delivered"
            ) {

                statusClass =
                    "bg-green-100 text-green-700";

            }

            else if (
                order.status === "Cancelled"
            ) {

                statusClass =
                    "bg-red-100 text-red-700";
            }


            ordersTable.innerHTML += `

                <tr
                    class="border-b border-slate-100 hover:bg-slate-50 transition"
                >

                    <!-- ID -->

                    <td
                        class="px-5 py-4 text-sm font-semibold text-slate-800 whitespace-nowrap"
                    >
                        #${escapeHTML(order.id)}
                    </td>


                    <!-- USER -->

                    <td
                        class="px-5 py-4 text-sm text-slate-700 whitespace-nowrap"
                    >
                        ${escapeHTML(order.user_name)}
                    </td>


                    <!-- TOTAL -->

                    <td
                        class="px-5 py-4 text-sm font-bold text-blue-600 whitespace-nowrap"
                    >
                        ${escapeHTML(order.total_price)} DH
                    </td>


                    <!-- ADDRESS -->

                    <td
                        class="px-5 py-4 text-sm text-slate-600"
                    >
                        ${escapeHTML(order.address)}
                    </td>


                    <!-- STATUS -->

                    <td class="px-5 py-4">

                        <span
                            class="${statusClass} inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                        >
                            ${escapeHTML(order.status)}
                        </span>

                    </td>


                    <!-- DATE -->

                    <td
                        class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap"
                    >
                        ${escapeHTML(order.order_date)}
                    </td>


                    <!-- ACTION -->

                    <td class="px-5 py-4">

                        <select
                            onchange="updateStatus(${Number(order.id)}, this.value)"
                            class="border border-slate-200 bg-white text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        >

                            <option
                                value="Pending"
                                ${order.status === "Pending" ? "selected" : ""}
                            >
                                Pending
                            </option>


                            <option
                                value="Processing"
                                ${order.status === "Processing" ? "selected" : ""}
                            >
                                Processing
                            </option>


                            <option
                                value="Delivered"
                                ${order.status === "Delivered" ? "selected" : ""}
                            >
                                Delivered
                            </option>


                            <option
                                value="Cancelled"
                                ${order.status === "Cancelled" ? "selected" : ""}
                            >
                                Cancelled
                            </option>

                        </select>

                    </td>

                </tr>

            `;
        });


    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        ordersTable.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="px-6 py-12 text-center"
                >

                    <div class="text-4xl mb-3">
                        ⚠️
                    </div>

                    <p class="text-lg font-semibold text-slate-700">
                        Failed to load orders
                    </p>

                    <p class="text-sm text-slate-500 mt-1">
                        Please check that your server is running.
                    </p>

                </td>
            </tr>
        `;
    }
}


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

async function updateStatus(id, status) {

    try {

        const response = await fetch(
            API + "/orders/" + id,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    ...(token
                        ? {
                            "Authorization":
                                "Bearer " + token
                        }
                        : {})
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update order status."
            );
        }


        console.log(
            "Order updated:",
            data
        );


        // إذا كان admin-popup.js موجود
        if (typeof showPopup === "function") {

            showPopup(
                data.message ||
                "Order status updated successfully.",
                "success",
                "Success"
            );

        } else {

            alert(
                data.message ||
                "Order status updated successfully."
            );
        }


        await loadOrders();


    } catch (error) {

        console.error(
            "Error updating order:",
            error
        );


        if (typeof showPopup === "function") {

            showPopup(
                error.message ||
                "Failed to update order status.",
                "error",
                "Error"
            );

        } else {

            alert(
                error.message ||
                "Failed to update order status."
            );
        }
    }
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// =====================================================
// MAKE FUNCTION AVAILABLE TO HTML
// =====================================================

window.updateStatus = updateStatus;


// =====================================================
// START
// =====================================================

loadOrders();