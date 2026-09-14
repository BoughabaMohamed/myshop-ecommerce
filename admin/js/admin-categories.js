console.log("Admin categories JS loaded");


// =====================================================
// API
// =====================================================

const API = "http://localhost:3000";


// =====================================================
// DOM
// =====================================================

const categoryForm =
    document.getElementById("categoryForm");

const categoryName =
    document.getElementById("categoryName");

const categoriesContainer =
    document.getElementById("categoriesContainer");

const message =
    document.getElementById("message");


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

function logout() {

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


const logoutBtn =
    document.getElementById("logoutBtn");

const logoutBtnMobile =
    document.getElementById("logoutBtnMobile");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();
        }
    );
}


if (logoutBtnMobile) {

    logoutBtnMobile.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            logout();
        }
    );
}


// =====================================================
// LOAD CATEGORIES
// =====================================================

async function loadCategories() {

    try {

        categoriesContainer.innerHTML = `
            <div class="flex items-center justify-center py-10 text-slate-500">
                <div class="text-center">
                    <div class="text-3xl mb-2">⏳</div>
                    <p>Loading categories...</p>
                </div>
            </div>
        `;


        const response =
            await fetch(
                API + "/categories"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load categories."
            );
        }


        const data =
            await response.json();


        let categories = [];


        if (Array.isArray(data)) {

            categories = data;

        }

        else if (
            Array.isArray(data.categories)
        ) {

            categories = data.categories;
        }


        console.log(
            "Categories:",
            categories
        );


        displayCategories(
            categories
        );


    }

    catch (error) {

        console.error(
            "Categories error:",
            error
        );


        categoriesContainer.innerHTML = `
            <div class="bg-red-50 border border-red-200 text-red-600 rounded-xl p-5 text-center">
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


    if (
        !categories ||
        categories.length === 0
    ) {

        categoriesContainer.innerHTML = `
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">

                <div class="text-4xl mb-3">
                    📂
                </div>

                <h3 class="text-lg font-semibold text-slate-700">
                    No categories found
                </h3>

                <p class="text-sm text-slate-500 mt-1">
                    Add your first category above.
                </p>

            </div>
        `;

        return;
    }


    // =================================================
    // TABLE WRAPPER
    // =================================================

    const tableWrapper =
        document.createElement("div");

    tableWrapper.className =
        "overflow-x-auto rounded-xl border border-slate-200";


    // =================================================
    // TABLE
    // =================================================

    const table =
        document.createElement("table");

    table.className =
        "min-w-full divide-y divide-slate-200";


    table.innerHTML = `

        <thead class="bg-slate-50">

            <tr>

                <th
                    class="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                    ID
                </th>


                <th
                    class="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                    Category Name
                </th>


                <th
                    class="px-5 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                    Actions
                </th>

            </tr>

        </thead>


        <tbody
            class="bg-white divide-y divide-slate-200"
        ></tbody>

    `;


    const tbody =
        table.querySelector("tbody");


    // =================================================
    // CATEGORIES
    // =================================================

    categories.forEach(
        category => {

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


            row.className =
                "hover:bg-slate-50 transition";


            row.innerHTML = `

                <!-- ID -->

                <td
                    class="px-5 py-4 whitespace-nowrap text-sm text-slate-500"
                >
                    ${escapeHTML(id)}
                </td>


                <!-- NAME -->

                <td
                    class="px-5 py-4 whitespace-nowrap"
                >

                    <div
                        class="flex items-center gap-3"
                    >

                        <div
                            class="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"
                        >
                            📁
                        </div>


                        <span
                            class="font-medium text-slate-800"
                        >
                            ${escapeHTML(name)}
                        </span>

                    </div>

                </td>


                <!-- ACTIONS -->

                <td
                    class="px-5 py-4 whitespace-nowrap text-right"
                >

                    <button
                        type="button"
                        class="delete-btn inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                        data-id="${escapeHTML(id)}"
                    >
                        🗑️
                        <span>Delete</span>
                    </button>

                </td>

            `;


            const deleteButton =
                row.querySelector(
                    ".delete-btn"
                );


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteCategory(id);

                }
            );


            tbody.appendChild(row);

        }
    );


    tableWrapper.appendChild(table);

    categoriesContainer.appendChild(
        tableWrapper
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
                    "Please enter a category name.",
                    "error",
                    "Error"
                );

                return;
            }


            const token =
                getToken();


            try {

                const response =
                    await fetch(
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

                            body:
                                JSON.stringify({
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
                    data.message ||
                    "Category added successfully.",
                    "success",
                    "Success"
                );


                await loadCategories();

            }

            catch (error) {

                console.error(
                    "Add category error:",
                    error
                );


                showPopup(
                    error.message ||
                    "Category could not be added.",
                    "error",
                    "Error"
                );
            }

        }
    );
}


// =====================================================
// DELETE CATEGORY
// =====================================================

async function deleteCategory(id) {

    const confirmed =
        await showConfirmPopup(
            "Delete Category",
            "Are you sure you want to delete this category?"
        );


    if (!confirmed) {
        return;
    }


    const token =
        getToken();


    try {

        const response =
            await fetch(
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
            data.message ||
            "Category deleted successfully.",
            "success",
            "Success"
        );


        await loadCategories();

    }

    catch (error) {

        console.error(
            "Delete category error:",
            error
        );


        showPopup(
            error.message ||
            "Category could not be deleted.",
            "error",
            "Error"
        );
    }
}


// =====================================================
// CONFIRM POPUP
// =====================================================

function showConfirmPopup(
    title,
    text
) {

    return new Promise(
        resolve => {

            const popup =
                document.getElementById(
                    "popup"
                );

            const popupTitle =
                document.getElementById(
                    "popupTitle"
                );

            const popupMessage =
                document.getElementById(
                    "popupMessage"
                );

            const popupIcon =
                document.getElementById(
                    "popupIcon"
                );

            const popupOk =
                document.getElementById(
                    "popupOk"
                );

            const popupClose =
                document.getElementById(
                    "popupClose"
                );


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


            popupIcon.className =
                "mx-auto mb-4 w-14 h-14 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl font-bold";


            popupOk.textContent =
                "Yes";


            popup.classList.remove(
                "hidden"
            );

            popup.classList.add(
                "flex"
            );


            function yes() {

                cleanup();

                resolve(true);
            }


            function no() {

                cleanup();

                resolve(false);
            }


            function cleanup() {

                popup.classList.add(
                    "hidden"
                );

                popup.classList.remove(
                    "flex"
                );


                popupOk.textContent =
                    "OK";


                popupOk.removeEventListener(
                    "click",
                    yes
                );


                if (popupClose) {

                    popupClose.removeEventListener(
                        "click",
                        no
                    );
                }
            }


            popupOk.addEventListener(
                "click",
                yes
            );


            if (popupClose) {

                popupClose.addEventListener(
                    "click",
                    no
                );
            }

        }
    );
}


// =====================================================
// START
// =====================================================

loadCategories();