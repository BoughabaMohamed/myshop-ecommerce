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

const logoutBtnMobile =
    document.getElementById("logoutBtnMobile");


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
        console.error("Popup not found.");
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

            popupIcon.className =
                "w-14 h-14 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl font-bold mb-4";

        } else if (type === "error") {

            popupIcon.textContent = "!";

            popupIcon.className =
                "w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold mb-4";

        } else {

            popupIcon.textContent = "?";

            popupIcon.className =
                "w-14 h-14 mx-auto rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl font-bold mb-4";

        }

    }


    popup.classList.remove("hidden");
    popup.classList.add("flex");

}


// =====================================================
// CLOSE POPUP
// =====================================================

function closePopup() {

    const popup =
        document.getElementById("popup");


    if (popup) {

        popup.classList.add("hidden");
        popup.classList.remove("flex");

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

                    if (event.target === popup) {

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

        const token = getToken();


        // ---------------------------------------------
        // CHECK TOKEN
        // ---------------------------------------------

        if (!token) {

            console.error("No token found.");


            if (usersContainer) {

                usersContainer.innerHTML = `
                    <div class="p-8 text-center">

                        <div class="text-red-500 font-semibold">
                            Please login as admin.
                        </div>

                    </div>
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
                        "Authorization": "Bearer " + token
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
                <div class="p-8 text-center">

                    <div class="text-red-500 font-semibold">
                        Error loading users.
                    </div>

                    <p class="text-sm text-gray-500 mt-2">
                        Please check that the server is running.
                    </p>

                </div>
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
// DISPLAY USERS
// =====================================================

function displayUsers(list) {

    if (!usersContainer) {

        console.error(
            "#usersContainer not found."
        );

        return;
    }


    // ---------------------------------------------
    // EMPTY
    // ---------------------------------------------

    if (
        !list ||
        list.length === 0
    ) {

        usersContainer.innerHTML = `
            <div class="p-10 text-center">

                <div class="text-gray-400 text-4xl mb-3">
                    👤
                </div>

                <p class="text-gray-500 font-medium">
                    No users found.
                </p>

            </div>
        `;

        return;
    }


    // ---------------------------------------------
    // TABLE
    // ---------------------------------------------

    usersContainer.innerHTML = `

        <table class="w-full min-w-[700px]">

            <thead class="bg-gray-50 border-b border-gray-200">

                <tr>

                    <th class="px-5 py-4 text-left text-xs
                               font-semibold text-gray-500 uppercase">
                        ID
                    </th>

                    <th class="px-5 py-4 text-left text-xs
                               font-semibold text-gray-500 uppercase">
                        Name
                    </th>

                    <th class="px-5 py-4 text-left text-xs
                               font-semibold text-gray-500 uppercase">
                        Email
                    </th>

                    <th class="px-5 py-4 text-left text-xs
                               font-semibold text-gray-500 uppercase">
                        Role
                    </th>

                    <th class="px-5 py-4 text-left text-xs
                               font-semibold text-gray-500 uppercase">
                        Actions
                    </th>

                </tr>

            </thead>

            <tbody id="usersTableBody"
                   class="divide-y divide-gray-100">

            </tbody>

        </table>

    `;


    const tableBody =
        document.getElementById("usersTableBody");


    if (!tableBody) return;


    // ---------------------------------------------
    // CREATE ROWS
    // ---------------------------------------------

    list.forEach(user => {

        const row =
            document.createElement("tr");


        row.className =
            "hover:bg-gray-50 transition";


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


        const isAdmin =
            String(role).toLowerCase() === "admin";


        // -----------------------------------------
        // ROW
        // -----------------------------------------

        row.innerHTML = `

            <!-- ID -->

            <td class="px-5 py-4">

                <span class="text-sm text-gray-500">
                    ${escapeHTML(userId)}
                </span>

            </td>


            <!-- NAME -->

            <td class="px-5 py-4">

                <div class="font-semibold text-gray-900">
                    ${escapeHTML(name)}
                </div>

            </td>


            <!-- EMAIL -->

            <td class="px-5 py-4">

                <span class="text-sm text-gray-600">
                    ${escapeHTML(email)}
                </span>

            </td>


            <!-- ROLE -->

            <td class="px-5 py-4">

                ${
                    isAdmin
                        ? `
                            <span class="inline-flex items-center
                                   px-3 py-1 rounded-full
                                   text-xs font-semibold
                                   bg-purple-100 text-purple-700">
                                Admin
                            </span>
                          `
                        : `
                            <span class="inline-flex items-center
                                   px-3 py-1 rounded-full
                                   text-xs font-semibold
                                   bg-blue-100 text-blue-700">
                                User
                            </span>
                          `
                }

            </td>


            <!-- ACTION -->

            <td class="px-5 py-4">

                <button
                    type="button"
                    onclick="deleteUser('${escapeHTML(userId)}')"
                    class="px-3 py-2 bg-red-600 text-white
                           text-sm font-semibold rounded-lg
                           hover:bg-red-700 transition"
                >
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

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


            // -----------------------------------------
            // SHOW ALL
            // -----------------------------------------

            if (!value) {

                displayUsers(users);

                return;

            }


            // -----------------------------------------
            // FILTER
            // -----------------------------------------

            const filtered =
                users.filter(user => {

                    const name =
                        String(
                            user.name ||
                            user.username ||
                            ""
                        ).toLowerCase();


                    const email =
                        String(
                            user.email ||
                            ""
                        ).toLowerCase();


                    const role =
                        String(
                            user.role ||
                            ""
                        ).toLowerCase();


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

    const user =
        users.find(
            user =>
                String(
                    user.id ||
                    user._id
                ) === String(id)
        );


    const userName =
        user?.name ||
        user?.username ||
        "this user";


    // ---------------------------------------------
    // CONFIRMATION
    // ---------------------------------------------

    const confirmed =
        confirm(
            `Are you sure you want to delete "${userName}"?`
        );


    if (!confirmed) return;


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


        // -----------------------------------------
        // DELETE REQUEST
        // -----------------------------------------

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


        // -----------------------------------------
        // RESPONSE
        // -----------------------------------------

        let data = {};


        try {

            data =
                await response.json();

        } catch {

            data = {};

        }


        // -----------------------------------------
        // ERROR
        // -----------------------------------------

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete user."
            );

        }


        // -----------------------------------------
        // REMOVE FROM ARRAY
        // -----------------------------------------

        users =
            users.filter(
                user =>
                    String(
                        user.id ||
                        user._id
                    ) !== String(id)
            );


        // -----------------------------------------
        // UPDATE COUNT
        // -----------------------------------------

        if (usersCount) {

            usersCount.textContent =
                users.length;

        }


        // -----------------------------------------
        // DISPLAY
        // -----------------------------------------

        displayUsers(users);


        // -----------------------------------------
        // SUCCESS
        // -----------------------------------------

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

}


// =====================================================
// LOGOUT
// =====================================================

function logout(event) {

    if (event) {
        event.preventDefault();
    }


    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");


    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");


    window.location.href =
        "../html/login.html";

}


// Desktop logout

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logout
    );

}


// Mobile logout

if (logoutBtnMobile) {

    logoutBtnMobile.addEventListener(
        "click",
        logout
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