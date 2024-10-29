const Clothingitem = require('../models/clothingitem');
const { invalidDataError,
  notFoundError,
  serverError,
  unauthorizedError,
} = require("../utils/errors")

const getItems = (req, res) => {
  Clothingitem.find({})
  .then((items) => res.send(items))
  .catch((err) => {
    console.error(err);
    return res.status(serverError).send({message: "An error has occurred on the server"});
  })
}

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Clothingitem.create({ name, weather, imageUrl, owner })
  .then((item) => res.send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(invalidDataError).send({message: "Invalid data"});
    }
    return res.status(serverError).send({message: "An error has occurred on the server"});
  })
}

const deleteItem = (req, res) => {
  const user = req.user._id
  const { itemId } = req.params;
  Clothingitem.findById(itemId)
  .orFail()
  .then((item) => {
    if (user === item.owner) {
      return Clothingitem.findByIdAndDelete(item._id)
      .orFail()
      .then((deletedItem) => res.send(deletedItem))
    }
    return res.status(unauthorizedError).send({message: "Item cannot be deleted"});
  })
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
}

const addLike = (req, res) => {
  const { itemId } = req.params;
  Clothingitem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .orFail()
  .then((item) => res.send(item))
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

}

const deleteLike = (req, res) => {
  Clothingitem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
  .orFail()
  .then((item) => res.send(item))
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
}

module.exports = {getItems, createItem, deleteItem, addLike, deleteLike};