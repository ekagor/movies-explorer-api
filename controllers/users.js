const { SECRET_KEY } = require('../utils/config');
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

// Функция для добавления нового пользователя
module.exports.addUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  // перед сохранением пользователя в базу данных, пароль пользователя хешируется с помощью bcrypt
  // принимает два аргумента: пароль и количество раундов хеширования (10)
  // хешированный пароль затем сохраняется вместо исходного пароля в базе данных
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => res.status(HTTP_STATUS_CREATED).send({
        name: user.name, _id: user._id, email: user.email,
      }))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(err.message));
        } else if (err.code === 11000) {
          next(new ConflictError(`Пользователь с email: ${email} уже зарегистрирован`));
        } else {
          next(err);
        }
      }));
};

// Функция получения информации о текущем пользователе
module.exports.getMeUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(next);
};

// Функция редактирования данных пользователя
module.exports.editUserData = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(`Пользователь с email: ${email} уже зарегистрирован`));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        next(err);
      }
    });
};

// Функция авторизации пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // после успешной аутентификации пользователя в User.findUserByCredentials(email, password), генерируется JWT токен.
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
// Функция jwt.sign() принимает три аргумента:
// данные, которые будут закодированы в токене ( _id пользователя)
// секретный ключ (SECRET_KEY) и опции для токена (expiresIn, указывающий срок действия токена).
// После генерации токена, он отправляется в ответе сервера с помощью res.send({ token }).