const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied"
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(token, "mysecretkey");

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(403).json({
            message: "Invalid token"
        });

    }

}

function isAdmin(req, res, next) {

    if (req.user.role !== "admin") {

        return res.status(403).json({
            message: "Admins only"
        });

    }

    next();

}

module.exports = {
    verifyToken,
    isAdmin
};