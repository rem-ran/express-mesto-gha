const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const { celebrate, Joi, errors, isCelebrateError } = require('celebrate');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { ERROR_CODE_404, ERROR_CODE_500, ERROR_CODE_400 } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

app.use(bodyParser.json());

// подклчюение к mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.static(path.join(__dirname, 'public')));

// авторизация пользователя с валидацией
app.post('/signin', celebrate({

body: Joi.object().keys({
  email: Joi.string().required().min(2).max(30),
  password: Joi.string().required().min(2).max(30),
}),

}), login);

// создание нового пользователя с валидацией
app.post('/signup', celebrate({

body: Joi.object().keys({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().required(),
}),

}), createUser);

// защита дальнейших рутов авторизацией
app.use(auth);

app.use('/cards', cardRouter);

app.use('/users', userRouter);




// app.use((err, req, res, next) => {

//   if (isCelebrateError(err)) {
//     res.status(ERROR_CODE_400).send({ message: err})
//   }

//   next(err);
// });

// обработчик ошибок celebrate
app.use(errors());

// централизованный обработчик ошибок
app.use((err, req, res, next) => {

  // обработчик ошибок celebrate
  // if (isCelebrateError(err)) {
  //   res.status(ERROR_CODE_400).send({message: err.message})
  // }

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
