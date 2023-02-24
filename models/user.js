const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле Имя обязательно к заполнению'],
    minlength: [2, 'Имя должно состоять как минимум из 2 символов'],
    maxlength: [30, 'Имя должно состоять максимум из 30 символов'],
  },

  about: {
    type: String,
    required: [true, 'Поле Профессия обязательно к заполнению'],
    minlength: [2, 'Профессия должна состоять как минимум из 2 символов'],
    maxlength: [30, 'Профессия должна состоять максимум из 30 символов'],
  },

  avatar: {
    type: String,
    required: [true, 'Поле Аватар обязательно к заполнению'],
  },
});

module.exports = mongoose.model('user', userSchema);
