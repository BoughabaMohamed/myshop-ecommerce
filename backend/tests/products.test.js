require("dotenv").config();

const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const app = require("../server");

test("API should return welcome message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("welcome to the E-commerce API");
});

test("Test admin password", async () => {
    const [rows] = await db.promise().query(
        "SELECT password FROM users WHERE email = ?",
        [process.env.TEST_ADMIN_EMAIL]
    );

    expect(rows.length).toBe(1);

    const passwordMatches = await bcrypt.compare(
        process.env.TEST_ADMIN_PASSWORD,
        rows[0].password
    );

    expect(passwordMatches).toBe(true);
});

test("Admin should be able to login and receive a valid JWT token", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Admin login successful");
    expect(response.body.token).toBeDefined();
    expect(response.body.user.role).toBe("admin");

    const decoded = jwt.verify(
        response.body.token,
        process.env.JWT_SECRET
    );

    expect(decoded.id).toBe(response.body.user.id);
    expect(decoded.role).toBe("admin");
});

test("Users route should reject request without JWT", async () => {
    const response = await request(app)
        .get("/users");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Access denied");
});

test("Users route should reject invalid JWT", async () => {
    const response = await request(app)
        .get("/users")
        .set("Authorization", "Bearer invalid-token");

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Invalid token");
});

test("Admin should access users route with valid JWT", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});

test("Orders route should reject admin orders request without JWT", async () => {
    const response = await request(app)
        .get("/orders");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Access denied");
});

test("Orders route should reject invalid JWT", async () => {
    const response = await request(app)
        .get("/orders")
        .set("Authorization", "Bearer invalid-token");

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Invalid token");
});

test("Admin should access orders with valid JWT", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .get("/orders")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});

test("Admin should update an order status with valid JWT", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .put("/orders/999999")
        .set("Authorization", `Bearer ${token}`)
        .send({
            status: "Processing"
        });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
        "Order status updated successfully"
    );
});

test("Products POST should reject request without JWT", async () => {
    const response = await request(app)
        .post("/products")
        .send({
            name: "Test Product",
            description: "Test description",
            price: 100,
            image: "test.jpg",
            category: "Test",
            stock: 10
        });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Access denied");
});

test("Products PUT should reject request without JWT", async () => {
    const response = await request(app)
        .put("/products/999999")
        .send({
            name: "Test Product",
            description: "Test description",
            price: 100,
            image: "test.jpg",
            category: "Test",
            stock: 10
        });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Access denied");
});

test("Products DELETE should reject request without JWT", async () => {
    const response = await request(app)
        .delete("/products/999999");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Access denied");
});

test("Products DELETE should return 404 when product does not exist", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .delete("/products/999999")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Product not found");
});

test("Anyone should be able to get products", async () => {
    const response = await request(app)
        .get("/products");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});

test("Anyone should be able to get categories", async () => {
    const response = await request(app)
        .get("/categories");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});

test("Categories POST should reject request without JWT", async () => {
    const response = await request(app)
        .post("/categories")
        .send({
            name: "Test Category"
        });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Access denied");
});

test("Categories DELETE should reject request without JWT", async () => {
    const response = await request(app)
        .delete("/categories/999999");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Access denied");
});

test("Categories POST should reject invalid JWT", async () => {
    const response = await request(app)
        .post("/categories")
        .set("Authorization", "Bearer invalid-token")
        .send({
            name: "Test Category"
        });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Invalid token");
});

test("Products PUT should return 404 when product does not exist", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .put("/products/999999")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Test Product",
            description: "Test description",
            price: 100,
            image: "test.jpg",
            category: "Test",
            stock: 10
        });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Product not found");
});

test("Categories DELETE should return 404 when category does not exist", async () => {
const loginResponse = await request(app)
.post("/users/login")
.send({
email: process.env.TEST_ADMIN_EMAIL,
password: process.env.TEST_ADMIN_PASSWORD
});


const token = loginResponse.body.token;

const response = await request(app)
    .delete("/categories/999999")
    .set("Authorization", `Bearer ${token}`);

expect(response.statusCode).toBe(404);
expect(response.body.message).toBe("Category not found");


});

test("Users DELETE should return 404 when user does not exist", async () => {
const loginResponse = await request(app)
.post("/users/login")
.send({
email: process.env.TEST_ADMIN_EMAIL,
password: process.env.TEST_ADMIN_PASSWORD
});


const token = loginResponse.body.token;

const response = await request(app)
    .delete("/users/999999")
    .set("Authorization", `Bearer ${token}`);

expect(response.statusCode).toBe(404);
expect(response.body.message).toBe("User not found");


});

