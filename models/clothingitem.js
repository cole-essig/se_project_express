const mongoose = require('mongoose');
const validator = require('validator');

const clothingItemSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
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
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  likes: {
    type: Array,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const Clothingitem = mongoose.model('Clothingitem', clothingItemSchema);
module.exports = Clothingitem;