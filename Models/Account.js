const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        accountNumber: {
            type: String,
            required: true,
            unique: true
        },

        bankCode: {
            type: String,
            required: true
        },

        bankName: {
            type: String,
            required: true
        },

        balance: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Account", accountSchema);