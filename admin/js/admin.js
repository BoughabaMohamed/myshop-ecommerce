const API_URL = "http://localhost:3000";

let products = [];
let categories = [];
let editingProductId = null;


// ==========================================
// DOM LOADED
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadCategories();
    loadDashboard();

    setupSearch();
    setupAddProductButton();
    setupProductForm();
    setupPopup();
    setupLogout();
});


// ==========================================
// AUTH
// ==========================================

function getToken() {
    return (
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken")
    );
}


function getAuthHeaders() {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}


// ==========================================
// POPUP
// ==========================================

function showPopup(title, message, type = "success") {
    const popup = document.getElementById("popup");
    const popupIcon = document.getElementById("popupIcon");
    const popupTitle = document.getElementById("popupTitle");
    const popupMessage = document.getElementById("popupMessage");

    if (!popup) return;

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    if (type === "error") {
        popupIcon.textContent = "!";
        popupIcon.className =
            "w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold mb-4";
    } else {
        popupIcon.textContent = "✓";
        popupIcon.className =
            "w-14 h-14 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl font-bold mb-4";
    }

    popup.classList.remove("hidden");
    popup.classList.add("flex");
}


function closePopup() {
    const popup = document.getElementById("popup");

    if (!popup) return;

    popup.classList.add("hidden");
    popup.classList.remove("flex");
}


function setupPopup() {
    const popupClose = document.getElementById("popupClose");
    const popupOk = document.getElementById("popupOk");

    if (popupClose) {
        popupClose.addEventListener("click", closePopup);
    }

    if (popupOk) {
        popupOk.addEventListener("click", closePopup);
    }
}


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {
    const container = document.getElementById("adminProducts");

    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            products = data;
        } else if (Array.isArray(data.products)) {
            products = data.products;
        } else {
            products = [];
        }

        displayProducts(products);

        updateProductsCount();

    } catch (error) {
        console.error("Error loading products:", error);

        container.innerHTML = `
            <tr>
                <td colspan="8" class="px-5 py-10 text-center">
                    <div class="text-red-500 font-semibold">
                        Failed to load products
                    </div>

                    <p class="text-sm text-gray-500 mt-2">
                        Make sure your server is running on localhost:3000.
                    </p>
                </td>
            </tr>
        `;
    }
}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function displayProducts(list) {
    const container = document.getElementById("adminProducts");

    if (!container) return;

    if (!list || list.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="8" class="px-5 py-10 text-center text-gray-500">
                    No products found.
                </td>
            </tr>
        `;

        return;
    }

    container.innerHTML = "";

    list.forEach(product => {

        const row = document.createElement("tr");

        row.className =
            "border-b border-gray-100 hover:bg-gray-50 transition";


        // ==========================================
        // PRODUCT ID
        // ==========================================

        const productId = product.id || product._id;


        // ==========================================
        // IMAGE
        // ==========================================

        let imageUrl = "";

        if (product.image) {

            if (
                product.image.startsWith("http://") ||
                product.image.startsWith("https://")
            ) {
                imageUrl = product.image;
            } else {
                imageUrl = `${API_URL}/uploads/${product.image}`;
            }

        }


        // ==========================================
        // CATEGORY
        // ==========================================

        let categoryName = "No category";

        if (product.category) {

            if (typeof product.category === "object") {
                categoryName =
                    product.category.name ||
                    product.category.title ||
                    "No category";
            } else {
                categoryName = product.category;
            }

        }


        // ==========================================
        // STOCK STATUS
        // ==========================================

        const stock = Number(product.stock) || 0;

        let statusHTML = "";

        if (stock > 0) {

            statusHTML = `
                <span class="inline-flex items-center px-3 py-1
                       rounded-full text-xs font-semibold
                       bg-green-100 text-green-700">
                    Active
                </span>
            `;

        } else {

            statusHTML = `
                <span class="inline-flex items-center px-3 py-1
                       rounded-full text-xs font-semibold
                       bg-red-100 text-red-700">
                    Out of stock
                </span>
            `;

        }


        // ==========================================
        // ROW
        // ==========================================

        row.innerHTML = `

            <!-- IMAGE -->

            <td class="px-5 py-4">

                <div class="w-16 h-16 rounded-lg bg-gray-50
                            border border-gray-200 flex items-center
                            justify-center overflow-hidden">

                    ${
                        imageUrl
                            ? `
                                <img
                                    src="${imageUrl}"
                                    alt="${escapeHTML(product.name || "Product")}"
                                    class="w-14 h-14 object-contain"
                                    onerror="this.style.display='none'"
                                >
                              `
                            : `
                                <span class="text-xs text-gray-400">
                                    No image
                                </span>
                              `
                    }

                </div>

            </td>


            <!-- NAME -->

            <td class="px-5 py-4">

                <div class="font-semibold text-gray-900">
                    ${escapeHTML(product.name || "Unnamed product")}
                </div>

            </td>


            <!-- DESCRIPTION -->

            <td class="px-5 py-4 max-w-xs">

                <p class="text-sm text-gray-500 truncate">
                    ${escapeHTML(product.description || "No description")}
                </p>

            </td>


            <!-- CATEGORY -->

            <td class="px-5 py-4">

                <span class="text-sm text-gray-700">
                    ${escapeHTML(categoryName)}
                </span>

            </td>


            <!-- STOCK -->

            <td class="px-5 py-4">

                <span class="font-medium text-gray-700">
                    ${stock}
                </span>

            </td>


            <!-- PRICE -->

            <td class="px-5 py-4">

                <span class="font-semibold text-gray-900">
                    ${Number(product.price || 0).toFixed(2)} DH
                </span>

            </td>


            <!-- STATUS -->

            <td class="px-5 py-4">
                ${statusHTML}
            </td>


            <!-- ACTIONS -->

            <td class="px-5 py-4">

                <div class="flex items-center gap-2">

                    <!-- EDIT -->

                    <button
                        type="button"
                        onclick="editProduct('${productId}')"
                        class="px-3 py-2 bg-blue-600 text-white
                               text-sm font-semibold rounded-lg
                               hover:bg-blue-700 transition"
                    >
                        Edit
                    </button>


                    <!-- DELETE -->

                    <button
                        type="button"
                        onclick="deleteProduct('${productId}')"
                        class="px-3 py-2 bg-red-600 text-white
                               text-sm font-semibold rounded-lg
                               hover:bg-red-700 transition"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;

        container.appendChild(row);
    });
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


