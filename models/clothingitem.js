const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./user');

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlingth: 2,
    maxlength: 30
  },
  weather: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    required: true,

  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: 'You must enter a valid URL',
    }
  },
  // owner: {
  //   owner: User._id
  // },
  // likes: {
  //   likeBy: []
  // },
  // createdAt: {
  //   date: Date.now()
  // }
});

const Clothingitem = mongoose.model('Clothingitem', clothingItemSchema);
module.exports = Clothingitem;