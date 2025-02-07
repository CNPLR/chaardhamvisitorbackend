const mongoose = require("mongoose");

const bookedKeysSchema = new mongoose.Schema({
  keyNumbers: {
    type: [Number], // Array of booked key numbers
    default: [],
  },
});

const BookedKeys = mongoose.model("BookedKeys", bookedKeysSchema);

module.exports = BookedKeys;
