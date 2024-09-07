const { Carro } = require('../modelos/Modelos.js');

async function criarCarro(req, res) {
    try {
        const { marca, modelo, ano, preco } = req.body;

        const novoCarro = new Carro({
            marca,
            modelo,
            ano,
            preco,
            criador: req.body.criador
        });

        await novoCarro.save(); // Valida e salva no banco de dados
        res.send('Carro criado com sucesso');
    } catch (error) {
        res.status(400).send('Erro ao criar carro: ' + error.message);
    }
}

async function atualizarCarro(req, res) {
    try {
        const { marca, modelo, ano, preco } = req.body;

        const carroAtualizado = await Carro.findByIdAndUpdate(
            req.params.id,
            {
                marca,
                modelo,
                ano,
                preco,
            },
            { new: true, runValidators: true }
        );
        if (!carroAtualizado) {
            return res.status(404).send('Carro não encontrado');
        }
        res.send('Carro atualizado com sucesso');
    } catch (error) {
        res.status(400).send('Erro ao atualizar carro: ' + error.message);
    }
}

async function deletarCarro(req, res) {
    try {
        const carroDeletado = await Carro.findByIdAndDelete(req.params.id);
        if (!carroDeletado) {
            return res.status(404).send('Carro não encontrado');
        }
        res.send('Carro excluído com sucesso');
    } catch (error) {
        res.status(400).send('Erro ao excluir carro: ' + error.message);
    }
}

async function mostrarCarros(req, res) {
    try {
        const limite = parseInt(req.query.limite) || 5;
        const pagina = parseInt(req.query.pagina) || 1;

        // Verifica se o limite está entre os valores permitidos (5, 10, 30)
        if (![5, 10, 30].includes(limite)) {
            return res.status(400).send('Limite inválido. Use 5, 10 ou 30.');
        }

        const skip = (pagina - 1) * limite;

        const carros = await Carro.find().limit(limite).skip(skip);

        res.send(carros);
    } catch (error) {
        res.status(400).send('Erro ao listar carros: ' + error.message);
    }
}

const verificarCriador = async (req, res, next) => {
    const carro = await Carro.findById(req.params.id);

    if (!carro) {
        return res.status(404).send('Carro não encontrado');
    }

    if (carro.criador.toString() !== req.usuario.id) {
        return res.status(403).send('Não autorizado a modificar este carro');
    }

    next();
};

module.exports = {
    criarCarro,
    deletarCarro,
    atualizarCarro,
    mostrarCarros,
    verificarCriador,
};