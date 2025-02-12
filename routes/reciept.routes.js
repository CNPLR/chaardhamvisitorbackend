const express = require('express');
const router = express.Router();

const userReciept = require('../controller/Reciept.controller.js');

const { createReciept, readReciept, readRecieptById, updateReciept, deleteReciept, getReceiptByQuery, getfilteredData, dataByUser, getReceiptByGate } = userReciept;

// User Routes
router.post('/databyuser', dataByUser);
router.post('/databygate', getReceiptByGate);
router.post('/', createReciept);
router.post('/filtereduserdata', getReceiptByQuery);
router.post('/data', getfilteredData);
router.get('/', readReciept);
router.get('/:id', readRecieptById);
router.put('/:id', updateReciept); // Changed from /update to /:id
router.delete('/delete/:id', deleteReciept);

module.exports = router;