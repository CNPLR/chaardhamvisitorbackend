// models/User.js
const mongoose = require('mongoose');

const recieptSchema = new mongoose.Schema({
    receiptNo: {
        type: String,
        unique: true
    },
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
        type: Array,
        default: []
    },
    ammount: {
        type: Number,
        default: 0
    },
    extraAmount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: null
    },
    company: {
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status:{
        type:String,
        enum:["active",'inactive'],
        default:"active"
    }

}, { timestamps: true });

const Reciept = mongoose.model('Reciept', recieptSchema);
module.exports = Reciept;