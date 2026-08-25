const categoriesTable = document.getElementById("categoriesTable");
const addCategoryBtn = document.getElementById("addCategory");
const categoryName = document.getElementById("categoryName");

// Display Categories
function loadCategories() {

    fetch("http://localhost:3000/categories")

    .then(res => res.json())

    .then(categories => {

        categoriesTable.innerHTML = "";

        categories.forEach(category => {

            categoriesTable.innerHTML += `
            <tr>

                <td>${category.id}</td>

                <td>${category.name}</td>

                <td>
                    <button onclick="deleteCategory(${category.id})">
                        Delete
                    </button>
                </td>

            </tr>
            `;

        });

    })

    .catch(err => console.log(err));

}

loadCategories();

// Add Category
addCategoryBtn.addEventListener("click", () => {

    if (categoryName.value.trim() === "") {

        alert("Please enter category name");

        return;

    }

    fetch("http://localhost:3000/categories", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: categoryName.value
        })

    })

    .then(res => res.json())

    .then(data => {

        alert(data.message);

        categoryName.value = "";

        loadCategories();

    })

    .catch(err => console.log(err));

});

// Delete Category
function deleteCategory(id) {

    if (!confirm("Delete this category?")) return;

    fetch(`http://localhost:3000/categories/${id}`, {

        method: "DELETE"

    })

    .then(res => res.json())

    .then(data => {

        alert(data.message);

        loadCategories();

    })

    .catch(err => console.log(err));

}