const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definindo o esquema para o modelo de carro
const carroSchema = new Schema({
    marca: {
        type: String,
        required: true, // Obrigatório conter este campo
        minlength: 1,
    },
    modelo: {
        type: String,
        required: true, // Obrigatório conter este campo
        minlength: 1,
    },
    ano: {
        type: Number,
        required: true, // Obrigatório conter este campo
        min: 1886,
        max: new Date().getFullYear(),
    },
    preco: {
        type: Number,
        required: true, // Obrigatório conter este campo
        min: 0,
    },
    criador: {
        type: Schema.Types.ObjectId, // Referência para o ID do usuário
        required: true, // Obrigatório conter este campo
    },
});

// Definindo o esquema para o modelo de usuário
const usuarioSchema = new Schema({
    nome: {
        type: String,
        required: true, // Obrigatório conter este campo
        minlength: 1,
    },
    senha: {
        type: String,
        required: true, // Obrigatório conter este campo
        minlength: 6,
    },
    email: {
        type: String,
        required: true, // Adicionado campo de email
        unique: true,
    },
    telefone: {
        type: String,
        required: false, // Adicionado campo de telefone (opcional)
    },
    admin: {
        type: Boolean,
        default: false, // Valor padrão é `false`
    },
});


// Exportando os modelos
module.exports = {
    Carro: mongoose.model('carros', carroSchema),
    Usuario: mongoose.model('usuarios', usuarioSchema),
};
