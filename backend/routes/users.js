const bcrypt = require("bcrypt");
const { verifyToken, isAdmin } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const db = require("../config/db");


// ================= ADMIN LOGIN =================


router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (
        typeof email !== "string" ||
        email.trim() === "" ||
        typeof password !== "string" ||
        password.trim() === ""
    ) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Ensure JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured");

        return res.status(500).json({
            message: "Internal server error"
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email.trim()], async (err, result) => {
        if (err) {
            console.error("Login database error:", err.message);

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

        // Only admins can log in
        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        try {
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
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h"
                }
            );

            return res.json({
                message: "Admin login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error("Login processing error:", error.message);

            return res.status(500).json({
                message: "Internal server error"
            });
        }
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


if (Number(id) === Number(req.user.id)) {
    return res.status(400).json({
        message: "You cannot delete your own account"
    });
}

if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({
        message: "Invalid user ID"
    });
}


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

    if (result.affectedRows === 0) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json({
        message: "User deleted successfully"
    });
});


});



module.exports = router;