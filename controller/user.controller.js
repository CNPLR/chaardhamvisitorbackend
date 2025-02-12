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
        return res.status(201).json({ success: true, message: 'User created successfully', data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
    }
}

async function login(req, res) {
    const { email, password, company } = req.body

    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" });
        }

        if (password == user.password) {

            let update = await User.findByIdAndUpdate(user.id, { company })

            update.save();

            return res.status(201).json({ message: true, company: user.company, userId: user.id, token: generateToken(user._id) })
        }
        else {
            res.status(400)
            throw new Error('sorry you have no password')
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
    }
}

async function readUsers(req, res) {
    try {
        const users = await User.find();
        return res.json({ success: true, message: 'Users retrieved successfully', data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve users', error: error.message });
    }
}

async function readUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.json({ success: true, message: 'User retrieved successfully', data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to retrieve user', error: error.message });
    }
}

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
            return res.json({ success: true, message: 'User updated successfully', data: user });
        }
    } catch (error) {
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        await user.deleteOne({ _id: id });
        return res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
    }
}

module.exports = {
    createUser,
    readUsers,
    readUserById,
    updateUser,
    deleteUser,
    login,
};