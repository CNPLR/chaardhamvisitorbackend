const BookedKeys = require("../model/bookedKeys.model.js");

const areKeysAvailable = async (keys) => {
  const bookedKeysDoc = await BookedKeys.findOne();
  if (!bookedKeysDoc) return true; // No booked keys, so all are available

  const alreadyBooked = keys.some((key) => bookedKeysDoc.keyNumbers.includes(key));
  
  return !alreadyBooked; // Return false if any key is already booked
};

module.exports = areKeysAvailable;
