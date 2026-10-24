
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied"
        });
    }

    const parts = authHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer" ||
        !parts[1]
    ) {
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured");

        return res.status(500).json({
            message: "Internal server error"
        });
    }

    try {
        const decoded = jwt.verify(
            parts[1],
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}

function isAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
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