test("Categories POST should reject empty name", async () => {
const loginResponse = await request(app)
.post("/users/login")
.send({
email: process.env.TEST_ADMIN_EMAIL,
password: process.env.TEST_ADMIN_PASSWORD
});


const token = loginResponse.body.token;

const response = await request(app)
    .post("/categories")
    .set("Authorization", `Bearer ${token}`)
    .send({
        name: "   "
    });

expect(response.statusCode).toBe(400);
expect(response.body.message).toBe(
    "Category name is required"
);


});

test("Categories POST should reject non-string name", async () => {
const loginResponse = await request(app)
.post("/users/login")
.send({
email: process.env.TEST_ADMIN_EMAIL,
password: process.env.TEST_ADMIN_PASSWORD
});


const token = loginResponse.body.token;

const response = await request(app)
    .post("/categories")
    .set("Authorization", `Bearer ${token}`)
    .send({
        name: 123
    });

expect(response.statusCode).toBe(400);
expect(response.body.message).toBe(
    "Category name is required"
);


});

test("Products POST should reject empty name", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "   ",
            description: "Test description",
            price: 100,
            image: "test.jpg",
            category: "Test",
            stock: 10
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Name, description, image and category are required"
    );
});

test("Products POST should reject negative price", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Test Product",
            description: "Test description",
            price: -100,
            image: "test.jpg",
            category: "Test",
            stock: 10
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Price must be a valid non-negative number"
    );
});

test("Products PUT should reject empty name", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .put("/products/999999")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "   ",
            description: "Test description",
            price: 100,
            image: "test.jpg",
            category: "Test",
            stock: 10
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Name, description, image and category are required"
    );
});

test("Products PUT should reject negative stock", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .put("/products/999999")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Test Product",
            description: "Test description",
            price: 100,
            image: "test.jpg",
            category: "Test",
            stock: -5
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Stock must be a non-negative integer"
    );
});

test("Categories DELETE should reject invalid ID", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .delete("/categories/abc")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid category ID");
});

test("Products DELETE should reject invalid ID", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .delete("/products/abc")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid product ID");
});

test("Admin login should reject empty credentials", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: "   ",
            password: ""
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Email and password are required"
    );
});

test("Admin login should reject non-string email", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: 123,
            password: "somepassword"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Email and password are required"
    );
});

test("Users DELETE should reject invalid ID", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;

    const response = await request(app)
        .delete("/users/abc")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid user ID");
});


test("Admin login should reject incorrect password", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: "WrongPassword123!"
        });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(
        "Invalid email or password"
    );
});


test("Admin login should reject unknown email", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: "unknown-user@example.com",
            password: "SomePassword123!"
        });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(
        "Invalid email or password"
    );
    expect(response.body.token).toBeUndefined();
});


test("Admin login should reject non-string password", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: 123456
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Email and password are required"
    );
});


test("Users route should reject invalid authorization format", async () => {
    const response = await request(app)
        .get("/users")
        .set("Authorization", "Basic invalid-token");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(
        "Invalid authorization format"
    );
});


test("Users route should reject missing token after Bearer", async () => {
    const response = await request(app)
        .get("/users")
        .set("Authorization", "Bearer");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(
        "Invalid authorization format"
    );
});


test("Admin should not be able to delete their own account", async () => {
    const loginResponse = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = loginResponse.body.token;
    const adminId = loginResponse.body.user.id;

    const response = await request(app)
        .delete(`/users/${adminId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "You cannot delete your own account"
    );
});

test("Admin should reject invalid order ID", async () => {
    const login = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = login.body.token;

    const response = await request(app)
        .put("/orders/abc")
        .set("Authorization", `Bearer ${token}`)
        .send({
            status: "Processing"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid order ID");
});

test("Admin should reject invalid order status", async () => {
    const login = await request(app)
        .post("/users/login")
        .send({
            email: process.env.TEST_ADMIN_EMAIL,
            password: process.env.TEST_ADMIN_PASSWORD
        });

    const token = login.body.token;

    const response = await request(app)
        .put("/orders/1")
        .set("Authorization", `Bearer ${token}`)
        .send({
            status: "Hacked"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid order status");
});


test("Orders POST should reject an empty cart", async () => {
    const response = await request(app)
        .post("/orders")
        .send({
            address: "Meknes",
            cart: []
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid order data");
});


test("Orders POST should reject an invalid cart quantity", async () => {
    const response = await request(app)
        .post("/orders")
        .send({
            address: "Meknes",
            cart: [
                {
                    id: 1,
                    quantity: 0,
                    price: 100
                }
            ]
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Invalid cart item");
});


afterAll(async () => {
    await db.end();
});