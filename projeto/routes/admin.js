var express = require('express');
var router = express.Router();
const { verificarToken, gerarToken } = require('../server.js');
const {
    deletarUsuario,
    atualizarUsuario,
} = require('../controladores/usuarioController.js');
const { Usuario } = require('../modelos/Modelos.js');

// Função auxiliar para verificar se o usuário é um administrador
async function verificarAdmin(req, res, next) {
    try {
        const admin = await Usuario.findById(req.usuario.id);
        if (!admin || !admin.admin) {
            return res
                .status(403)
                .send('Você não tem permissão para acessar esta área');
        }
        next();
    } catch (error) {
        res.status(400).send(
            'Erro ao verificar administrador: ' + error.message
        );
    }
}


// Rota GET para listar administradores
router.get(
    '/todosAdmin',
    verificarToken,
    verificarAdmin,
    async function (req, res, next) {
        try {
            const admins = await Usuario.find({ admin: true });
            res.send(admins);
        } catch (error) {
            res.status(400).send(
                'Erro ao listar administradores: ' + error.message
            );
        }
    }
);

// Rota POST para login de administrador
router.post('/logar', async function (req, res, next) {
    const { nome, senha } = req.body;
    const admin = await Usuario.findOne({ nome, senha, admin: true });

    if (!admin) {
        return res.status(401).send('Credenciais inválidas');
    }

    // Gera um token JWT para o administrador
    const token = gerarToken(admin);
    res.json({ token });
});

// Rota PUT para atualizar um administrador
router.put('/atualizar/:id', verificarToken, verificarAdmin, atualizarUsuario);

// Rota PUT para promover um usuário a administrador
router.put(
    '/promover/:id',
    verificarToken,
    verificarAdmin,
    async function (req, res) {
        try {
            const idUsuario = req.params.id;
            const usuario = await Usuario.findById(idUsuario);
            if (!usuario) {
                return res.status(404).send('Usuário não encontrado');
            }

            // Promove o usuário a administrador
            usuario.admin = true;
            await usuario.save();
            res.send('Usuário promovido a administrador com sucesso');
        } catch (error) {
            res.status(400).send('Erro ao promover usuário: ' + error.message);
        }
    }
);


// Rota DELETE para excluir um administrador
router.delete('/excluir/:id', verificarToken, verificarAdmin, deletarUsuario);


module.exports = router;
