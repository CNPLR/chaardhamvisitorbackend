const BookedKeys = require("../model/bookedKeys.model.js");


const getBookedKeys = async (req, res) => {
  try {
    const bookedKeysDoc = await BookedKeys.findOne();
    const bookedKeys = bookedKeysDoc ? bookedKeysDoc.keyNumbers : [];
    
    res.status(200).json({ success: true, bookedKeys });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = getBookedKeys;
