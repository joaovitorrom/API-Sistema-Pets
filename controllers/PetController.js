const Pet = require('../models/Pet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helpers
const getToken = require('../helpers/get-token');
const ObjectId = require('mongoose').Types.ObjectId;

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

    // Busca todos os pets de um usuário
    static async getAllUserPets(req, res) {
        // Busca usuário pelo token
        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.SECRET);

        const pets = await Pet.find({ 'user._id': decoded.id}).sort('-createdAt');

        res.status(200).json({ pets });
    }

    static async getPetById(req, res) {
        const { id } = req.params;

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID Inválido!' });
            return;
        }

        // Verifica se o Pet foi cadastrado
        const pet = await Pet.findOne({ _id: id });
        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        res.status(200).json({ pet: pet });
    }

    static async removePetById(req, res) {
        const { id } = req.params;

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID Inválido!' });
            return;
        }

        // Verifica se o Pet foi cadastrado
        const pet = await Pet.findOne({ _id: id });
        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        // Verifica se o usuário logado cadastrou o pet
        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.SECRET);

        if(pet.user._id.toString() !== decoded.id.toString()) {
            res.status(422).json({ message: 'Não é possível processar sua solicitação.' });
            return;
        }

        await Pet.findByIdAndRemove(id);
        res.status(200).json({ message: 'Pet removido com sucesso!' });
    }

    static async updatePet(req, res) {
        const { id } = req.params;

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID Inválido!' });
            return;
        }

        const { name, age, weight, color, available } = req.body;
     
        const updatedData = {};

        // Verifica se o Pet foi cadastrado
        const pet = await Pet.findOne({ _id: id });
        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        // Verifica se o usuário logado cadastrou o pet
        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.SECRET);

        if(pet.user._id.toString() !== decoded.id.toString()) {
            res.status(422).json({ message: 'Não é possível processar sua solicitação.' });
            return;
        }

        if(!name) {
            res.status(422).json({ message: "O nome é obrigatório!" });
        } else {
            updatedData.name = name;
        }

        if(!age) {
            res.status(422).json({ message: "A idade é obrigatória!" });
        } else {
            updatedData.age = age;
        }

        if(!weight) {
            res.status(422).json({ message: "O peso é obrigatório!" });
        } else {
            updatedData.weight = weight;
        }

        if(!color) {
            res.status(422).json({ message: "A cor é obrigatória!" });
        } else {
            updatedData.color = color;
        }

        updatedData.available = available;
        
        await Pet.findByIdAndUpdate(id, updatedData);
        res.status(200).json({
            message: 'Pet atualizado com sucesso!',
            data: updatedData
        });
    }

    static async schedule(req, res) {
        const { id } = req.params;

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID Inválido!' });
            return;
        }

         // Verifica se o Pet foi cadastrado
        const pet = await Pet.findOne({ _id: id });
        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        // Verifica se o usuário logado cadastrou o pet
        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.SECRET);

        if(pet.user._id.toString() === decoded.id.toString()) {
            res.status(422).json({ message: 'Você não pode agendar uma visita com o seu próprio Pet!' });
            return;
        }

        // Verifica se o usuário já agendou uma visita
        if(pet.adopter) {
            if(pet.adopter._id === decoded.id && pet.available === true) {
                res.status(422).json({ message: 'Você já agendou uma visita para este Pet!' });
                return;
            }
        }

        // Verifica se o pet está disponível para adoção
        if(pet.available === false){
            res.status(422).json({ message: 'Esse Pet não está disponível para adoção no momento.' });
            return;
        }

        // Adiciona usuário como adotante do pet
        pet.adopter = {
            _id: decoded.id,
            name: decoded.name
        }

        await Pet.findByIdAndUpdate(id, pet);
        res.status(200).json({ message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}` });
    }

    static async concludeAdoption(req, res) {
        const { id } = req.params;

        // Verifica se o id é válido
        if(!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID Inválido!' });
            return;
        }

        // Verifica se o Pet foi cadastrado
        const pet = await Pet.findOne({ _id: id });
        if(!pet) {
            res.status(404).json({ message: 'Pet não encontrado!' });
            return;
        }

        // Verifica se o usuário logado cadastrou o pet
        const token = getToken(req);
        const decoded = jwt.verify(token, process.env.SECRET);

        if(pet.user._id.toString() !== decoded.id.toString()) {
            res.status(422).json({ message: 'Não é possível processar sua solicitação.' });
            return;
        }

        pet.available = false;

        await Pet.findByIdAndUpdate(id, pet);
        res.status(200).json({
            message: 'Parabéns! O ciclo de adoção foi finalizado com sucesso!'
        })
    }
}