const Pet = require('../models/Pet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helpers
const getToken = require('../helpers/get-token');

module.exports = class PetController {

    // Cadastrando um pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body;
        const available = true;

        if(!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
        }

        if(!age) {
            res.status(422).json({ message: "A idade é obrigatória!" });
        }

        if(!weight) {
            res.status(422).json({ message: "O peso é obrigatório!" });
        }

        if(!color) {
            res.status(422).json({ message: "A cor é obrigatória!" });
        }

        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.SECRET);

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            user: {
                _id: decoded.id,
                name: decoded.name,
                phone: decoded.phone
            }
        });

        try {
            const newPet = await pet.save()
            res.status(201).json({
                message: 'Pet cadastado com sucesso!',
                newPet
            });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Aconteceu um erro no servidor, tente novamente mais tarde." });
            return;
        }
    }

    // Busca todos os pets cadastrados no sistema
    static async getAll(req, res) {
        const pets = await Pet.find().sort('-createdAt');

        res.status(200).json({ pets: pets });
    }
}