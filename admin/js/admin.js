// =====================================================
// ADMIN.JS
// MyShop Admin Panel
// =====================================================

const API_URL = "http://localhost:3000";

let products = [];
let categories = [];
let editingProductId = null;


// =====================================================
// DOM READY
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Admin JS loaded");

    loadProducts();
    loadCategories();
    loadDashboard();

    setupSearch();
    setupAddProductButton();
    setupProductForm();
    setupPopup();
    setupLogout();

});


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
// AUTH HEADERS
// =====================================================

function getAuthHeaders() {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}


// =====================================================
// POPUP
// =====================================================

function showPopup(title, message, type = "success") {

    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popupTitle");
    const popupMessage = document.getElementById("popupMessage");
    const popupIcon = document.getElementById("popupIcon");

    if (!popup) {
        console.error("Popup not found");
        return;
    }

    if (popupTitle) {
        popupTitle.textContent = title;
    }

    if (popupMessage) {
        popupMessage.textContent = message;
    }

    if (popupIcon) {

        if (type === "error") {
            popupIcon.textContent = "✕";
            popupIcon.className = "popup-icon error";
        }

        else if (type === "warning") {
            popupIcon.textContent = "!";
            popupIcon.className = "popup-icon warning";
        }

        else {
            popupIcon.textContent = "✓";
            popupIcon.className = "popup-icon";
        }
    }

    popup.classList.add("show");
}


// =====================================================
// CLOSE POPUP
// =====================================================

function closePopup() {

    const popup = document.getElementById("popup");

    if (popup) {
        popup.classList.remove("show");
    }
}


// =====================================================
// SETUP POPUP
// =====================================================

