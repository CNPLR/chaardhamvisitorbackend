const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    keyNumber: {
        type: [String],
    }
});

const KeyTracker = mongoose.model("KeyTracker", counterSchema);

module.exports = KeyTracker;