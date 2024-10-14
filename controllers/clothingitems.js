const Clothingitem = require('../models/clothingitem');
const { invalidDataError,
  notFoundError,
  serverError,
  unauthorizedError,
  conflictError,
  forbiddenError
} = require("../utils/errors")

const getItem = (req, res) => {
  Clothingitem.find({})
  .then((items) => res.status(200).send(items))
  .catch((err) => {
    console.error(err);
    return res.status(serverError).send({message: err.message});
  })
}

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Clothingitem.create({ name, weather, imageUrl, owner })
  .then((item) => res.status(201).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(invalidDataError).send({message: err.message});
    }
    return res.status(serverError).send({message: err.message});
  })
}

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Clothingitem.findByIdAndDelete(itemId)
  .orFail()
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(notFoundError).send({message: err.message});
    } else if (err.name === "CastError") {
      return res.status(invalidDataError).send({message: err.message});
    }
    return res.status(serverError).send({message: err.message});
  })
}

module.exports = {getItem, createItem, deleteItem};