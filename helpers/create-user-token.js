const jwt = require('jsonwebtoken');

const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        id: user._id,
        name: user.name,
        phone: user.phone
    }, process.env.SECRET);

    res.status(200).json({
        message: "Você está autenticado",
        token: token
    })
}

module.exports = createUserToken;