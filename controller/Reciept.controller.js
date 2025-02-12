const Reciept = require('../model/reciept.model');
const Counter = require('../model/counter');
const express = require("express");
const areKeysAvailable = require('../utils/areKeysAvailable');
const addBookedKeys = require('../utils/addBookedKeys');
const removeBookedKeys = require('../utils/removeBookedKeys');
const app = express();
app.use(express.json());

async function createReciept(req, res) {
    try {
        const {
            name, mobileNumber, place, persons, items, key, ammount, description,
            locker, userId, company, gate
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
            locker, company, gate, receiptNo, createdBy: userId
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
        const reciept = await Reciept.find().populate("createdBy", "-password").sort({ _id: -1 }).limit(100);
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

        // Find the receipt by ID
        const reciept = await Reciept.findOne({ _id: receiptId, status: "active" });
        if (!reciept) {
            return res.status(404).json({ success: false, message: "Receipt not found" });
        }

        // Destructure the request body
        const { name, mobileNumber, place, persons, items, description, extraAmount, totalAmount, status } = req.body;

        // Update the receipt fields if provided
        if (name !== undefined) reciept.name = name;
        if (mobileNumber !== undefined) reciept.mobileNumber = mobileNumber;
        if (place !== undefined) reciept.place = place;
        if (persons !== undefined) reciept.persons = persons;
        if (items !== undefined) reciept.items = items;
        if (description !== undefined) reciept.description = description;
        if (extraAmount !== undefined) reciept.extraAmount = extraAmount;
        if (totalAmount !== undefined) reciept.totalAmount = totalAmount;
        if (status !== undefined) reciept.status = status;

        // Save the updated receipt
        await reciept.save();

        //Free the booked locker
        if (status === "inactive") {
            await removeBookedKeys(reciept?.key || []);
            console.log("Locker key free")
        }

        return res.json({ success: true, message: "Receipt updated successfully", data: reciept });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update receipt", error: error.message });
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

async function getReceiptByGate(req, res) {
    try {
        const { gateNo } = req.body;
        const queryObject = {};
        if (gateNo) {
            queryObject.$or = [
                {
                    gate: { $regex: new RegExp(gateNo, 'i') } // 'i' for case-insensitive
                }
            ];
        }
        const receipt = await Reciept.find(queryObject).populate("createdBy", "-password").limit(100);

        res.status(200).json(receipt); // Ensure you send a response to the client
    } catch (error) {
        res.status(500).json({ error: 'Server error' }); // Handle errors gracefully
    }
}

async function dataByUser(req, res) {
    try {
        const { user } = req.body
        const find = await Reciept.find().populate("createdBy", "-password").limit(100);
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
        const filteredData = await Reciept.find({ createdAt: { $gte: start.toISOString(), $lte: end.toISOString(), }, }).populate("createdBy", "-password").limit(100);

        return res.status(200).json({ success: true, data: filteredData });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteReciept(req, res) {
    try {
        const receipt = await Reciept.findById(req.params.id)
        if (!receipt) {
            return res.status(200).json({ success: false, message: "Does not exist" })
        }

        await receipt.deleteOne()

        return res.status(200).json({ success: true, message: "Delete successfull" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

async function downloadReport(req, res) {
    try {
        const reciept = await Reciept.find().populate("createdBy", "-password").sort({ _id: -1 });
        return res.status(201).json({ success: true, data: reciept });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function getDataWithLimit(req, res) {
}

module.exports = { createReciept, readReciept, readRecieptById, updateReciept, deleteReciept, getReceiptByQuery, getfilteredData, dataByUser, getReceiptByGate, getDataWithLimit, downloadReport };