const express = require('express');
const cors = require("cors");
const db = require("./config/db");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const orderRoutes = require("./routes/orders");
const categoryRoutes = require("./routes/categories");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);

app.get("/", (req, res) => {
    res.send("welcome to the E-commerce API");
});

const PORT = 3000;

const upload = require("./upload");

app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("image"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    res.json({
        image: req.file.filename
    });

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});