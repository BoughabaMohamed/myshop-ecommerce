
const express = require("express");
const router = express.Router();

const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/auth");

// GET: Public products (active only)
router.get("/", (req, res) => {
    const sql = "SELECT * FROM products WHERE is_active = 1";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("GET PRODUCTS ERROR:", err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(result);
    });
});

// GET: All products for admin, including inactive products
router.get("/admin/all", verifyToken, isAdmin, (req, res) => {
    const sql = "SELECT * FROM products ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("GET ADMIN PRODUCTS ERROR:", err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(result);
    });
});

// POST: Add product
router.post("/", verifyToken, isAdmin, (req, res) => {
    const { name, description, price, image, category, stock } = req.body;

    if (
        typeof name !== "string" || name.trim() === "" ||
        typeof description !== "string" || description.trim() === "" ||
        typeof image !== "string" || image.trim() === "" ||
        typeof category !== "string" || category.trim() === ""
    ) {
        return res.status(400).json({
            message: "Name, description, image and category are required"
        });
    }

    if (
        price === undefined ||
        price === null ||
        price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        return res.status(400).json({
            message: "Price must be a valid non-negative number"
        });
    }

    if (
        stock === undefined ||
        stock === null ||
        stock === "" ||
        !Number.isInteger(Number(stock)) ||
        Number(stock) < 0
    ) {
        return res.status(400).json({
            message: "Stock must be a non-negative integer"
        });
    }

    const sql = `
        INSERT INTO products
        (name, description, price, image, category, stock, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
    `;

    db.query(
        sql,
        [
            name.trim(),
            description.trim(),
            Number(price),
            image.trim(),
            category.trim(),
            Number(stock)
        ],
        (err, result) => {
            if (err) {
                console.error("ADD PRODUCT ERROR:", err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(201).json({
                message: "Product added successfully",
                id: result.insertId
            });
        }
    );
});

// DELETE: Permanently delete if not used in orders;
// otherwise deactivate and preserve order history.
router.delete("/:id", verifyToken, isAdmin, (req, res) => {
    const id = req.params.id;

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            message: "Invalid product ID"
        });
    }

    db.query(
        "SELECT id, is_active FROM products WHERE id = ?",
        [id],
        (err, products) => {
            if (err) {
                console.error("FIND PRODUCT ERROR:", err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (products.length === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            db.query(
                "SELECT id FROM order_items WHERE product_id = ? LIMIT 1",
                [id],
                (orderErr, orderItems) => {
                    if (orderErr) {
                        console.error("CHECK ORDER ITEMS ERROR:", orderErr);
                        return res.status(500).json({
                            message: "Could not check product orders"
                        });
                    }

                    // Product has order history: deactivate it.
                    if (orderItems.length > 0) {
                        if (products[0].is_active === 0) {
                            return res.json({
                                message: "Product is already inactive",
                                action: "deactivated"
                            });
                        }

                        db.query(
                            "UPDATE products SET is_active = 0 WHERE id = ?",
                            [id],
                            (updateErr) => {
                                if (updateErr) {
                                    console.error("DEACTIVATE PRODUCT ERROR:", updateErr);
                                    return res.status(500).json({
                                        message: "Could not deactivate product"
                                    });
                                }

                                return res.json({
                                    message: "Product deactivated to preserve order history",
                                    action: "deactivated"
                                });
                            }
                        );

                        return;
                    }

                    // Product has no order history: delete permanently.
                    db.query(
                        "DELETE FROM products WHERE id = ?",
                        [id],
                        (deleteErr, result) => {
                            if (deleteErr) {
                                console.error("DELETE PRODUCT DATABASE ERROR:", deleteErr);
                                return res.status(500).json({
                                    message: "Could not delete product"
                                });
                            }

                            if (result.affectedRows === 0) {
                                return res.status(404).json({
                                    message: "Product not found"
                                });
                            }

                            res.json({
                                message: "Product deleted permanently",
                                action: "deleted"
                            });
                        }
                    );
                }
            );
        }
    );
});

// PUT: Update product
router.put("/:id", verifyToken, isAdmin, (req, res) => {
    const id = req.params.id;
    const { name, description, price, stock, image, category } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            message: "Invalid product ID"
        });
    }

    if (
        typeof name !== "string" || name.trim() === "" ||
        typeof description !== "string" || description.trim() === "" ||
        typeof image !== "string" || image.trim() === "" ||
        typeof category !== "string" || category.trim() === ""
    ) {
        return res.status(400).json({
            message: "Name, description, image and category are required"
        });
    }

    if (
        price === undefined ||
        price === null ||
        price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        return res.status(400).json({
            message: "Price must be a valid non-negative number"
        });
    }

    if (
        stock === undefined ||
        stock === null ||
        stock === "" ||
        !Number.isInteger(Number(stock)) ||
        Number(stock) < 0
    ) {
        return res.status(400).json({
            message: "Stock must be a non-negative integer"
        });
    }

    const sql = `
        UPDATE products
        SET name = ?,
            description = ?,
            price = ?,
            stock = ?,
            image = ?,
            category = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name.trim(),
            description.trim(),
            Number(price),
            Number(stock),
            image.trim(),
            category.trim(),
            id
        ],
        (err, result) => {
            if (err) {
                console.error("UPDATE PRODUCT ERROR:", err);
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Product not found or no changes made"
                });
            }

            res.json({
                message: "Product updated successfully"
            });
        }
    );
});

module.exports = router;
