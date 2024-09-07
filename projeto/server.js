const jwt = require('jsonwebtoken');

// Função para gerar um token JWT para o usuário
const gerarToken = (usuario) => {
    return jwt.sign(
        { id: usuario.id, nome: usuario.nome, admin: usuario.admin },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h', // O token expira em 1 hora
        }
    );
};

// Middleware para verificar o token JWT
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']; // Obtém o token do cabeçalho de autorização

    if (!token) {
        return res.status(401).send('Token não fornecido'); // Retorna erro se o token não for fornecido
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Token inválido'); // Retorna erro se o token for inválido
        }
        req.usuario = decoded; // Adiciona o usuário decodificado ao objeto req
        next(); // Chama o próximo middleware ou rota
    });
};

// Função para verificar se o usuário é um administrador
const verificarAdmin = (req, res, next) => {
    if (req.usuario.admin) {
        next(); // Se for admin, continua para a próxima função
    } else {
        res.status(403).send(
            'Acesso negado: apenas administradores podem acessar essa rota'
        );
    }
};

module.exports = {
    gerarToken,
    verificarToken,
    verificarAdmin,
};
