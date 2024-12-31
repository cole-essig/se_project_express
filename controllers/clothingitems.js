const Clothingitem = require('../models/clothingitem');
const { BadRequestError } = require("../errors/BadRequestError");
const { NotFoundError } = require("../errors/NotFoundError");
const { ForbiddenError } = require("../errors/ForbiddenError");

const getItems = (req, res) => {
  Clothingitem.find({})
  .then((items) => res.send(items))
  .catch((err) => next(err))
}

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Clothingitem.create({ name, weather, imageUrl, owner })
  .then((item) => res.send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "ValidationError") {
      next(new BadRequestError("This field is invalid"));
    } else {
      next(err);
    }
  })
}

const deleteItem = (req, res) => {
  const user = req.user._id
  const { itemId } = req.params;
  Clothingitem.findById(itemId)
  .orFail(() => {
    throw new NotFoundError("Item ID not found");
  })
  .then((item) => {
    if (user !== item.owner.toString()) {
      throw new ForbiddenError("Not authorized to delete item");
  }
  return Clothingitem.findByIdAndDelete(item._id)
      .then(() => res.send({message: "Item deleted"}));
  })
  .catch((err) => {
    console.error(err);
    if (err.name === "CastError") {
      next(new BadRequestError("The id is in an invalid format"));
    } else {
      next(err);
    }
  })
}

const addLike = (req, res) => {
  const { itemId } = req.params;
  Clothingitem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .orFail(() => {
    throw new NotFoundError("Item ID not found");
  })
  .then((item) => res.send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "CastError") {
      next(new BadRequestError("Id in incorrect format"));
    } else {
      next(err);
    }
  })

}

const deleteLike = (req, res) => {
  Clothingitem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
  .orFail(() => {
    throw new NotFoundError("Item ID not found");
  })
  .then((item) => res.send(item))
  .catch((err) => {
    console.error(err);
    if (err.name === "CastError") {
      next(new BadRequestError("Id in incorrect format"));
    } else {
      next(err);
    }
  })
}

module.exports = {getItems, createItem, deleteItem, addLike, deleteLike};