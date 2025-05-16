const User = require('../models/User');
const Pet = require('../models/Pet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helpers
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, phone,  password, confirmpassword } = req.body;

        if(!name) {
            res.status(422).json({ message: 'O nome é obrigatório!' });
            return;
        }

        if(!email) {
            res.status(422).json({ message: 'O email é obrigatório!' });
            return;
        }

        if(!email.includes('@') || !email.includes('.')) {
            res.status(422).json({ message: 'Email inválido! Tente outro.' });
            return;
        }

        if(!phone) {
            res.status(422).json({ message: 'O número de contato é obrigatório!' });
            return;
        }

        if(!password) {
            res.status(422).json({ message: 'A senha é obrigatória!' });
            return;
        }

        if(!confirmpassword) {
            res.status(422).json({ message: 'A confirmação de senha é obrigatória!' });
            return;
        }

        if(password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem!' });
        }

        // Verifica se o e-mail já foi cadastrado 
        const userExists = await User.findOne({ email: email });

        if(userExists) {
            res.status(409).json({ message: 'E-mail já cadastrado! Utilize outro.' });
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

            res.status(500).json({ message: "Aconteceu um erro no servidor, tente novamente mais tarde." });
            return;
        }
    }

    static async login(req, res) {
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
            res.status(401).json({ message: 'Não há usuário cadastrado com este e-mail.' });
            return;
        }

        // Verifica se a senha é a mesma que está cadastrada no db
        const checkPassword = await bcrypt.compare(password, user.password);

        if(!checkPassword) {
            res.status(401).json({ message: 'Senha inválida!' });
            return;
        }

        await createUserToken(user, req, res);
     }

    static async checkUser(req, res) {
        let currentUser;

        if(req.headers.authorization) {
            const token = getToken(req);
            const decoded = jwt.verify(token, process.env.SECRET);
    
            currentUser = await User.findById(decoded.id);
            currentUser.password = undefined;   
        } else {
            currentUser = null;
        }

        res.status(200).send(currentUser);
     }

    static async getUserById(req, res) {
        const { id } = req.params;

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'ID Inválido!' });
            return;
        }

        const user = await User.findById(id).select('-password');

        if(!user) {
            res.status(404).json({ message: 'Usuário não encontrado!' })
            return;
        }

        res.status(200).send(user);
     }

    static async editUser(req, res) {
        const { id } = req.params;
        
        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'ID Inválido!' });
            return;
        }

        // Verifica se o usuário existe pelo id
        const user = await User.findById(id);
        if(!user) {
            res.status(404).json({ message: 'Usuário não encontrado!' });
            return;
        }

        const { name, email, phone, password, confirmpassword } = req.body;

        // Validações
         if(!name) {
            res.status(422).json({ message: 'O nome é obrigatório!'});
            return;
        }
        user.name = name;

        if(!email) {
            res.status(422).json({ message: 'O email é obrigatório!'});
            return;
        }

        if(!email.includes('@') || !email.includes('.')) {
            res.status(422).json({ message: 'Email inválido! Tente outro.'});
            return;
        }

        // Verifica se o e-mail já está em uso por outro usuário
        const userExists = await User.findOne({ email: email });
        if(user.email !== email && userExists) {
            res.status(409).json({ message: 'Email inválido! Tente outro.' });
            return;
        }
        user.email = email;

        if(!phone) {
            res.status(422).json({ message: 'O número de contato é obrigatório!'});
            return;
        }
        user.phone = phone;

        if(password !== confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem!' });
            return;
        } else if(password === confirmpassword && password != null) {
            // Cria uma nova senha
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);

            user.password = passwordHash;
        }

        // Verifica se o usuário logado possui o mesmo id que será atualizado
        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.SECRET);

        if(user._id.toString() !== decoded.id.toString()) {
            res.status(403).json({ message: 'Acesso Negado. Não é possível processar sua solicitação.' });
            return;
        }

        try {
            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )
            
            res.status(200).json({ message: 'Usuário atualizado com sucesso!' })
        } catch (error) {
            console.log(error);

            res.status(500).json({ message: "Aconteceu um erro no servidor, tente novamente mais tarde." });
            return;
        }
    }

    static async deleteUser(req, res) {
        const { id } = req.params;
        
        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'ID Inválido!' });
            return;
        }

        // Verifica se o usuário existe pelo id
        const user = await User.findById(id);
        if(!user) {
            res.status(404).json({ message: 'Usuário não encontrado!' });
            return;
        }

        // Verifica se o usuário logado possui o mesmo id que será removido
        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.SECRET);

        if(user._id.toString() !== decoded.id.toString()) {
            res.status(403).json({ message: 'Acesso Negado. Não é possível processar sua solicitação.' });
            return;
        }

        try {
            // Remoção do usuário e todos pets vinculados a ele
            await Pet.deleteMany({ 'user._id': decoded.id });
            await User.deleteOne({ _id: id });

            res.status(200).json({ message: 'Usuário removido com sucesso.' });
        } catch (error) {
            console.log(error);
            
            res.status(500).json({ message: 'Aconteceu um erro no servidor, tente novamente mais tarde.' });
            return;
        }
    }
}