// ==========================================
// SEARCH
// ==========================================

function setupSearch() {

    const searchInput = document.getElementById("search");

    if (!searchInput) return;

    searchInput.addEventListener("input", () => {

        const searchValue =
            searchInput.value.trim().toLowerCase();

        const filteredProducts = products.filter(product => {

            const name =
                String(product.name || "").toLowerCase();

            const description =
                String(product.description || "").toLowerCase();

            let category = "";

            if (typeof product.category === "object") {
                category =
                    String(product.category?.name || "").toLowerCase();
            } else {
                category =
                    String(product.category || "").toLowerCase();
            }

            return (
                name.includes(searchValue) ||
                description.includes(searchValue) ||
                category.includes(searchValue)
            );

        });

        displayProducts(filteredProducts);
    });
}


// ==========================================
// LOAD CATEGORIES
// ==========================================

async function loadCategories() {

    const select = document.getElementById("productCategory");

    if (!select) return;

    try {

        const response = await fetch(`${API_URL}/categories`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            categories = data;
        } else if (Array.isArray(data.categories)) {
            categories = data.categories;
        } else {
            categories = [];
        }

        populateCategorySelect();

        updateCategoriesCount();

    } catch (error) {

        console.error("Error loading categories:", error);

    }
}


// ==========================================
// CATEGORY SELECT
// ==========================================

function populateCategorySelect() {

    const select = document.getElementById("productCategory");

    if (!select) return;

    select.innerHTML = `
        <option value="">
            Select Category
        </option>
    `;

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category.id || category._id;

        option.textContent =
            category.name ||
            category.title ||
            "Unnamed category";

        select.appendChild(option);

    });
}


// ==========================================
// DASHBOARD
// ==========================================

