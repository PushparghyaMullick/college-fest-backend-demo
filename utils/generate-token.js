const jwt = require('jsonwebtoken');

const generateToken = async (userId, userRole, res) => {
    let token;
    try {
        token = jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, { expiresIn: '30d' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.cookie('jwt', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV !== 'development', 
            sameSite: 'strict', 
            maxAge: 30 * 24 * 60 * 60 * 1000 
    });

    return token;
}

module.exports = generateToken;