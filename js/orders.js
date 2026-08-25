const token = localStorage.getItem("token");
const ordersTable = document.getElementById("ordersTable");

loadOrders();

function loadOrders() {

    fetch("http://localhost:3000/orders")
    .then(res => res.json())
    .then(orders => {

        ordersTable.innerHTML = "";

        orders.forEach(order => {

            ordersTable.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.user_name}</td>
                <td>${order.total_price} DH</td>
                <td>${order.address}</td>
                <td>${order.status}</td>
                <td>${order.order_date}</td>

                <td>

                    <select onchange="updateStatus(${order.id}, this.value)">
                        <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>

                        <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>

                        <option value="Delivered" ${order.status === "Delivered" ? "selected" : ""}>Delivered</option>

                        <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>

                    </select>

                </td>

            </tr>
            `;

        });

    });

}

function updateStatus(id, status){

    fetch("http://localhost:3000/orders/" + id, {

        method: "PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            status: status
        })

    })

    .then(res=>res.json())

    .then(data=>{

        alert(data.message);

        loadOrders();

    })

    .catch(err=>console.log(err));

}