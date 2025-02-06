const Reciept = require('../model/reciept.model');
const Counter = require('../model/counter');
const User = require('./user.controller');

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
        const reciept = await Reciept.find().populate("createdBy", "-password");
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
    const { name, mobileNumber, place, persons, items, key, ammount, description, locker, numberOfLocker, extraAmount, totalAmount } = req.body;

    const reciept = await Reciept.findByIdAndUpdate(req.params.id, req.body,)

    try {
        if (!reciept) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        let updatedAt = new Date()

        reciept.name || name,
            reciept.mobileNumber || mobileNumber,
            reciept.place || place,
            reciept.persons || persons,
            reciept.items || items,
            reciept.key || key,
            reciept.ammount || ammount,
            reciept.description || description,
            reciept.locker || locker,
            reciept.numberOfLocker || numberOfLocker,
            reciept.extraAmount || extraAmount,
            reciept.totalAmount || totalAmount,
            reciept.updatedAt || updatedAt

        await reciept.save();

        return res.json({ success: true, message: 'updated successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update', error: error.message });
    }
}

async function getBlogbyQuery(req, res) {
    try {
        const { search } = req.body;
        const queryObject = {};
        if (search) {
            queryObject.$or = [
                {
                    receiptNo: { $regex: new RegExp(search, 'i') } // 'i' for case-insensitive
                }
            ];
        }
        const receipt = await Reciept.find(queryObject).populate("createdBy", "-password");

        res.status(200).json(receipt); // Ensure you send a response to the client
    } catch (error) {
        res.status(500).json({ error: 'Server error' }); // Handle errors gracefully
    }
}

async function getfilteredData(req, res) {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: 'Invalid startDate or endDate format' });
        }

        // Fetch filtered data from User_account
        const filteredData = await Reciept.find({ createdAt: { $gte: start.toISOString(), $lte: end.toISOString(), }, }).populate("createdBy", "-password");

        return res.status(200).json({ success: true, data: filteredData });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteReciept(req, res) {
    try {

    } catch (error) {

    }
}

module.exports = { createReciept, readReciept, readRecieptById, updateReciept, deleteReciept, getBlogbyQuery, getfilteredData };