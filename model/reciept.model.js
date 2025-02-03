// models/User.js
const mongoose = require('mongoose');

const recieptSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    place: {
        type: String,
    },
    persons: {
        type: String,
    },
    locker: {
        type: Boolean,
        default: false
    },
    items: {
        type: String,
        default: "0"
    },
    key: {
        type: String,
        default: "0"
    },
    numberOfLocker: {
        type: String,
        default: "0"
    },
    ammount: {
        type: String,
        default: "0"
    },
    description: {
        type: String,
        default: null
    },
    company: {
        type: String,
    },
    receiptNo: {
        type: String,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true });

const Reciept = mongoose.model('Reciept', recieptSchema);
module.exports = Reciept;