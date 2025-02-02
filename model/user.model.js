// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Method to compare password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//     // return await bcrypt.compare(enteredPassword, this.password);
//     return this.password === enteredPassword;
// };
const User = mongoose.model('User', userSchema);
module.exports = User;
// export default User;