const bcrypt = require("bcrypt");
const { verifyToken, isAdmin } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const db = require("../config/db");


// ================= ADMIN LOGIN =================

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result[0];

        // Only ADMIN can login
        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            "mysecretkey",
            {
                expiresIn: "2h"
            }
        );

        res.json({

            message: "Admin login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    });

});


// ================= GET ALL USERS =================

router.get("/", verifyToken, isAdmin, (req, res) => {

    const sql = `
        SELECT id, name, email, role
        FROM users
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json(result);

    });

});


// ================= DELETE USER =================

router.delete("/:id", verifyToken, isAdmin, (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM users
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.json({
            message: "User deleted successfully"
        });

    });

});


module.exports = router;