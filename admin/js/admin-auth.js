const token = localStorage.getItem("token");

const user = JSON.parse(localStorage.getItem("user"));


// Check if user is logged in

if (!token || !user) {

    alert("Please login first.");

    window.location.href = "./admin-login.html";

}


// Check if user is admin

else if (user.role !== "admin") {

    alert("Access denied!");

    window.location.href = "../html/products.html";

}