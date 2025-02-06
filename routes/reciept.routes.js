const express = require('express');
const router = express.Router();

const userReciept = require('../controller/Reciept.controller.js');

const { createReciept, readReciept, readRecieptById, updateReciept, deleteReciept, getBlogbyQuery, getfilteredData, dataByUser } = userReciept;

// User Routes
router.post('/databyuser', dataByUser);
router.post('/', createReciept);
router.post('/filtereduserdata', getBlogbyQuery);
router.post('/data', getfilteredData);
router.get('/', readReciept);
router.get('/:id', readRecieptById);
router.put('/:id', updateReciept); // Changed from /update to /:id
router.delete('/:id', deleteReciept);

module.exports = router;