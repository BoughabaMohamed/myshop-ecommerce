const { verifyToken, isAdmin } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ================= CREATE ORDER =================


router.post("/", (req, res) => {
    const { address, cart } = req.body;

    if (
        typeof address !== "string" ||
        address.trim() === "" ||
        !Array.isArray(cart) ||
        cart.length === 0
    ) {
        return res.status(400).json({
            message: "Invalid order data"
        });
    }

    for (const item of cart) {
        if (
            !item ||
            !Number.isSafeInteger(Number(item.id)) ||
            Number(item.id) <= 0 ||
            !Number.isSafeInteger(item.quantity) ||
            item.quantity <= 0
        ) {
            return res.status(400).json({
                message: "Invalid cart item"
            });
        }
    }

    // Combine duplicate product IDs.
    const quantities = new Map();

    for (const item of cart) {
        const id = Number(item.id);
        const quantity = item.quantity;
        const combined = (quantities.get(id) || 0) + quantity;

        if (!Number.isSafeInteger(combined)) {
            return res.status(400).json({
                message: "Invalid cart quantity"
            });
        }

        quantities.set(id, combined);
    }

    const connection = db;

    connection.getConnection((connectionErr, conn) => {
        if (connectionErr) {
            console.error(connectionErr);
            return res.status(500).json({
                message: "Unable to process order"
            });
        }

        conn.beginTransaction((transactionErr) => {
            if (transactionErr) {
                console.error(transactionErr);
                return conn.release(), res.status(500).json({
                    message: "Unable to process order"
                });
            }

            const rollback = (status, message) => {
                conn.rollback(() => {
                    conn.release();
                    res.status(status).json({ message });
                });
            };

            const productIds = [...quantities.keys()];
            const placeholders = productIds.map(() => "?").join(",");

            const productSql = `
                SELECT id, price, stock
                FROM products
                WHERE id IN (${placeholders})
                FOR UPDATE
            `;

            conn.query(productSql, productIds, (productErr, products) => {
                if (productErr) {
                    console.error(productErr);
                    return rollback(500, "Unable to process order");
                }

                if (products.length !== productIds.length) {
                    return rollback(400, "One or more products do not exist");
                }

                const productMap = new Map(
                    products.map(product => [Number(product.id), product])
                );

                const values = [];
                let totalPrice = 0;

                for (const [id, quantity] of quantities) {
                    const product = productMap.get(id);
                    const price = Number(product.price);
                    const stock = Number(product.stock);

                    if (!Number.isFinite(price) || price < 0) {
                        return rollback(500, "Invalid product price");
                    }

                    if (!Number.isSafeInteger(stock) || stock < quantity) {
                        return rollback(400, "Insufficient stock");
                    }

                    totalPrice += price * quantity;

                    if (!Number.isFinite(totalPrice)) {
                        return rollback(400, "Order total is invalid");
                    }

                    values.push([id, quantity, price]);
                }

                const orderSql = `
                    INSERT INTO orders (user_id, total_price, address)
                    VALUES (NULL, ?, ?)
                `;

                conn.query(
                    orderSql,
                    [totalPrice, address.trim()],
                    (orderErr, orderResult) => {
                        if (orderErr) {
                            console.error(orderErr);
                            return rollback(500, "Unable to create order");
                        }

                        const orderId = orderResult.insertId;

                        const itemValues = values.map(
                            ([productId, quantity, price]) => [
                                orderId,
                                productId,
                                quantity,
                                price
                            ]
                        );

                        const itemSql = `
                            INSERT INTO order_items
                            (order_id, product_id, quantity, price)
                            VALUES ?
                        `;

                        conn.query(itemSql, [itemValues], (itemsErr) => {
                            if (itemsErr) {
                                console.error(itemsErr);
                                return rollback(
                                    500,
                                    "Unable to create order items"
                                );
                            }

                            const stockSql = `
                                UPDATE products
                                SET stock = stock - ?
                                WHERE id = ? AND stock >= ?
                            `;

                            const updateNextStock = (index) => {
                                if (index >= values.length) {
                                    return conn.commit((commitErr) => {
                                        if (commitErr) {
                                            console.error(commitErr);
                                            return rollback(
                                                500,
                                                "Unable to complete order"
                                            );
                                        }

                                        conn.release();

                                        res.status(201).json({
                                            message: "Order placed successfully",
                                            orderId,
                                            total_price: totalPrice
                                        });
                                    });
                                }

                                const [productId, quantity] = values[index];

                                conn.query(
                                    stockSql,
                                    [quantity, productId, quantity],
                                    (stockErr, stockResult) => {
                                        if (stockErr) {
                                            console.error(stockErr);
                                            return rollback(
                                                500,
                                                "Unable to update stock"
                                            );
                                        }

                                        if (stockResult.affectedRows !== 1) {
                                            return rollback(
                                                409,
                                                "Insufficient stock"
                                            );
                                        }

                                        updateNextStock(index + 1);
                                    }
                                );
                            };

                            updateNextStock(0);
                        });
                    }
                );
            });
        });
    });
});

// ================= GET ALL ORDERS - ADMIN =================

router.get("/", verifyToken, isAdmin, (req, res) => {

    const sql = `
        SELECT
            orders.*,
            users.name AS user_name
        FROM orders
        LEFT JOIN users
        ON orders.user_id = users.id
        ORDER BY orders.id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});


// ================= UPDATE ORDER STATUS - ADMIN =================

router.put("/:id", verifyToken, isAdmin, (req, res) => {

    const id = req.params.id;
    const { status } = req.body;

    
if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
        message: "Invalid order ID"
    });
}

const allowedStatuses = [
    "Pending",
    "Processing",
    "Delivered",
    "Cancelled"
];

if (
    typeof status !== "string" ||
    !allowedStatuses.includes(status)
) {
    return res.status(400).json({
        message: "Invalid order status"
    });
}

    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Order status updated successfully"
        });

    });

});


module.exports = router;