async function loadDashboard() {

    updateProductsCount();
    updateCategoriesCount();

    try {

        const usersResponse = await fetch(
            `${API_URL}/users`,
            {
                headers: getAuthHeaders()
            }
        );

        if (usersResponse.ok) {

            const usersData = await usersResponse.json();

            const users =
                Array.isArray(usersData)
                    ? usersData
                    : usersData.users || [];

            const usersCount =
                document.getElementById("usersCount");

            if (usersCount) {
                usersCount.textContent = users.length;
            }
        }

    } catch (error) {

        console.error("Error loading users:", error);

    }


    try {

        const ordersResponse = await fetch(
            `${API_URL}/orders`,
            {
                headers: getAuthHeaders()
            }
        );

        if (ordersResponse.ok) {

            const ordersData = await ordersResponse.json();

            const orders =
                Array.isArray(ordersData)
                    ? ordersData
                    : ordersData.orders || [];

            const ordersCount =
                document.getElementById("ordersCount");

            if (ordersCount) {
                ordersCount.textContent = orders.length;
            }
        }

    } catch (error) {

        console.error("Error loading orders:", error);

    }
}


// ==========================================
// DASHBOARD COUNTERS
// ==========================================

function updateProductsCount() {

    const counter =
        document.getElementById("productsCount");

    if (counter) {
        counter.textContent = products.length;
    }
}


function updateCategoriesCount() {

    const counter =
        document.getElementById("categoriesCount");

    if (counter) {
        counter.textContent = categories.length;
    }
}


// ==========================================
// ADD PRODUCT BUTTON
// ==========================================

function setupAddProductButton() {

    const button =
        document.getElementById("addProductBtn");

    if (!button) return;

    button.addEventListener("click", () => {

        resetProductForm();

        const form =
            document.getElementById("productForm");

        if (form) {
            form.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    });
}


// ==========================================
// PRODUCT FORM
// ==========================================

function setupProductForm() {

    const form =
        document.getElementById("productForm");

    if (!form) return;

    form.addEventListener("submit", async event => {

        event.preventDefault();

        const name =
            document.getElementById("productName").value.trim();

        const description =
            document.getElementById("productDescription").value.trim();

        const price =
            document.getElementById("productPrice").value;

        const stock =
            document.getElementById("productStock").value;

        const category =
            document.getElementById("productCategory").value;

        const imageInput =
            document.getElementById("productImage");

        const message =
            document.getElementById("message");

        const saveBtn =
            document.getElementById("saveBtn");


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !description || !price || !stock || !category) {

            if (message) {

                message.textContent =
                    "Please fill in all required fields.";

                message.className =
                    "mt-4 text-sm font-medium text-red-600";
            }

            return;
        }


        try {

            saveBtn.disabled = true;

            saveBtn.textContent =
                editingProductId
                    ? "Updating..."
                    : "Adding...";


            let imageName =
                document.getElementById("imageName").value;


            // ==========================================
            // UPLOAD IMAGE
            // ==========================================

            if (imageInput.files.length > 0) {

                const formData = new FormData();

                formData.append(
                    "image",
                    imageInput.files[0]
                );

                const uploadResponse =
                    await fetch(
                        `${API_URL}/upload`,
                        {
                            method: "POST",
                            headers: getUploadHeaders(),
                            body: formData
                        }
                    );


                if (!uploadResponse.ok) {

                    throw new Error(
                        "Image upload failed"
                    );

                }


                const uploadData =
                    await uploadResponse.json();


                imageName =
                    uploadData.filename ||
                    uploadData.image ||
                    uploadData.fileName ||
                    "";

            }


            // ==========================================
            // PRODUCT DATA
            // ==========================================

            const productData = {

                name: name,

                description: description,

                price: Number(price),

                stock: Number(stock),

                category: category

            };


            if (imageName) {
                productData.image = imageName;
            }


            // ==========================================
            // ADD / UPDATE
            // ==========================================

            let response;

            if (editingProductId) {

                response = await fetch(
                    `${API_URL}/products/${editingProductId}`,
                    {
                        method: "PUT",
                        headers: getAuthHeaders(),
                        body: JSON.stringify(productData)
                    }
                );

            } else {

                response = await fetch(
                    `${API_URL}/products`,
                    {
                        method: "POST",
                        headers: getAuthHeaders(),
                        body: JSON.stringify(productData)
                    }
                );

            }


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText || "Operation failed"
                );

            }


            // ==========================================
            // SUCCESS
            // ==========================================

            const wasEditing =
                Boolean(editingProductId);

            resetProductForm();

            await loadProducts();

            await loadDashboard();

            showPopup(
                "Success",
                wasEditing
                    ? "Product updated successfully."
                    : "Product added successfully."
            );


        } catch (error) {

            console.error(
                "Product operation error:",
                error
            );

            if (message) {

                message.textContent =
                    error.message ||
                    "Something went wrong.";

                message.className =
                    "mt-4 text-sm font-medium text-red-600";
            }

        } finally {

            saveBtn.disabled = false;

            saveBtn.textContent =
                editingProductId
                    ? "Update Product"
                    : "Add Product";

        }

    });


    // Cancel button

    const cancelBtn =
        document.getElementById("cancelBtn");

    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            resetProductForm
        );

    }
}


