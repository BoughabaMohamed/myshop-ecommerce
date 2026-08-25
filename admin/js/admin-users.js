console.log("Admin Users JS loaded");


// =====================================================
// API
// =====================================================

const USERS_API = "http://localhost:3000/users";


// =====================================================
// HTML ELEMENTS
// =====================================================

const usersContainer =
    document.getElementById("usersContainer");

const userSearch =
    document.getElementById("userSearch");

const usersCount =
    document.getElementById("usersCount");

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// VARIABLES
// =====================================================

let users = [];


// =====================================================
// GET TOKEN
// =====================================================

function getToken() {

    return (
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken") ||
        ""
    );

}


// =====================================================
// POPUP
// =====================================================

function showPopup(title, text, type = "success") {

    const popup =
        document.getElementById("popup");

    const popupTitle =
        document.getElementById("popupTitle");

    const popupMessage =
        document.getElementById("popupMessage");

    const popupIcon =
        document.getElementById("popupIcon");


    if (!popup) {

        console.error(
            "Popup not found."
        );

        return;
    }


    if (popupTitle) {
        popupTitle.textContent = title;
    }


    if (popupMessage) {
        popupMessage.textContent = text;
    }


    if (popupIcon) {

        if (type === "success") {

            popupIcon.textContent = "✓";

        } else if (type === "error") {

            popupIcon.textContent = "!";

        } else {

            popupIcon.textContent = "?";

        }

    }


    popup.classList.add("show");

}


// =====================================================
// CLOSE POPUP
// =====================================================

function closePopup() {

    const popup =
        document.getElementById("popup");


    if (popup) {

        popup.classList.remove("show");

    }

}


// =====================================================
// POPUP BUTTONS
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const popupOk =
            document.getElementById("popupOk");

        const popupClose =
            document.getElementById("popupClose");

        const popup =
            document.getElementById("popup");


        if (popupOk) {

            popupOk.addEventListener(
                "click",
                closePopup
            );

        }


        if (popupClose) {

            popupClose.addEventListener(
                "click",
                closePopup
            );

        }


        if (popup) {

            popup.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === popup
                    ) {

                        closePopup();

                    }

                }
            );

        }

    }
);


// =====================================================
// LOAD USERS
// =====================================================

