// Recieved a lint error for console.error in my catch blocks, unsure if exeption is needed. Leaving in for now

const Clothingitem = require('../models/clothingitem');
const { invalidDataError,
  notFoundError,
  serverError,
} = require("../utils/errors")

const getItems = (req, res) => {
  Clothingitem.find({})
  .orFail()
  .then((items) => res.status(200).send(items))
  .catch((err) => {
    // console.error(err);
    return res.status(serverError).send({message: err.message});
  })
}

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Clothingitem.create({ name, weather, imageUrl, owner })
  .then((item) => res.status(201).send(item))
  .catch((err) => {
    // console.error(err);
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
    // console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(notFoundError).send({message: err.message});
    }
    if (err.name === "CastError") {
      return res.status(invalidDataError).send({message: err.message});
    }
    return res.status(serverError).send({message: err.message});
  })
}

const addLike = (req, res) => {
  const { itemId } = req.params;
  Clothingitem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
  .orFail()
  .then((item) => res.status(200).send(item))
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

}

const deleteLike = (req, res) => {
  Clothingitem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
  .orFail()
  .then((item) => res.status(200).send(item))
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
}

module.exports = {getItems, createItem, deleteItem, addLike, deleteLike};