const mysql = require("mysql2");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "ecommerce",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("Database connection failed");
        console.log(err);
        return;
    }

    console.log("Connected to MySQL");
    connection.release();
});

module.exports = db;