async function loadUsers() {

    try {

        const token =
            getToken();


        // ---------------------------------------------
        // CHECK TOKEN
        // ---------------------------------------------

        if (!token) {

            console.error(
                "No token found."
            );


            if (usersContainer) {

                usersContainer.innerHTML = `

                    <tr>

                        <td
                            colspan="5"
                            class="empty-row"
                        >
                            Please login as admin.
                        </td>

                    </tr>

                `;

            }


            return;
        }


        // ---------------------------------------------
        // REQUEST
        // ---------------------------------------------

        const response =
            await fetch(
                USERS_API,
                {
                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        console.log(
            "Users status:",
            response.status
        );


        // ---------------------------------------------
        // ERROR
        // ---------------------------------------------

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Users API error:",
                errorText
            );


            throw new Error(
                "Failed to load users: " +
                response.status
            );

        }


        // ---------------------------------------------
        // DATA
        // ---------------------------------------------

        const data =
            await response.json();


        console.log(
            "Users response:",
            data
        );


        // ---------------------------------------------
        // SUPPORT ARRAY OR OBJECT
        // ---------------------------------------------

        if (Array.isArray(data)) {

            users = data;

        } else if (
            Array.isArray(data.users)
        ) {

            users = data.users;

        } else {

            users = [];

        }


        // ---------------------------------------------
        // COUNT
        // ---------------------------------------------

        if (usersCount) {

            usersCount.textContent =
                users.length;

        }


        // ---------------------------------------------
        // DISPLAY
        // ---------------------------------------------

        displayUsers(users);


    } catch (error) {

        console.error(
            "Users error:",
            error
        );


        if (usersContainer) {

            usersContainer.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="empty-row"
                    >
                        Error loading users.
                    </td>

                </tr>

            `;

        }


        showPopup(
            "Error",
            "Unable to load users.",
            "error"
        );

    }

}


// =====================================================
// DISPLAY USERS IN TABLE
// =====================================================

function displayUsers(list) {

    if (!usersContainer) {

        console.error(
            "#usersContainer not found."
        );

        return;
    }


    usersContainer.innerHTML = "";


    // ---------------------------------------------
    // EMPTY
    // ---------------------------------------------

    if (
        !list ||
        list.length === 0
    ) {

        usersContainer.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-row"
                >
                    No users found.
                </td>

            </tr>

        `;

        return;

    }


    // ---------------------------------------------
    // CREATE ROWS
    // ---------------------------------------------

    list.forEach(user => {

        const row =
            document.createElement("tr");


        // -----------------------------------------
        // USER ID
        // -----------------------------------------

        const userId =
            user.id ||
            user._id ||
            "";


        // -----------------------------------------
        // NAME
        // -----------------------------------------

        const name =
            user.name ||
            user.username ||
            "No name";


        // -----------------------------------------
        // EMAIL
        // -----------------------------------------

        const email =
            user.email ||
            "No email";


        // -----------------------------------------
        // ROLE
        // -----------------------------------------

        const role =
            user.role ||
            "user";


        // -----------------------------------------
        // ROLE CLASS
        // -----------------------------------------

        const roleClass =
            String(role).toLowerCase() === "admin"
                ? "role-admin"
                : "role-user";


        // -----------------------------------------
        // ROW
        // -----------------------------------------

        row.innerHTML = `

            <td>
                ${escapeHTML(userId)}
            </td>


            <td class="name-cell">

                <strong>
                    ${escapeHTML(name)}
                </strong>

            </td>


            <td>

                ${escapeHTML(email)}

            </td>


            <td>

                <span class="role-badge ${roleClass}">

                    ${escapeHTML(role)}

                </span>

            </td>


            <td class="actions">

                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteUser('${escapeHTML(userId)}')"
                >
                    Delete
                </button>

            </td>

        `;


        usersContainer.appendChild(row);

    });

}


// =====================================================
// SEARCH USERS
// =====================================================

if (userSearch) {

    userSearch.addEventListener(
        "input",
        function () {

            const value =
                userSearch.value
                    .toLowerCase()
                    .trim();


            // Show all

            if (!value) {

                displayUsers(users);

                return;

            }


            // Filter

            const filtered =
                users.filter(user => {

                    const name =
                        String(
                            user.name ||
                            user.username ||
                            ""
                        )
                        .toLowerCase();


                    const email =
                        String(
                            user.email ||
                            ""
                        )
                        .toLowerCase();


                    const role =
                        String(
                            user.role ||
                            ""
                        )
                        .toLowerCase();


                    return (

                        name.includes(value) ||

                        email.includes(value) ||

                        role.includes(value)

                    );

                });


            displayUsers(filtered);

        }
    );

}


// =====================================================
// DELETE USER
// =====================================================

async function deleteUser(id) {

    // ---------------------------------------------
    // SHOW CONFIRMATION POPUP
    // ---------------------------------------------

    showPopup(
        "Delete User",
        "Are you sure you want to delete this user?",
        "warning"
    );


    const popupOk =
        document.getElementById("popupOk");


    if (!popupOk) {

        console.error(
            "#popupOk not found."
        );

        return;

    }


    // ---------------------------------------------
    // REPLACE OK ACTION
    // ---------------------------------------------

    popupOk.onclick =
        async function () {

            closePopup();


            try {

                const token =
                    getToken();


                if (!token) {

                    showPopup(
                        "Error",
                        "You are not logged in.",
                        "error"
                    );

                    return;

                }


                // ---------------------------------
                // DELETE REQUEST
                // ---------------------------------

                const response =
                    await fetch(
                        USERS_API + "/" + id,
                        {
                            method: "DELETE",

                            headers: {

                                "Authorization":
                                    "Bearer " + token

                            }

                        }
                    );


                console.log(
                    "Delete user status:",
                    response.status
                );


                // ---------------------------------
                // RESPONSE
                // ---------------------------------

                let data = {};


                try {

                    data =
                        await response.json();

                } catch {

                    data = {};

                }


                // ---------------------------------
                // ERROR
                // ---------------------------------

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to delete user."
                    );

                }


                // ---------------------------------
                // REMOVE FROM ARRAY
                // ---------------------------------

                users =
                    users.filter(
                        user =>
                            String(
                                user.id ||
                                user._id
                            ) !== String(id)
                    );


                // ---------------------------------
                // UPDATE COUNT
                // ---------------------------------

                if (usersCount) {

                    usersCount.textContent =
                        users.length;

                }


                // ---------------------------------
                // DISPLAY
                // ---------------------------------

                displayUsers(users);


                // ---------------------------------
                // SUCCESS POPUP
                // ---------------------------------

                showPopup(
                    "Success",
                    data.message ||
                    "User deleted successfully.",
                    "success"
                );


            } catch (error) {

                console.error(
                    "Delete user error:",
                    error
                );


                showPopup(
                    "Error",
                    error.message ||
                    "User could not be deleted.",
                    "error"
                );

            }

        };

}


// =====================================================
// LOGOUT
// =====================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            showPopup(
                "Logout",
                "Are you sure you want to logout?",
                "warning"
            );


            const popupOk =
                document.getElementById(
                    "popupOk"
                );


            if (popupOk) {

                popupOk.onclick =
                    function () {

                        localStorage.removeItem(
                            "token"
                        );

                        localStorage.removeItem(
                            "authToken"
                        );

                        localStorage.removeItem(
                            "accessToken"
                        );

                        localStorage.removeItem(
                            "user"
                        );


                        sessionStorage.removeItem(
                            "token"
                        );

                        sessionStorage.removeItem(
                            "authToken"
                        );

                        sessionStorage.removeItem(
                            "accessToken"
                        );

                        sessionStorage.removeItem(
                            "user"
                        );


                        window.location.href =
                            "../html/login.html";

                    };

            }

        }
    );

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

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// =====================================================
// GLOBAL FUNCTION
// =====================================================

window.deleteUser =
    deleteUser;


// =====================================================
// START
// =====================================================

loadUsers();