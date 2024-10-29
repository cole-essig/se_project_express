const User = require('../models/user')
const { invalidDataError,
  notFoundError,
  serverError,
} = require("../utils/errors");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config')

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
  User.findOne({ email })
  .then((user) => {
    if (user) {
      return res.status(invalidDataError).send({message: "User or Password already exist"});
    }
    User.create({ name, avatar, email, password })
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      name: req.body.name,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
  })
  .then((user) => res.send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(invalidDataError).send({message: "Invalid data"});
    } else if (err.name === '11000') {
      return res.status(invalidDataError).send({message: "User or Password already exist"});
    }
    return res.status(serverError).send({message: "An error has occurred on the server"});
  })
};

const login = (req, res) => {
  const {email, password} = req.body;
  User.findUserByCredentials({email, password})
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.send({token});
  })
  .catch((err) => {
    console.err(err)
    if (err.name === 'ValidationError') {
      return res.status(invalidDataError).send({message: "Invalid data"});
    } else if (err.name === '11000') {
      return res.status(invalidDataError).send({message: "User or Password already exist"});
    }
    return res.status(serverError).send({message: "An error has occurred on the server"});
  })
}

module.exports = { getUsers, getUser, createUser, login };