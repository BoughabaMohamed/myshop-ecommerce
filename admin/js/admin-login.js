const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


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

        // Login failed
        if (!data.token || !data.user) {

            alert(
                data.message ||
                "Invalid email or password"
            );

            return;
        }


        // Make sure the account is admin
        if (data.user.role !== "admin") {

            alert("Access denied! Only administrators can access this panel.");

            return;
        }


        // Save admin information
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        localStorage.setItem(
            "token",
            data.token
        );


        // Go to Admin Panel
        window.location.href = "./admin.html";

    })

    .catch(err => {

        console.error(
            "Login error:",
            err
        );

        alert(
            "Something went wrong. Please try again."
        );

    });

});