// ==========================================
// UPLOAD HEADERS
// ==========================================

function getUploadHeaders() {

    const token = getToken();

    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return headers;
}


// ==========================================
// RESET FORM
// ==========================================

function resetProductForm() {

    const form =
        document.getElementById("productForm");

    const formTitle =
        document.getElementById("formTitle");

    const saveBtn =
        document.getElementById("saveBtn");

    const cancelBtn =
        document.getElementById("cancelBtn");

    const imageName =
        document.getElementById("imageName");

    const message =
        document.getElementById("message");


    if (form) {
        form.reset();
    }

    editingProductId = null;


    if (formTitle) {
        formTitle.textContent =
            "Add Product";
    }


    if (saveBtn) {
        saveBtn.textContent =
            "Add Product";
    }


    if (cancelBtn) {
        cancelBtn.style.display =
            "none";
    }


    if (imageName) {
        imageName.value = "";
    }


    if (message) {
        message.textContent = "";
        message.className =
            "mt-4 text-sm font-medium";
    }
}


// ==========================================
// EDIT PRODUCT
// ==========================================

function editProduct(id) {

    const product =
        products.find(
            item =>
                String(item.id || item._id) === String(id)
        );


    if (!product) {

        showPopup(
            "Error",
            "Product not found.",
            "error"
        );

        return;
    }


    editingProductId =
        product.id || product._id;


    document.getElementById("productName").value =
        product.name || "";


    document.getElementById("productDescription").value =
        product.description || "";


    document.getElementById("productPrice").value =
        product.price ?? "";


    document.getElementById("productStock").value =
        product.stock ?? "";


    // Category

    const categorySelect =
        document.getElementById("productCategory");


    if (categorySelect) {

        let categoryId = "";

        if (typeof product.category === "object") {

            categoryId =
                product.category.id ||
                product.category._id ||
                "";

        } else {

            categoryId =
                product.category || "";

        }

        categorySelect.value =
            categoryId;
    }


    // Image name

    document.getElementById("imageName").value =
        product.image || "";


    // Form title

    document.getElementById("formTitle").textContent =
        "Update Product";


    // Save button

    document.getElementById("saveBtn").textContent =
        "Update Product";


    // Cancel button

    document.getElementById("cancelBtn").style.display =
        "block";


    // Scroll to form

    document.getElementById("productForm").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ==========================================
// DELETE PRODUCT
// ==========================================

function deleteProduct(id) {

    const product =
        products.find(
            item =>
                String(item.id || item._id) === String(id)
        );


    if (!product) {

        showPopup(
            "Error",
            "Product not found.",
            "error"
        );

        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${product.name}"?`
        );


    if (!confirmed) return;


    performDeleteProduct(id);
}


async function performDeleteProduct(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/products/${id}`,
                {
                    method: "DELETE",
                    headers: getAuthHeaders()
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText || "Delete failed"
            );

        }


        await loadProducts();

        await loadDashboard();


        showPopup(
            "Success",
            "Product deleted successfully."
        );


    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );


        showPopup(
            "Error",
            error.message ||
                "Failed to delete product.",
            "error"
        );

    }

}


// ==========================================
// LOGOUT
// ==========================================

function setupLogout() {

    const logout = event => {

        event.preventDefault();


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
    };


    const logoutBtn =
        document.getElementById("logoutBtn");


    const logoutBtnMobile =
        document.getElementById("logoutBtnMobile");


    if (logoutBtn) {
        logoutBtn.addEventListener(
            "click",
            logout
        );
    }


    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener(
            "click",
            logout
        );
    }

}


// ==========================================
// GLOBAL FUNCTIONS
// ==========================================

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;