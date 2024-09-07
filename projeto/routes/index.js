var express = require('express');
var router = express.Router();

const { Usuario, Carro } = require('../modelos/Modelos.js');

// Função para criar e popular o banco de dados
router.get('/install', async (req, res) => {
    try {
        // Verifica se a coleção de usuários já existe e está populada
        const userCount = await Usuario.countDocuments({ admin: false });
        if (userCount === 0) {
            const usuarios = [
                { nome: 'User1', senha: 'senha1',   email: 'user1@email.com', admin: false },
                { nome: 'User2', senha: 'senha2',   email: 'user2@email.com', admin: false },
                { nome: 'User3', senha: 'senha3',   email: 'user3@email.com', admin: false },
                { nome: 'User4', senha: 'senha4',   email: 'user4@email.com', admin: false },
                { nome: 'User5', senha: 'senha5',   email: 'user5@email.com', admin: false },
            ];
            const createdUsers = await Usuario.insertMany(usuarios);
            console.log('Usuários inseridos com sucesso!');

            // Obtendo os IDs dos usuários para associá-los aos carros
            const user1Id = createdUsers[0]._id;
            const user2Id = createdUsers[1]._id;
            const user3Id = createdUsers[2]._id;
            const user4Id = createdUsers[3]._id;
            const user5Id = createdUsers[4]._id;

            // Verifica se a coleção de carros já existe e está populada
            const carCount = await Carro.countDocuments();
            if (carCount === 0) {
                const carros = [
                    {
                        marca: 'Toyota',
                        modelo: 'Corolla',
                        ano: 2020,
                        criador: user1Id,
                        preco: 20000,
                    },
                    {
                        marca: 'Honda',
                        modelo: 'Civic',
                        ano: 2019,
                        criador: user2Id,
                        preco: 18000,
                    },
                    {
                        marca: 'Ford',
                        modelo: 'Mustang',
                        ano: 2021,
                        criador: user3Id,
                        preco: 30000,
                    },
                    {
                        marca: 'Chevrolet',
                        modelo: 'Camaro',
                        ano: 2020,
                        criador: user4Id,
                        preco: 35000,
                    },
                    {
                        marca: 'Tesla',
                        modelo: 'Model S',
                        ano: 2022,
                        criador: user5Id,
                        preco: 70000,
                    },
                ];
                await Carro.insertMany(carros);
                console.log('Carros inseridos com sucesso!');
            }
        }

        res.send('Instalação do banco de dados concluída com sucesso!');
    } catch (error) {
        console.error('Erro durante a instalação do banco de dados:', error);
        res.status(500).send(
            'Erro durante a instalação do banco de dados: ' + error.message
        );
    }
});

module.exports = router;
