// routes/userRoutes.js
const express = require('express');
// import { createUser, readUsers, readUserById, updateUser, deleteUser, login } from '../../controllers/user-authantication/user.controllers.js';
// import protect from '../../middleware/protect.js';

const { createUser, readUsers, readUserById, updateUser, deleteUser, login } = require('../controller/user.controller.js')

const router = express.Router();

router.post('/', createUser);
router.get('/', readUsers);
router.post('/login', login);
router.get('/:id', readUserById);
router.put('/update', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

// export default router;