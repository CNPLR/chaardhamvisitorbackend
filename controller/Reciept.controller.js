const Reciept = require('../model/reciept.model');
const Counter = require('../model/counter');

async function createReciept(req, res) {
    const { name, mobileNumber, place, persons, items, key, ammount, description, locker, userId, numberOfLocker, company } = req.body;
    try {

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
        const counterName = `receipt-${year}${month}`; // Example: "receipt-202501"

        // Find and increment the counter
        const counter = await Counter.findOneAndUpdate(
            { name: counterName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Format the receipt number as YYYYMM0000001
        let receiptNo = `${year}${month}${String(counter.seq).padStart(7, "0")}`;

        const reciept = new Reciept({ name, mobileNumber, place, persons, items, key, ammount, description, locker, numberOfLocker, company, receiptNo, createdBy: userId })

        await reciept.save()

        return res.status(201).json({ success: true, message: 'Save Reciept deatils successfully', data: reciept });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to Save Reciept deatils', error: error.message });
    }
}

async function readReciept(req, res) {
    try {
        const reciept = await Reciept.find();
        return res.status(201).json({ success: true, data: reciept });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
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