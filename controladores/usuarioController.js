const { Usuario } = require('../modelos/Modelos.js');

async function criarUsuario(req, res) {
    try {
        // Verifica se já existe um usuário com o mesmo e-mail
        const usuarioExistente = await Usuario.findOne({
            email: req.body.email,
        });
        if (usuarioExistente) {
            return res.status(400).send('E-mail já cadastrado');
        }

        const { nome, email, senha } = req.body;

        // Cria um novo usuário
        const novoUsuario = new Usuario({
            nome: nome,
            email: email,
            senha: senha,
        });
        await novoUsuario.save();
        res.send('Usuário criado com sucesso');
    } catch (error) {
        res.status(400).send('Erro ao criar usuário: ' + error.message);
    }
}

async function deletarUsuario(req, res) {
    try {
        // Deleta o usuário pelo ID
        const usuarioDeletado = await Usuario.findOne({
            _id: req.params.id,
        });
        if (!usuarioDeletado) {
            return res.status(404).send('Usuário não encontrado');
        }
        if (usuarioDeletado.admin) {
            return res.status(404).send('Não se pode deletar um admin');
        }

        await usuarioDeletado.deleteOne({});
        res.send('Usuário excluído com sucesso');
    } catch (error) {
        res.status(400).send('Erro ao excluir usuário: ' + error.message);
    }
}

async function atualizarUsuario(req, res) {
    try {
        const { nome, email, senha } = req.body;

        // Atualiza o usuário pelo ID
        const usuarioAtualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            {
                nome,
                email,
                senha,
            },
            { new: true, runValidators: true }
        );
        if (!usuarioAtualizado) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.send('Usuário atualizado com sucesso');
    } catch (error) {
        res.status(400).send('Erro ao atualizar usuário: ' + error.message);
    }
}

async function mostrarUsuarios(req, res) {
    try {
        // Obtém parâmetros da query para limit e página
        const limite = parseInt(req.query.limite) || 5;
        const pagina = parseInt(req.query.pagina) || 1;

        // Verifica se o limite é válido (5, 10 ou 30)
        if (![5, 10, 30].includes(limite)) {
            return res.status(400).send('Limite inválido. Use 5, 10 ou 30.');
        }

        // Calcula o valor de skip para paginação
        const skip = (pagina - 1) * limite;

        // Busca usuários com paginação
        const usuarios = await Usuario.find().limit(limite).skip(skip);

        res.send(usuarios);
    } catch (error) {
        res.status(400).send('Erro ao listar usuários: ' + error.message);
    }
}

async function verificarProprietario(req, res, next) {
    try {
        // Encontra o usuário pelo ID
        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Verifica se o usuário autenticado é o proprietário ou um administrador
        if (usuario._id.toString() !== req.usuario.id && !req.usuario.isAdmin) {
            return res
                .status(403)
                .send(
                    'Você não tem permissão para excluir/atualizar este usuário'
                );
        }

        // Se o usuário for o proprietário ou um administrador, continua para a próxima função middleware
        next();
    } catch (error) {
        res.status(400).send('Erro ao verificar usuário: ' + error.message);
    }
}


module.exports = {
    criarUsuario,
    deletarUsuario,
    atualizarUsuario,
    mostrarUsuarios,
    verificarProprietario,
};