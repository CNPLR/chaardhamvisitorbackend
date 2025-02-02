const User = require('../model/user.model');
const generateToken = require('../utils/generateToken');

async function createUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ success: true, message: 'User created successfully', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
    }
}

module.exports = createUser

async function login(req, res) {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (password == user.password) {
            res.status(201).json({ _id: user.id, name: user.name, email: user.email, token: generateToken(user._id) })
        }
        else {
            res.status(400)
            throw new Error('sorry you have no password')
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
    }
}

module.exports = login

async function readUsers(req, res) {
    try {
        const users = await User.find();
        res.json({ success: true, message: 'Users retrieved successfully', data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
    }
}

module.exports = readUsers

async function readUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User retrieved successfully', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve user', error: error.message });
    }
}

module.exports = readUserById

async function updateUser(req, res) {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        else {
            let update = await User.findOneAndUpdate({ email }, { password: password });
            await update.save();
            res.json({ success: true, message: 'User updated successfully', data: user });
        }
    } catch (error) {
    }
}

module.exports = updateUser

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        await user.deleteOne({ _id: id });
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
    }
}

module.exports = deleteUser

// export const createUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const userExists = await User.findOne({ email: email });
//         if (userExists) {
//             return res.status(400).json({ success: false, message: 'User already exists' });
//         }
//         const user = new User({ name, email, password });
//         await user.save();
//         res.status(201).json({ success: true, message: 'User created successfully', data: user });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
//     }
// };

// export const login = async (req, res) => {
//     const { email, password } = req.body
//     try {
//         const user = await User.findOne({ email: email })
//         if (password == user.password) {
//             res.status(201).json({ _id: user.id, name: user.name, email: user.email, token: generateToken(user._id) })
//         }
//         else {
//             res.status(400)
//             throw new Error('sorry you have no password')
//         }
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
//     }
// }

// Read all users
// export const readUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json({ success: true, message: 'Users retrieved successfully', data: users });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
//     }
// };

// Read a single user by ID
// export const readUserById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
//         res.json({ success: true, message: 'User retrieved successfully', data: user });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to retrieve user', error: error.message });
//     }
// };

// Update a user by email
// export const updateUser = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         let user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
//         else {
//             let update = await User.findOneAndUpdate({ email }, { password: password });
//             await update.save();
//             res.json({ success: true, message: 'User updated successfully', data: user });
//         }
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
//     }
// };

// Delete a user by ID
// export const deleteUser = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
//         await user.deleteOne({ _id: id });
//         res.json({ success: true, message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
//     }
// };