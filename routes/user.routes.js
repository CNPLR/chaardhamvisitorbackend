const express = require('express');
const router = express.Router();

const userController = require('../controller/user.controller.js');

const { createUser, readUsers, readUserById, updateUser, deleteUser, login } = userController;

// User Routes
router.post('/', createUser);
router.get('/', readUsers);
router.post('/login', login);
router.get('/:id', readUserById);
router.put('/:id', updateUser); // Changed from /update to /:id
router.delete('/:id', deleteUser);

module.exports = router;