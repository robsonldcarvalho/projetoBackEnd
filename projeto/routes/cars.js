var express = require('express');
var router = express.Router();
const { verificarToken } = require('../server.js');
const { Usuario } = require('../modelos/Modelos.js');
const { Carro } = require('../modelos/Modelos.js');
const {criarCarro, deletarCarro, atualizarCarro, mostrarCarros, verificarCriador,} = require('../controladores/carroController.js');

// Função para inserir o criador do carro
const inserirCriador = (req, res, next) => {
    req.body.criador = req.usuario.id;

    next();
};

//GET carros listing.
router.get('/Todos', mostrarCarros);
//GET para mostrar a quantidade modelos e marcas no sistema
router.get('/marcasDiferentes', async function (req, res, next) {
    const carros = await Carro.find({}); // Pega a lista de todos os carros do sistema

    let marcas = []; // Lista de todas as marcas (sem repetição)
    let modelos = []; // Lista de todos os modelos (sem repetição)

    // Loop que percore todos os carros
    for (let carro of carros) {
        // Se a marca não existe na lista de marcas, o adiciona
        if (!marcas.includes(carro.marca)) {
            marcas.push(carro.marca);
        }
        // Se o modelo não existe na lista de modelos, o adiciona
        if (!modelos.includes(carro.modelo)) {
            modelos.push(carro.modelo);
        }
    }

    res.send({
        marcas: marcas.length, // Mostra a quantidade de itens na lista (quantidade de marcas)
        modelos: modelos.length, // Mostra a quantidade de itens na lista (quantidade de modelos)
    });
});
// GET para mostrar marcas com mais de um carro
router.get('/marcasIguais', async function (req, res, next) {
    try {
        // Agrupar carros por marca e contar quantos carros cada marca possui
        const marcasComMaisDeUmCarro = await Carro.aggregate([
            {
                $group: {
                    _id: '$marca', // Agrupa por marca
                    count: { $sum: 1 }, // Conta o número de carros por marca
                },
            },
            {
                $match: {
                    count: { $gt: 1 }, // Filtra as marcas que possuem mais de um carro
                },
            },
        ]);

        // Resposta com as marcas que possuem mais de um carro
        res.json(marcasComMaisDeUmCarro);
    } catch (error) {
        next(error); // Tratar erro, se ocorrer
    }
});


//POST novo carro.
router.post('/cadastrar', verificarToken, inserirCriador, criarCarro);

//PUT para atualizar um carro.
router.put('/atualizar/:id', verificarToken, verificarCriador, atualizarCarro,);


//DELETE para excluir um carro.
router.delete('/excluir/:id', verificarToken, verificarCriador, deletarCarro);

module.exports = router;