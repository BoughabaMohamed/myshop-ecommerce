const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Get All Categories
router.get("/", (req, res) => {

    db.query("SELECT * FROM categories", (err, result) => {

        if (err) {
    return res.status(500).json({
        message: "Database error"
    });
}

        res.json(result);

    });

});

// Add Category
router.post("/", verifyToken, isAdmin, (req, res) => {


const { name } = req.body;

// Validate category name
if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
        message: "Category name is required"
    });
}

db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name.trim()],
    (err) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.status(201).json({
            message: "Category added successfully"
        });

    }
);


});


// Delete Category
router.delete("/:id", verifyToken, isAdmin, (req, res) => {

    const id = req.params.id;

    if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).json({
            message: "Invalid category ID"
        });
    }

    db.query(
        "DELETE FROM categories WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }

            res.json({
                message: "Category deleted successfully"
            });
        }
    );

});


module.exports = router;