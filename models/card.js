const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Поле Название обязательно к заполнению'],
    // minlength: [
    //   2,
    //   'Название карточки должно состоять как минимум из 2 символов',
    // ],
    // maxlength: [
    //   30,
    //   'Название карточки должно состоять максимум из 30 символов',
    // ],
  },

  link: {
    type: String,
    // required: [true, 'Поле Ссылка обязательно к заполнению'],
    validate: {
      validator: function(v) {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(v);
      },
      message: 'Введите корректную ссылку'
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
