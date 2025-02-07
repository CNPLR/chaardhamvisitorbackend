const express = require("express");
const getBookedKeys = require("../controller/bookedKeys.controller.js");

const router = express.Router();

router.get("/", getBookedKeys);

module.exports = router;
