// ================= AUTHENTICATION =================

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

// Check if user is logged in
if (!token || !user) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.replace("./admin-login.html");
}

// Check if user is admin
else if (user.role !== "admin") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.replace("../html/products.html");
}

// ================= LOGOUT =================

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Remove alternative token keys if used
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");

    window.location.replace("./admin-login.html");
}

window.logout = logout;
