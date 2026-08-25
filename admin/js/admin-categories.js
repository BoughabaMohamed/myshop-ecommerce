console.log("Admin categories JS loaded");

const API = "http://localhost:3000";

const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoriesContainer = document.getElementById("categoriesContainer");
const message = document.getElementById("message");


// =====================================================
// POPUP
// =====================================================

function showPopup(title, text, type = "success") {

    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popupTitle");
    const popupMessage = document.getElementById("popupMessage");
    const popupIcon = document.getElementById("popupIcon");

    if (!popup) return;

    popupTitle.textContent = title;
    popupMessage.textContent = text;

    if (type === "error") {
        popupIcon.textContent = "✕";
        popupIcon.className = "popup-icon error";
    } else {
        popupIcon.textContent = "✓";
        popupIcon.className = "popup-icon";
    }

    popup.classList.add("show");
}


function closePopup() {

    const popup = document.getElementById("popup");

    if (popup) {
        popup.classList.remove("show");
    }
}


// Popup buttons

const popupOk = document.getElementById("popupOk");
const popupClose = document.getElementById("popupClose");

if (popupOk) {
    popupOk.addEventListener("click", closePopup);
}

if (popupClose) {
    popupClose.addEventListener("click", closePopup);
}


// Close when clicking outside popup

const popup = document.getElementById("popup");

if (popup) {

    popup.addEventListener("click", function (event) {

        if (event.target === popup) {
            closePopup();
        }

    });

}


// =====================================================
// TOKEN
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
// LOGOUT
// =====================================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (event) {

        event.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");

        window.location.href = "../html/login.html";

    });

}


// =====================================================
// LOAD CATEGORIES
// =====================================================

loadCategories();


async function loadCategories() {

    try {

        const response = await fetch(
            API + "/categories"
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load categories"
            );

        }


        const data = await response.json();


        let categories = [];


        if (Array.isArray(data)) {

            categories = data;

        } else if (Array.isArray(data.categories)) {

            categories = data.categories;

        }


        console.log(
            "Categories:",
            categories
        );


        displayCategories(categories);


    } catch (error) {

        console.error(
            "Categories error:",
            error
        );


        categoriesContainer.innerHTML = `

            <div class="empty-row">

                Unable to load categories.

            </div>

        `;

    }

}


// =====================================================
// DISPLAY CATEGORIES
// =====================================================

function displayCategories(categories) {

    categoriesContainer.innerHTML = "";


    if (!categories || categories.length === 0) {

        categoriesContainer.innerHTML = `

            <div class="empty-row">

                No categories found.

            </div>

        `;

        return;

    }


    // Create table

    const table = document.createElement("table");

    table.className = "admin-table";


    table.innerHTML = `

        <thead>

            <tr>

                <th>ID</th>

                <th>Category Name</th>

                <th>Actions</th>

            </tr>

        </thead>

        <tbody></tbody>

    `;


    const tbody = table.querySelector("tbody");


    categories.forEach(category => {

        const id =
            category.id ||
            category._id ||
            "";


        const name =
            category.name ||
            category.title ||
            "No name";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${id}
            </td>


            <td class="category-name-cell">
                ${escapeHTML(name)}
            </td>


            <td>

                <button
                    type="button"
                    class="delete-btn"
                    data-id="${id}"
                >
                    🗑️ Delete
                </button>

            </td>

        `;


        const deleteButton =
            row.querySelector(".delete-btn");


        deleteButton.addEventListener(
            "click",
            function () {

                deleteCategory(id);

            }
        );


        tbody.appendChild(row);

    });


    categoriesContainer.appendChild(table);

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
// ADD CATEGORY
// =====================================================

if (categoryForm) {

    categoryForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                categoryName.value.trim();


            if (!name) {

                showPopup(
                    "Error",
                    "Please enter a category name.",
                    "error"
                );

                return;

            }


            const token = getToken();


            try {

                const response = await fetch(
                    API + "/categories",
                    {

                        method: "POST",

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
                            name: name
                        })

                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Category could not be added."
                    );

                }


                console.log(
                    "Category added:",
                    data
                );


                categoryForm.reset();


                showPopup(
                    "Success",
                    data.message ||
                    "Category added successfully.",
                    "success"
                );


                await loadCategories();


            } catch (error) {

                console.error(
                    "Add category error:",
                    error
                );


                showPopup(
                    "Error",
                    error.message ||
                    "Category could not be added.",
                    "error"
                );

            }

        }
    );

}


// =====================================================
// DELETE CATEGORY
// =====================================================

async function deleteCategory(id) {

    // بدل confirm()
    const confirmed =
        await showConfirmPopup(
            "Delete Category",
            "Are you sure you want to delete this category?"
        );


    if (!confirmed) {
        return;
    }


    const token = getToken();


    try {

        const response = await fetch(

            API + "/categories/" + id,

            {

                method: "DELETE",

                headers: {

                    ...(token
                        ? {
                            "Authorization":
                                "Bearer " + token
                        }
                        : {})

                }

            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Category could not be deleted."
            );

        }


        console.log(
            "Category deleted:",
            data
        );


        showPopup(
            "Success",
            data.message ||
            "Category deleted successfully.",
            "success"
        );


        await loadCategories();


    } catch (error) {

        console.error(
            "Delete category error:",
            error
        );


        showPopup(
            "Error",
            error.message ||
            "Category could not be deleted.",
            "error"
        );

    }

}


// =====================================================
// CONFIRM POPUP
// =====================================================

function showConfirmPopup(title, text) {

    return new Promise(resolve => {

        const popup =
            document.getElementById("popup");

        const popupTitle =
            document.getElementById("popupTitle");

        const popupMessage =
            document.getElementById("popupMessage");

        const popupIcon =
            document.getElementById("popupIcon");

        const popupOk =
            document.getElementById("popupOk");

        const popupClose =
            document.getElementById("popupClose");


        if (!popup) {

            resolve(false);

            return;

        }


        popupTitle.textContent =
            title;

        popupMessage.textContent =
            text;

        popupIcon.textContent =
            "?";


        popup.className =
            "popup show";


        popupOk.textContent =
            "Yes";


        function yes() {

            cleanup();

            resolve(true);

        }


        function no() {

            cleanup();

            resolve(false);

        }


        function cleanup() {

            popup.classList.remove("show");

            popupOk.textContent =
                "OK";

            popupOk.removeEventListener(
                "click",
                yes
            );

            popupClose.removeEventListener(
                "click",
                no
            );

        }


        popupOk.addEventListener(
            "click",
            yes
        );

        popupClose.addEventListener(
            "click",
            no
        );

    });

}