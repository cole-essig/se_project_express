const User = require('../models/user')
const { invalidDataError,
  notFoundError,
  serverError,
} = require("../utils/errors")

const getUsers = (req, res) => {
  User.find({})
  .then((users) => send(users))
  .catch((err) => {
    console.error(err);
    return res.status(serverError).send({message: "An error has occurred on the server"});
  })
}

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
  .orFail()
  .then((user) => send(user))
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
  const { name, avatar } = req.body;
  User.create({ name, avatar })
  .then((user) => send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(invalidDataError).send({message: "Invalid data"});
    }
    return res.status(serverError).send({message: "An error has occurred on the server"});
  })
};

module.exports = { getUsers, getUser, createUser };