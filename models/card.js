const mongoose = require('mongoose');
const { regexUrl } = require('../utils/regexUrl');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле Название обязательно к заполнению'],
    minlength: [
      2,
      'Название карточки должно состоять как минимум из 2 символов',
    ],
    maxlength: [
      30,
      'Название карточки должно состоять максимум из 30 символов',
    ],
  },

  link: {
    type: String,
    required: [true, 'Поле Ссылка обязательно к заполнению'],
    validate: {
      // eslint-disable-next-line object-shorthand, space-before-function-paren, func-names
      validator: function (v) {
        return regexUrl.test(v);
      },
      message: 'Введите корректную ссылку',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },

  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
