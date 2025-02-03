const Reciept = require('../model/reciept.model');

async function createReciept(req, res) {
    const { name, mobileNumber, place, persons, items, key, ammount, description, locker, userId, numberOfLocker, company } = req.body;
    try {
        const reciept = new Reciept({ name, mobileNumber, place, persons, items, key, ammount, description, locker, numberOfLocker, company, createdBy: userId })
        await reciept.save()
        return res.status(201).json({ success: true, message: 'Save Reciept deatils successfully', data: reciept });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to Save Reciept deatils', error: error.message });
    }
}

async function readReciept(req, res) {
    try {

    } catch (error) {

    }
}

async function readRecieptById(req, res) {
    const { id } = req.params
    try {
        const reciept = await Reciept.findById(id);
        return res.status(201).json({ success: true, data: reciept });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function updateReciept(req, res) {
    try {

    } catch (error) {

    }
}

async function deleteReciept(req, res) {
    try {

    } catch (error) {

    }
}

module.exports = { createReciept, readReciept, readRecieptById, updateReciept, deleteReciept, };