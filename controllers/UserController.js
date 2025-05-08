const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = class UserController {
    static async register(req,res) {
        const { name, email, phone,  password, confirmpassword } = req.body;

        if(!name) {
            res.status(422).json({ message: 'O nome é obrigatório!'});
            return;
        }

        if(!email) {
            res.status(422).json({ message: 'O email é obrigatório!'});
            return;
        }

        if(!email.includes('@') || !email.includes('.')) {
            res.status(422).json({ message: 'Email inválido! Tente outro.'});
            return;
        }

        if(!phone) {
            res.status(422).json({ message: 'O número de contato é obrigatório!'});
            return;
        }

        if(!password) {
            res.status(422).json({ message: 'A senha é obrigatória!'});
            return;
        }

        if(!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória!'});
            return;
        }

        if(password !== confirmpassword) {
            res.status(422).json({ message: 'A senha e a confirmação de senha precisam ser iguais!'});
        }

        // Verifica se o e-mail já foi cadastrado 
        const userExists = await User.findOne({ email: email });

        if(userExists) {
            res.status(422).json({ message: 'E-mail já cadastrado, utilize outro.' });
            return;
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            phone,
            password: passwordHash
        })

        try {
            const newUser = await user.save();
            res.status(200).json({
                message: 'Usuário cadastrado com sucesso!',
                newUser,
            })
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}
