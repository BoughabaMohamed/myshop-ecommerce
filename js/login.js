const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    fetch("http://localhost:3000/users/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    })

    .then(res => res.json())

    .then(data => {

        if (data.message !== "Login successful") {
            alert(data.message);
            return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        if (data.user.role === "admin") {
            console.log('admin')
            window.location.href = "/admin/admin.html";
        } else {
            window.location.href = "products.html";
        }

    })

    .catch(err => console.log(err));

});