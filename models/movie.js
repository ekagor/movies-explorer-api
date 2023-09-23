const mongoose = require('mongoose');
const { httpRegex } = require('../utils/constants');

const movieSchema = new mongoose.Schema({

  // страна создания фильма. Обязательное поле-строка.
  country: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },

  // режиссёр фильма. Обязательное поле-строка.
  director: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },

  // длительность фильма. Обязательное поле-число.
  duration: {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
  },

  // год выпуска фильма. Обязательное поле-строка.
  year: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },

  // описание фильма. Обязательное поле-строка.
  description: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },

  // ссылка на постер к фильму. Обязательное поле-строка. Запишите её URL-адресом.
  image: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) {
        return httpRegex.test(url);
      },
      message: 'Введите URL',
    },
  },

  // ссылка на трейлер фильма. Обязательное поле-строка. Запишите её URL-адресом
  trailerLink: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) {
        return httpRegex.test(url);
      },
      message: 'Введите URL',
    },
  },

  // миниатюрное изображение постера к фильму. Обязательное поле-строка. Запишите её URL-адресом.
  thumbnail: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) {
        return httpRegex.test(url);
      },
      message: 'Введите URL',
    },
  },

  // _id пользователя, который сохранил фильм. Обязательное поле.
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  // id фильма, который содержится в ответе сервиса MoviesExplorer. Обяз-ое поле в формате number.
  movieId: {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
  },

  // название фильма на русском языке. Обязательное поле-строка.
  nameRU: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },

  // название фильма на английском языке. Обязательное поле-строка.
  nameEN: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
