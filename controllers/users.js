const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

const { BadRequestError } = require("../errors/BadRequestError");
const { UnauthorizedError } = require("../errors/UnauthorizedError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ConflictError } = require("../errors/ConflictError");

const JWT_SECRET = require('../utils/config')

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
    bcrypt.hash(password, 10)
    .then(hash =>
      User.create({ name, avatar, email, password: hash })
    )
    .then((user) => res.status(201).send({ id: user._id, name: user.name, avatar: user.avatar, email: user.email }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user data"));
      } else if (err.code === 11000) {
        next(new ConflictError("User with this email already exists"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email or password not valid");
  }

  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.send({ token, user });
  })
  .catch((err) => {
    if (err.name === "UnauthorizedError") {
      next(new UnauthorizedError("Incorrect email or password"));
    } else if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid input data"));
    } else {
      next(err);
    }
  })
}

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.send({ id: user._id, name: user.name, avatar: user.avatar, email: user.email });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(_id, { name, avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return res.send({ id: user._id, name: user.name, avatar: user.avatar });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid input data"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID format"));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, login, getCurrentUser, updateProfile };