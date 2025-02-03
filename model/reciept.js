const mongoose = require("mongoose");
const Counter = require("./counter");

// const receiptSchema = new mongoose.Schema({
//     receiptNo: { type: String, unique: true }, // YYYYMM0000001 format
//     name: String,
//     amount: Number,
//     date: { type: Date, default: Date.now }
// });

// Generate a formatted receipt number before saving
receiptSchema.pre("save", async function (next) {
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
        this.receiptNo = `${year}${month}${String(counter.seq).padStart(7, "0")}`;

        next();
    } catch (error) {
        next(error);
    }
});

const ReceiptsCount = mongoose.model("Receipt", receiptSchema);

module.exports = ReceiptsCount;