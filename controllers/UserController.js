const User = require('../models/User');
const bcrypt = require('bcrypt');
const createUserToken = require('../helpers/create-user-token');

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
            await createUserToken(newUser, req, res);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Aconteceu um erro no servidor, tente novamente mais tarde!" });
        }
    }

     static async login(req,res) {
        const { email, password } = req.body;

        if(!email) {
            res.status(422).json({ message: 'O email é obrigatório!'});
            return;
        }

        if(!email.includes('@') || !email.includes('.')) {
            res.status(422).json({ message: 'Email inválido! Tente outro.'});
            return;
        }

         if(!password) {
            res.status(422).json({ message: 'A senha é obrigatória!'});
            return;
        }

        // Verifica se o usuário existe no sistema
        const user = await User.findOne({ email: email });

        if(!user) {
            res.status(422).json({ message: 'Não há usuário cadastrado com este e-mail!' });
            return;
        }

        // Verifica se a senha é a mesma que está cadastrada no db
        const checkPassword = await bcrypt.compare(password, user.password);

        if(!checkPassword) {
            res.status(422).json({
                message: 'Senha inválida'
            })
            return;
        }

        await createUserToken(user, req, res);
     }
}
