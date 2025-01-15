const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.cookies.jwt;
        if (!token) {
            throw new Error('Authentication failed');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
}

module.exports = checkAuth;