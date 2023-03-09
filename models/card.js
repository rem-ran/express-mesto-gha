const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  link: {
    type: String,
    // validate: {
    //   validator: function(v) {
    //     return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(v);
    //   },
    //   message: 'Введите корректную ссылку'
    // },
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
