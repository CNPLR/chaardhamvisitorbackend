const Reciept = require('../model/reciept.model');
const Counter = require('../model/counter');

const LockerCounter = require("../model/lockerCount.model");
const KeyTracker = require("../model/keyNumber.model");

const express = require("express");
const app = express();
app.use(express.json());

// async function createReciept(req, res) {
//     try {
//         const { name, mobileNumber, place, persons, items, key, ammount, description, locker, userId, numberOfLocker, company } = req.body;

//         const bookedLocker = await KeyTracker.find();

//         const pushKeys = key?.split(',');

//         if (bookedLocker.length === 0) {
//             let saveKeys = new KeyTracker({ keyNumber: pushKeys })
//             let getLockerCount = await LockerCounter()
//             const lockerCount = getLockerCount.numberOfLockers - numberOfLocker
//             // await saveKeys.save();
//             // res.status(201).json({ success: true, message: "Locker Book Succesfully", data: lockerCount })

//             const now = new Date();
//             const year = now.getFullYear();
//             const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
//             const counterName = `receipt-${year}${month}`; // Example: "receipt-202501"

//             // Find and increment the counter
//             const counter = await Counter.findOneAndUpdate(
//                 { name: counterName },
//                 { $inc: { seq: 1 } },
//                 { new: true, upsert: true }
//             );

//             // Format the receipt number as YYYYMM0000001
//             let receiptNo = `${year}${month}${String(counter.seq).padStart(7, "0")}`;

//             const reciept = new Reciept({ name, mobileNumber, place, persons, items, key, ammount, description, locker, numberOfLocker, company, receiptNo, createdBy: userId })

//             await reciept.save()

//             await saveKeys.save()

//             return res.status(201).json({ success: true, message: 'Save Reciept deatils successfully', data: reciept, lockerCount });
//         }
//         else {
//             const getKeys = bookedLocker?.map((ele) => ele.keyNumber);
//             const getAllKeys = getKeys.flat(); // Flatten the nested arrays if any
//             const matchedKeys = pushKeys.filter(key => getAllKeys.includes(key));

//             if (matchedKeys.length > 0) {
//                 return res.status(201).json({ success: false, message: "This locker is already booked", data: matchedKeys.join(', ') })
//             }
//             else {
//                 let saveKeys = new KeyTracker({ keyNumber: pushKeys })

//                 let getLockerCount = await LockerCounter()
//                 const lockerCount = getLockerCount.numberOfLockers - numberOfLocker

//                 const now = new Date();
//                 const year = now.getFullYear();
//                 const month = String(now.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
//                 const counterName = `receipt-${year}${month}`; // Example: "receipt-202501"

//                 // Find and increment the counter
//                 const counter = await Counter.findOneAndUpdate(
//                     { name: counterName },
//                     { $inc: { seq: 1 } },
//                     { new: true, upsert: true }
//                 );

//                 // Format the receipt number as YYYYMM0000001
//                 let receiptNo = `${year}${month}${String(counter.seq).padStart(7, "0")}`;

//                 const reciept = new Reciept({ name, mobileNumber, place, persons, items, key, ammount, description, locker, numberOfLocker, company, receiptNo, createdBy: userId })

//                 await reciept.save()

//                 await saveKeys.save()

//                 return res.status(201).json({ success: true, message: 'Save Reciept deatils successfully', data: reciept, lockerCount });
//             }
//         }
//     } catch (error) {
//         return res.status(500).json({ success: false, message: 'Failed to Save Reciept deatils', error: error.message });
//     }
// }

// Return locker keys
// app.post("/return", (req, res) => {
//     const { userId, lockerNumbers } = req.body;

//     if (!Array.isArray(lockerNumbers) || lockerNumbers.length === 0) {
//         return res.status(400).json({ message: "Invalid locker numbers" });
//     }

//     // Check if lockers belong to the user
//     for (let num of lockerNumbers) {
//         if (bookedLockers[num] !== userId) {
//             return res.status(400).json({ message: `Locker ${num} is not booked by this user` });
//         }
//     }

//     // Return lockers
//     lockerNumbers.forEach(num => delete bookedLockers[num]);
//     totalLockers += lockerNumbers.length;

//     res.json({ message: "Lockers returned successfully", availableLockers: totalLockers });
// });

async function availableLocker(req, res) {
    const getLockerCount = await LockerCounter();
    return res.json({ totalLockers: getLockerCount });
}

async function createReciept(req, res) {
    try {
        const {
            name, mobileNumber, place, persons, items, key, ammount, description,
            locker, userId, numberOfLocker, company
        } = req.body;

        const pushKeys = key?.split(',');
        const bookedLocker = await KeyTracker.find();
        const getKeys = bookedLocker?.flatMap(ele => ele.keyNumber); // Directly flatten
        const matchedKeys = pushKeys.filter(k => getKeys.includes(k));

        if (matchedKeys.length > 0) {
            return res.status(200).json({
                success: false,
                message: "This locker is already booked",
                data: matchedKeys.join(', ')
            });
        }

        // Proceed with booking
        const saveKeys = new KeyTracker({ keyNumber: pushKeys });

        const getLockerCount = await LockerCounter();
        const lockerCount = getLockerCount.numberOfLockers - numberOfLocker;

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
            locker, numberOfLocker, company, receiptNo, createdBy: userId
        });

        await Promise.all([reciept.save(), saveKeys.save()]);

        return res.status(201).json({
            success: true,
            message: 'Receipt details saved successfully',
            data: reciept,
            lockerCount
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
        if (!reciept) { return res.status(404).json({ success: false, message: 'Not found' }); }

        let updatedAt = new Date();

        const pushKeys = key?.split(',');

        // Proceed with booking
        await KeyTracker.findOneAndDelete({ keyNumber: pushKeys });

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

module.exports = { createReciept, readReciept, readRecieptById, updateReciept, deleteReciept, getBlogbyQuery, getfilteredData, dataByUser, availableLocker };