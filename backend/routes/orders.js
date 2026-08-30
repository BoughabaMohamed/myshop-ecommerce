const { verifyToken, isAdmin } = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ================= CREATE ORDER =================

router.post("/", (req, res) => {

    const { total_price, address, cart } = req.body;

    if (!total_price || !address || !cart || cart.length === 0) {

        return res.status(400).json({
            message: "Missing required data"
        });

    }

    const orderSql = `
        INSERT INTO orders (user_id, total_price, address)
        VALUES (NULL, ?, ?)
    `;

    db.query(
        orderSql,
        [total_price, address],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Error creating order"
                });
            }

            const orderId = result.insertId;

            const values = cart.map(item => [
                orderId,
                item.id,
                item.quantity,
                item.price
            ]);

            const itemSql = `
                INSERT INTO order_items
                (order_id, product_id, quantity, price)
                VALUES ?
            `;

            db.query(itemSql, [values], (err2) => {

                if (err2) {
                    console.log(err2);

                    return res.status(500).json({
                        message: "Error creating order items"
                    });
                }

                res.json({
                    message: "Order placed successfully"
                });

            });

        }
    );

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