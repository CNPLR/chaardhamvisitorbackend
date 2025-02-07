const Reciept = require('../model/reciept.model');
const Counter = require('../model/counter');
const express = require("express");
const areKeysAvailable = require('../utils/areKeysAvailable');
const addBookedKeys = require('../utils/addBookedKeys');
const app = express();
app.use(express.json());


async function createReciept(req, res) {
    try {
        const {
            name, mobileNumber, place, persons, items, key, ammount, description,
            locker, userId, company
        } = req.body;


        //Booked locker only if the locker is true.
        if (locker && key) {
            // const keysToBook = key?.split(',').map(n => Number(n));  //Chnage it array and convert in number.
            const keysToBook = key //Chnage it array and convert in number.

            const isLockerAvailable = await areKeysAvailable(keysToBook);

            //If the locaker is available then booked it
            if (isLockerAvailable) {
                await addBookedKeys(keysToBook);
            }
            else {
                //Locker keys are not available
                return res.status(200).json({ success: false, msg: "Selected locker keys are not available." })
            }
        }

        // Generate receipt number
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const counterName = `receipt-${year}${month}`;

        const counter = await Counter.findOneAndUpdate(
            { name: counterName },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const receiptNo = `${year}${month}${String(counter.seq).padStart(7, "0")}`;

        // Save receipt
        const reciept = new Reciept({
            name, mobileNumber, place, persons, items, key, ammount, description,
            locker, company, receiptNo, createdBy: userId
        });

        await reciept.save()

        return res.status(201).json({
            success: true,
            message: 'Receipt details saved successfully',
            data: reciept,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to save receipt details',
            error: error.message
        });
    }
}

async function readReciept(req, res) {
    try {
        const reciept = await Reciept.find().populate("createdBy", "-password").sort({ _id: -1 })
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

        const receiptId = req.params.id;
        const reciept = await Reciept.findById(receiptId)
        if (!reciept) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        const { name, mobileNumber, place, persons, items, ammount, description, extraAmount, totalAmount } = req.body;

        reciept.name || name;
        reciept.mobileNumber || mobileNumber;
        reciept.place || place;
        reciept.persons || persons;
        reciept.items || items;
        reciept.ammount || ammount;
        reciept.description || description;
        reciept.extraAmount || extraAmount;
        reciept.totalAmount || totalAmount;

        await reciept.save();

        return res.json({ success: true, message: 'updated successfully' });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update', error: error.message });
    }
}

async function getReceiptByQuery(req, res) {
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

async function dataByUser(req, res) {
    try {
        const { user } = req.body
        const find = await Reciept.find().populate("createdBy", "-password");
        const filter = find.filter((ele) => ele.createdBy.name == user)
        return res.status(200).json(filter);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
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

module.exports = { createReciept, readReciept, readRecieptById, updateReciept, deleteReciept, getReceiptByQuery, getfilteredData, dataByUser };