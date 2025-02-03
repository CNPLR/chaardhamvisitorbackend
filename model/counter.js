const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "receipt-202501"
    seq: { type: Number, default: 1 } // Monthly sequential number
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;