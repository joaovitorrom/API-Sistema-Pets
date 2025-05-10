const jwt = require('jsownwebtoken');

const createUserToken = async (user, req, res) => {
    const token = jwt.sign({
        id: user._id,
        name: user.name
    }, process.env.SECRET);

    res.status(200).json({
        message: "Você está autenticado",
        token: token
    })
}

module.exports = createUserToken;