const jwt = require('jsonwebtoken')

const generateToken = function (_id) {
    try {
        const secret = process.env.JWT_SECRET;
        return jwt.sign({ _id }, secret, {
            expiresIn: '1D'
        });
    } catch (error) {
        console.log(error);
    }
}
module.exports = generateToken;
// export default generateToken;