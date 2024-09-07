var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
require('dotenv').config();

const mongoose = require('mongoose');
const { Usuario } = require('./modelos/Modelos.js');

// Iniciar o banco de dados
// Carregar variáveis do MongoDB a partir do arquivo .env
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoHost = process.env.MONGO_HOST;
const mongoDb = process.env.MONGO_DB;
const mongoAuthSource = process.env.MONGO_AUTH_SOURCE || 'admin';

// Construir a URI do MongoDB
const mongoUri = `mongodb+srv://${mongoUser}:${mongoPassword}@${mongoHost}.ttpbv.mongodb.net/${mongoDb}?retryWrites=true&w=majority&appName=projeto`;
mongoose
    .connect(mongoUri)
    .then(async () => {
        console.log('Conectado ao MongoDB com sucesso!');

        // Cria um admin caso não exista no banco de dados
        try {
            const adminCount = await Usuario.countDocuments({
                admin: true,
            });

            // Verifica se há algum admin no sistema
            if (adminCount === 0) {
                // Cria o admin padrão
                const adminUser = new Usuario({
                    nome: 'admin',
                    senha: 'adminPassword123', // Troque para uma senha segura
                    email: 'admin@email.com',
                    admin: true,
                });

                await adminUser.save();
                console.log('Admin padrão criado com sucesso');
            }
        } catch (err) {
            console.error('Erro ao verificar/criar admin:', err);
        }
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var carrosRouter = require('./routes/cars');
var adminsRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/carros', carrosRouter);
app.use('/admins', adminsRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
