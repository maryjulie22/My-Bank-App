const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true
        },
        userID: {
            type: String,
        },
        amount: {
            type: Number,
            required: true
        },
        to: {
            type: String,
            required: true
        },
        from: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["SUCCESS", "FAILED", "PENDING"],
            default: "PENDING"
        },
        type: {
            type: String,
            enum: ["INTRA_BANK", "INTER_BANK"],
            default: "INTER_BANK"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);