function setupPopup() {

    const popup = document.getElementById("popup");
    const popupClose = document.getElementById("popupClose");
    const popupOk = document.getElementById("popupOk");

    if (popupClose) {

        popupClose.addEventListener(
            "click",
            closePopup
        );

    }

    if (popupOk) {

        popupOk.addEventListener(
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


// =====================================================
// LOAD PRODUCTS
// =====================================================

async function loadProducts() {

    try {

        console.log("Loading products...");

        const response =
            await fetch(`${API_URL}/products`);

        if (!response.ok) {

            throw new Error(
                `Failed to load products: ${response.status}`
            );

        }

        const data =
            await response.json();

        console.log("Products response:", data);

        if (Array.isArray(data)) {

            products = data;

        }

        else if (Array.isArray(data.products)) {

            products = data.products;

        }

        else {

            products = [];

        }

        displayProducts(products);

        updateProductsCount(
            products.length
        );

    }

    catch (error) {

        console.error(
            "Products error:",
            error
        );

        const tableBody =
            document.getElementById(
                "adminProducts"
            );

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-products">
                        Unable to load products.
                    </td>
                </tr>
            `;

        }

    }

}


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts(productList) {

    const tableBody =
        document.getElementById(
            "adminProducts"
        );

    if (!tableBody) {

        console.error(
            "#adminProducts not found"
        );

        return;
    }

    tableBody.innerHTML = "";

    if (
        !productList ||
        productList.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="no-products"
                >
                    No products found
                </td>
            </tr>
        `;

        return;
    }


    productList.forEach(product => {

        const row =
            document.createElement("tr");


        const productId =
            product.id ||
            product._id ||
            "";


        const name =
            product.name ||
            "No name";


        const description =
            product.description ||
            "No description";


        let category =
            product.category ||
            "No category";


        if (
            typeof category === "object" &&
            category !== null
        ) {

            category =
                category.name ||
                category.title ||
                "No category";

        }


        const stock =
            Number(product.stock || 0);


        const price =
            Number(product.price || 0);


        let statusHTML;


        if (stock > 0) {

            statusHTML = `
                <span class="status-badge status-active">
                    Active
                </span>
            `;

        }

        else {

            statusHTML = `
                <span class="status-badge status-out">
                    Out of stock
                </span>
            `;

        }


        // IMAGE

        let imageHTML = `
            <div class="no-image">
                No Image
            </div>
        `;


        if (product.image) {

            let imageURL;


            if (
                product.image.startsWith("http://") ||
                product.image.startsWith("https://")
            ) {

                imageURL =
                    product.image;

            }

            else {

                imageURL =
                    `${API_URL}/uploads/${product.image}`;

            }


            imageHTML = `
                <img
                    src="${imageURL}"
                    alt="${escapeHTML(name)}"
                    class="product-table-image"
                    onerror="this.style.display='none';"
                >
            `;

        }


        row.innerHTML = `

            <td class="image-cell">
                ${imageHTML}
            </td>


            <td class="product-name">
                ${escapeHTML(name)}
            </td>


            <td class="product-description">
                ${escapeHTML(description)}
            </td>


            <td>
                <span class="category-badge">
                    ${escapeHTML(category)}
                </span>
            </td>


            <td>
                <span class="stock-number">
                    ${stock}
                </span>
            </td>


            <td>
                <span class="price">
                    ${price.toFixed(2)} DH
                </span>
            </td>


            <td>
                ${statusHTML}
            </td>


            <td>

                <div class="actions">

                    <button
                        type="button"
                        class="edit-btn"
                        onclick="editProduct('${productId}')"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deleteProduct('${productId}')"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });

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
// SEARCH
// =====================================================

function setupSearch() {

    const searchInput =
        document.getElementById("search");

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            const value =
                searchInput.value
                    .toLowerCase()
                    .trim();


            if (!value) {

                displayProducts(products);

                return;

            }


            const filtered =
                products.filter(product => {

                    const name =
                        String(
                            product.name || ""
                        ).toLowerCase();


                    const description =
                        String(
                            product.description || ""
                        ).toLowerCase();


                    let category =
                        product.category || "";


                    if (
                        typeof category === "object" &&
                        category !== null
                    ) {

                        category =
                            category.name || "";

                    }


                    category =
                        String(category)
                            .toLowerCase();


                    return (
                        name.includes(value) ||
                        description.includes(value) ||
                        category.includes(value)
                    );

                });


            displayProducts(filtered);

        }
    );

}


// =====================================================
// LOAD CATEGORIES
// =====================================================

async function loadCategories() {

    try {

        const response =
            await fetch(
                `${API_URL}/categories`
            );


        if (!response.ok) {

            throw new Error(
                `Categories request failed: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (Array.isArray(data)) {

            categories = data;

        }

        else if (
            Array.isArray(data.categories)
        ) {

            categories = data.categories;

        }

        else {

            categories = [];

        }


        populateCategorySelect();

        updateCategoriesCount(
            categories.length
        );

    }

    catch (error) {

        console.error(
            "Categories error:",
            error
        );

    }

}


// =====================================================
// CATEGORY SELECT
// =====================================================

function populateCategorySelect() {

    const select =
        document.getElementById(
            "productCategory"
        );

    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select Category
        </option>
    `;


    categories.forEach(category => {

        const option =
            document.createElement("option");


        const id =
            category.id ||
            category._id ||
            category.name;


        option.value =
            id;


        option.textContent =
            category.name ||
            category.title ||
            "Category";


        select.appendChild(option);

    });

}


// =====================================================
// DASHBOARD
// =====================================================

async function loadDashboard() {

    updateProductsCount(
        products.length
    );


    // USERS

    try {

        const response =
            await fetch(
                `${API_URL}/users`,
                {
                    headers:
                        getAuthHeaders()
                }
            );


        if (response.ok) {

            const data =
                await response.json();


            const users =
                Array.isArray(data)
                    ? data
                    : data.users || [];


            const usersCount =
                document.getElementById(
                    "usersCount"
                );


            if (usersCount) {

                usersCount.textContent =
                    users.length;

            }

        }

    }

    catch (error) {

        console.warn(
            "Users error:",
            error
        );

    }


    // ORDERS

    try {

        const response =
            await fetch(
                `${API_URL}/orders`,
                {
                    headers:
                        getAuthHeaders()
                }
            );


        if (response.ok) {

            const data =
                await response.json();


            const orders =
                Array.isArray(data)
                    ? data
                    : data.orders || [];


            const ordersCount =
                document.getElementById(
                    "ordersCount"
                );


            if (ordersCount) {

                ordersCount.textContent =
                    orders.length;

            }

        }

    }

    catch (error) {

        console.warn(
            "Orders error:",
            error
        );

    }

}


// =====================================================
// COUNTERS
// =====================================================

function updateProductsCount(count) {

    const element =
        document.getElementById(
            "productsCount"
        );

    if (element) {
        element.textContent = count;
    }

}


function updateCategoriesCount(count) {

    const element =
        document.getElementById(
            "categoriesCount"
        );

    if (element) {
        element.textContent = count;
    }

}


// =====================================================
// ADD PRODUCT BUTTON
// =====================================================

function setupAddProductButton() {

    const button =
        document.getElementById(
            "addProductBtn"
        );

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            const form =
                document.getElementById(
                    "productForm"
                );


            if (form) {

                editingProductId = null;

                resetProductForm();

                form.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


// =====================================================
// PRODUCT FORM
// =====================================================

function setupProductForm() {

    const form =
        document.getElementById(
            "productForm"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        handleProductSubmit
    );


    const cancelBtn =
        document.getElementById(
            "cancelBtn"
        );


    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            () => {

                editingProductId = null;

                resetProductForm();

            }
        );

    }

}


// =====================================================
// ADD / UPDATE PRODUCT
// =====================================================

async function handleProductSubmit(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const description =
        document.getElementById(
            "productDescription"
        ).value.trim();


    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );


    const stock =
        Number(
            document.getElementById(
                "productStock"
            ).value
        );


    const category =
        document.getElementById(
            "productCategory"
        ).value;


    const imageInput =
        document.getElementById(
            "productImage"
        );


    const imageNameInput =
        document.getElementById(
            "imageName"
        );


    // VALIDATION

    if (!name) {

        showPopup(
            "Error",
            "Please enter product name.",
            "error"
        );

        return;
    }


    if (!description) {

        showPopup(
            "Error",
            "Please enter product description.",
            "error"
        );

        return;
    }


    if (
        isNaN(price) ||
        price < 0
    ) {

        showPopup(
            "Error",
            "Please enter a valid price.",
            "error"
        );

        return;
    }


    if (
        isNaN(stock) ||
        stock < 0
    ) {

        showPopup(
            "Error",
            "Please enter a valid stock.",
            "error"
        );

        return;
    }


    if (!category) {

        showPopup(
            "Error",
            "Please select a category.",
            "error"
        );

        return;
    }


    try {

        // IMAGE

        let uploadedImageName =
            imageNameInput
                ? imageNameInput.value
                : "";


        if (
            imageInput &&
            imageInput.files &&
            imageInput.files.length > 0
        ) {

            const formData =
                new FormData();


            formData.append(
                "image",
                imageInput.files[0]
            );


            const uploadResponse =
                await fetch(
                    `${API_URL}/upload`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            if (!uploadResponse.ok) {

                throw new Error(
                    "Image upload failed."
                );

            }


            const uploadData =
                await uploadResponse.json();


            uploadedImageName =
                uploadData.image ||
                uploadData.filename ||
                uploadData.imageName ||
                "";


            if (!uploadedImageName) {

                throw new Error(
                    "Image name was not returned."
                );

            }

        }


        // PRODUCT DATA

        const productData = {

            name: name,

            description: description,

            price: price,

            stock: stock,

            category: category,

            image: uploadedImageName

        };


        const url =
            editingProductId
                ? `${API_URL}/products/${editingProductId}`
                : `${API_URL}/products`;


        const method =
            editingProductId
                ? "PUT"
                : "POST";


        const response =
            await fetch(
                url,
                {
                    method: method,

                    headers:
                        getAuthHeaders(),

                    body:
                        JSON.stringify(
                            productData
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Server error:",
                errorText
            );

            throw new Error(
                `Product save failed: ${response.status}`
            );

        }


        // SUCCESS POPUP

        showPopup(
            "Success",
            editingProductId
                ? "Product updated successfully!"
                : "Product added successfully!",
            "success"
        );


        editingProductId = null;

        resetProductForm();

        await loadProducts();

        await loadDashboard();

    }

    catch (error) {

        console.error(
            "Product save error:",
            error
        );


        showPopup(
            "Error",
            error.message ||
            "Product was not saved.",
            "error"
        );

    }

}


// =====================================================
// RESET FORM
// =====================================================

function resetProductForm() {

    const form =
        document.getElementById(
            "productForm"
        );


    if (form) {
        form.reset();
    }


    const imageName =
        document.getElementById(
            "imageName"
        );


    if (imageName) {
        imageName.value = "";
    }


    const saveBtn =
        document.getElementById(
            "saveBtn"
        );


    if (saveBtn) {
        saveBtn.textContent =
            "Add Product";
    }


    const formTitle =
        document.getElementById(
            "formTitle"
        );


    if (formTitle) {
        formTitle.textContent =
            "Add Product";
    }


    const cancelBtn =
        document.getElementById(
            "cancelBtn"
        );


    if (cancelBtn) {
        cancelBtn.style.display =
            "none";
    }

}


// =====================================================
// EDIT PRODUCT
// =====================================================

function editProduct(id) {

    const product =
        products.find(
            p =>
                String(
                    p.id ||
                    p._id
                ) === String(id)
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
        product.id ||
        product._id;


    document.getElementById(
        "productName"
    ).value =
        product.name || "";


    document.getElementById(
        "productDescription"
    ).value =
        product.description || "";


    document.getElementById(
        "productPrice"
    ).value =
        product.price || "";


    document.getElementById(
        "productStock"
    ).value =
        product.stock || "";


    const categorySelect =
        document.getElementById(
            "productCategory"
        );


    if (categorySelect) {

        let categoryValue =
            product.category;


        if (
            typeof categoryValue === "object" &&
            categoryValue !== null
        ) {

            categoryValue =
                categoryValue.id ||
                categoryValue._id ||
                categoryValue.name;

        }


        categorySelect.value =
            categoryValue || "";

    }


    const imageName =
        document.getElementById(
            "imageName"
        );


    if (imageName) {

        imageName.value =
            product.image || "";

    }


    const saveBtn =
        document.getElementById(
            "saveBtn"
        );


    if (saveBtn) {

        saveBtn.textContent =
            "Update Product";

    }


    const formTitle =
        document.getElementById(
            "formTitle"
        );


    if (formTitle) {

        formTitle.textContent =
            "Update Product";

    }


    const cancelBtn =
        document.getElementById(
            "cancelBtn"
        );


    if (cancelBtn) {

        cancelBtn.style.display =
            "block";

    }


    const form =
        document.getElementById(
            "productForm"
        );


    if (form) {

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


// =====================================================
// DELETE PRODUCT
// =====================================================

async function deleteProduct(id) {

    // بدل confirm بـ popup
    const confirmed =
        await showConfirmPopup(
            "Delete Product",
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const token =
            getToken();


        const headers = {};


        if (token) {

            headers[
                "Authorization"
            ] =
                `Bearer ${token}`;

        }


        const response =
            await fetch(
                `${API_URL}/products/${id}`,
                {
                    method: "DELETE",
                    headers: headers
                }
            );


        if (!response.ok) {

            throw new Error(
                `Delete failed: ${response.status}`
            );

        }


        showPopup(
            "Success",
            "Product deleted successfully!",
            "success"
        );


        await loadProducts();

        await loadDashboard();

    }

    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showPopup(
            "Error",
            "Product could not be deleted.",
            "error"
        );

    }

}


// =====================================================
// CONFIRM POPUP
// =====================================================

function showConfirmPopup(title, message) {

    return new Promise(resolve => {

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


        if (!popup) {

            resolve(
                window.confirm(message)
            );

            return;

        }


        popupTitle.textContent =
            title;


        popupMessage.textContent =
            message;


        popupIcon.textContent =
            "?";


        popupIcon.className =
            "popup-icon warning";


        popup.classList.add(
            "show"
        );


        // نخلي OK = YES

        const oldText =
            popupOk.textContent;


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

            popup.classList.remove(
                "show"
            );


            popupOk.textContent =
                oldText;


            popupOk.removeEventListener(
                "click",
                yes
            );


            popupClose.removeEventListener(
                "click",
                no
            );

        }


        const popupClose =
            document.getElementById(
                "popupClose"
            );


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


// =====================================================
// LOGOUT
// =====================================================

function setupLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) {
        return;
    }


    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


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

        }
    );

}


// =====================================================
// GLOBAL FUNCTIONS
// =====================================================

window.editProduct =
    editProduct;

window.deleteProduct =
    deleteProduct;