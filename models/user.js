const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const isEmail = require('validator/lib/isEmail');
const { regexUrl } = require('../utils/regexUrl');
const AuthError = require('../errors/AuthError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Имя должно состоять как минимум из 2 символов'],
    maxlength: [30, 'Имя должно состоять максимум из 30 символов'],
  },

  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Профессия должна состоять как минимум из 2 символов'],
    maxlength: [30, 'Профессия должна состоять максимум из 30 символов'],
  },

  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      // eslint-disable-next-line object-shorthand, space-before-function-paren, func-names
      validator: function (v) {
        return regexUrl.test(v);
      },
      message: 'Введите корректную ссылку',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле email обязательно к заполнению'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new AuthError('Неправильные почта или пароль'),
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new AuthError('Неправильные почта или пароль'),
          );
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
