const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    numberOfLockers: {
        type: Number,
        default: 100
    }
});

const LockerCounter = mongoose.model("LockerCounter", counterSchema);

module.exports = LockerCounter;