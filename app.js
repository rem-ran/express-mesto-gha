const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
// const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { ERROR_CODE_404 } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

// подклчюение к mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// авторизация пользователя
app.post('/signin', login);

// создание нового пользователя
app.post('/signup', createUser);

// мидлвэр временного решения авторизации, согласно 13го ТЗ
app.use((req, res, next) => {
  req.user = {
    _id: '63f6889ab055656c593c4a8a',
  };

  next();
});

// авторизация
// app.use(auth);

app.use('/cards', cardRouter);

app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  res.status(ERROR_CODE_404).send({ message: 'Запрошен несуществующий роут' });
});

app.listen(PORT);
