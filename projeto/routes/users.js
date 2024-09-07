var express = require('express');
var router = express.Router();
const { verificarToken, gerarToken } = require('../server.js');
const {criarUsuario, deletarUsuario, atualizarUsuario, mostrarUsuarios, verificarProprietario,} = require('../controladores/usuarioController.js');

const { Usuario } = require('../modelos/Modelos.js');
const { Carro } = require('../modelos/Modelos.js');
// Rota GET para listar usuários
router.get('/todosUsuarios', verificarToken, mostrarUsuarios);

// Rota POST para login
router.post('/logar', async function (req, res, next) {
    const { nome, senha } = req.body;
    const usuario = await Usuario.findOne({ nome, senha });

    if (!usuario) {
        return res.status(401).send('Credenciais inválidas');
    }

    // Gera um token JWT para o usuário
    const token = gerarToken(usuario);
    res.json({ token });
});

// Rota para obter os carros criados pelo usuário autenticado
router.get('/meusCarros', verificarToken, async (req, res) => {
    try {
        const carros = await Carro.find({ criador: req.usuario.id });
        res.json(carros);
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro interno do servidor');
    }
});

// Rota POST para registrar novo usuário
router.post('/registrar', criarUsuario);

// Rota PUT para atualizar um usuário
router.put('/atualizar/:id', verificarToken, verificarProprietario, atualizarUsuario);

// Rota DELETE para excluir um usuário
router.delete('/excluir/:id', verificarToken, verificarProprietario, deletarUsuario);

module.exports = router;
