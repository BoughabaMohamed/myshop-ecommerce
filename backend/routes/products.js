const express = require("express");
const router = express.Router();

const db = require("../config/db");

const { verifyToken, isAdmin } = require("../middleware/auth");

router.get("/", (req, res) => {

  const sql = "SELECT * FROM products";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

router.post("/", verifyToken, isAdmin, (req, res) => {

  const { name,description, price, image, category, stock } = req.body;

  const sql = `
    INSERT INTO products
    (name,description, price, image, category, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `;  
  console.log(req.body);
  db.query(
    sql,
    [name,description, price, image, category, stock],
    (err, result) => {

    if (err) {
      console.log("MYSQL ERROR:");
      console.log(err);
      return res.status(500).json((err));
      
    }

    res.json({
      message: "Product added successfully"
    });
  });
});

router.delete("/:id", verifyToken, isAdmin, (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Product deleted successfully"
        });

    });

});

router.put("/:id", verifyToken, isAdmin, (req, res) => {

    const id = req.params.id;

    const { name, description, price, stock, image, category } = req.body;

    const sql = `
        UPDATE products
        SET
        name = ?,
        description = ?,
        price = ?,
        stock = ?,
        image = ?,
        category = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, description, price, stock, image, category, id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Product updated successfully"
            });

        }
    );

});

module.exports = router;