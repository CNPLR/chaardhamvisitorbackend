const express = require('express');
const router = express.Router();

const userReciept = require('../controller/Reciept.controller.js');

const {
    createReciept,
    readReciept,
    readRecieptById,
    updateReciept,
    deleteReciept,
    getReceiptByQuery,
    getfilteredData,
    dataByUser,
    getReceiptByGate,
    getDataWithLimit,
    downloadReport
} = userReciept;

// POST Routes (Create & Query Data)
router.post('/', createReciept); // Create receipt
router.post('/databyuser', dataByUser); // Get data by user
router.post('/databygate', getReceiptByGate); // Get data by gate
router.post('/filtereduserdata', getReceiptByQuery); // Filtered user data
router.post('/data', getfilteredData); // General filtered data

// GET Routes (Read Data)
router.get('/', readReciept); // Get all receipts
router.get('/limit', getDataWithLimit); // Get receipts with limit
router.get('/report', downloadReport); // Download report
router.get('/:id', readRecieptById); // Get receipt by ID

// PUT Route (Update Data)
router.put('/:id', updateReciept); // Update receipt by ID

// DELETE Route (Delete Data)
router.delete('/:id', deleteReciept); // Delete receipt by ID

module.exports = router;