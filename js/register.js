const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", () => {

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!fullname || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    fetch("http://localhost:3000/users/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            fullname,
            email,
            password
        })

    })

    .then(res => res.json())

    .then(data => {

        if (data.message === "User registered successfully") {

            alert("Account created successfully!");

            window.location.href = "login.html";

        } else {

            alert(data.message);

        }

    })

    .catch(error => {

        console.log(error);

        alert("Server error!");

    });

});