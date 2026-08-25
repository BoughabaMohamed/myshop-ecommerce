const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Get All Categories
router.get("/", (req, res) => {

    db.query("SELECT * FROM categories", (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});

// Add Category
router.post("/", verifyToken, isAdmin, (req, res) => {

    const { name } = req.body;

    db.query(
        "INSERT INTO categories (name) VALUES (?)",
        [name],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Category added successfully"
            });

        }
    );

});

// Delete Category
router.delete("/:id", verifyToken, isAdmin, (req, res) => {

    db.query(
        "DELETE FROM categories WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Category deleted successfully"
            });

        }
    );

});

module.exports = router;