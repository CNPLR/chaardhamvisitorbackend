const BookedKeys = require("../model/bookedKeys.model");



const addBookedKeys = async (keys) => {
  try {
    let bookedKeysDoc = await BookedKeys.findOne();

    if (!bookedKeysDoc) {
      // If no document exists, create a new one
      bookedKeysDoc = new BookedKeys({ keyNumbers: keys });
    } else {
      // Add only unique keys that are not already booked
      const uniqueKeys = keys.filter((key) => !bookedKeysDoc.keyNumbers.includes(key));
      bookedKeysDoc.keyNumbers.push(...uniqueKeys);
    }

    await bookedKeysDoc.save();
    return true;
  } catch (error) {
    console.error(error);
    return false
    // return { success: false, message: "Error adding keys" };
  }
};

module.exports = addBookedKeys;
