// Recieved a lint error for console.error in my catch blocks, unsure if exeption is needed. Leaving in for now

const User = require('../models/user')
const { invalidDataError,
  notFoundError,
  serverError,
} = require("../utils/errors")

const getUsers = (req, res) => {
  User.find({})
  .orFail()
  .then((users) => res.status(200).send(users))
  .catch((err) => {
    // console.error(err);
    return res.status(serverError).send({message: err.message});
  })
}

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
  .orFail()
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    // console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(notFoundError).send({message: err.message});
    }
    if (err.name === "CastError") {
      return res.status(invalidDataError).send({message: err.message});
    }
    return res.status(serverError).send({message: err.message});
  })
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
  .then((user) => res.status(201).send(user))
  .catch((err) => {
    // console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(invalidDataError).send({message: err.message});
    }
    return res.status(serverError).send({message: err.message});
  })
};

module.exports = { getUsers, getUser, createUser };