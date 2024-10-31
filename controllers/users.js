const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const { invalidDataError, notFoundError, serverError, conflictError } = require("../utils/errors");
const JWT_SECRET = require('../utils/config')

const getUsers = (req, res) => {
  User.find({})
  .then((users) => res.send(users))
  .catch((err) => {
    console.error(err);
    return res.status(serverError).send({message: "An error has occurred on the server"});
  })
}

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
  .orFail()
  .then((user) => res.send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(notFoundError).send({message: err.message});
    }
    if (err.name === "CastError") {
      return res.status(invalidDataError).send({message: "Invalid data"});
    }
    return res.status(serverError).send({message: "An error has occurred on the server"});
  })
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
    bcrypt.hash(password, 10)
    .then((hash) => {
      return User.create({ name, avatar, email, password: hash })
    })
    .then((user) => res.status(201).send({ id: user._id, name: user.name, avatar: user.avatar, email: user.email })) // Send only needed fields
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(invalidDataError).send({ message: "Invalid data" });
      } if (err.code === 11000) {
        return res.status(conflictError).send({ message: "User already exists" });
      } if (err.code === 409) {
        return res.status(409).send({message: "This email already exists"})
      } if (err.name === 'CastError') {
        return res.status(invalidDataError).send({message: "This email or password doesn't exist"})
      }
      return res.status(serverError).send({ message: "An error has occurred on the server" });
    });
};

const login = (req, res) => {
  const {email, password} = req.body;
  User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.send({token});
  })
  .catch((err) => {
    console.error(err)
    if (err.name === 'ValidationError') {
      return res.status(invalidDataError).send({message: "Invalid data"});
    } if (err.name === '11000') {
      return res.status(invalidDataError).send({message: "User or Password already exist"});
    } if (err) {
      return res.status(invalidDataError).send({message: "Incorrect email or password"});
    }
    return res.status(serverError).send({message: "An error has occurred on the server"});
  })
}

const getCurrentUser = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(notFoundError).send({ message: "User not found" });
      }
      return res.send({ id: user._id, name: user.name, avatar: user.avatar, email: user.email });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(notFoundError).send({ message: "User not found" });
      }
      return res.status(serverError).send({ message: "An error has occurred on the server" });
    });
};

const updateProfile = (req, res) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(_id, { name, avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        return res.status(notFoundError).send({ message: "User not found" });
      }
      return res.send({ id: user._id, name: user.name, avatar: user.avatar });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res.status(notFoundError).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(invalidDataError).send({ message: "Invalid data" });
      }
      return res.status(serverError).send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, getUser, createUser, login, getCurrentUser, updateProfile };