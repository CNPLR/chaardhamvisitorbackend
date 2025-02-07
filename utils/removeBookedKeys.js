const BookedKeys = require("../model/bookedKeys.model.js");

const removeBookedKeys = async (keys) => {
    const bookedKeysDoc = await BookedKeys.findOne();
    if (!bookedKeysDoc) return false; // No document found
  
    bookedKeysDoc.keyNumbers = bookedKeysDoc.keyNumbers.filter((key) => !keys.includes(key));
    await bookedKeysDoc.save();
  
    return true; // Successfully removed keys
  };
  
  module.exports = removeBookedKeys;
  