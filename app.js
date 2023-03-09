const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { ERROR_CODE_404, ERROR_CODE_500 } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());

// подклчюение к mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.static(path.join(__dirname, 'public')));

// авторизация пользователя
app.post('/signin', login);

// создание нового пользователя
app.post('/signup', createUser);

// защита авторизацией
app.use(auth);

app.use('/cards', cardRouter);

app.use('/users', userRouter);


// обработчик ошибок celebrate
app.use(errors());

// централизованный обработчик ошибок
app.use((err, req, res, next) => {

  if (err) {
    res.status(err.statusCode).send({ message: err.message });
  }
  res.status(ERROR_CODE_500).send({ message: 'На сервере произошла ошибка.' });

});

// обработчик несуществующего рута
app.use((req, res) => {
  res.status(ERROR_CODE_404).send({ message: 'Запрошен несуществующий роут' });
});

app.listen(PORT);
