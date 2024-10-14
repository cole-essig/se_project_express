const Clothingitem = require('../models/clothingitem');
const { invalidDataError,
  notFoundError,
  serverError,
  unauthorizedError,
  conflictError,
  forbiddenError
} = require("../utils/errors")

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
    console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(notFoundError).send({message: err.message});
    } else if (err.name === "CastError") {
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
    console.error(err);
    if (err.name === 'DocumentNotFoundError') {
      return res.status(notFoundError).send({message: err.message});
    } else if (err.name === "CastError") {
      return res.status(invalidDataError).send({message: err.message});
    }
    return res.status(serverError).send({message: err.message});
  })
}

module.exports = {addLike, deleteLike}