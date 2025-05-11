const jwt = require('jsonwebtoken');
const getToken = require('./get-token');

const verifyToken = (req, res, next) => {
    if(!req.headers.authorization){
        res.status(401).json({ message: 'Acesso Negado!' });
        return;
    }

    const token = getToken(req);

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.id = decoded.id;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido!' });
        return;
    }
}

module.exports = verifyToken;