const jwt = require('jsonwebtoken');
const { Config } = require('../config/config');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, Config.jwtSecretKey);
        req.userData = decoded;
        next();
    } catch(error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};