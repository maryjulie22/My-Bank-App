const axios = require("axios");
const Transaction = require("../Models/transaction");
const { getNibssToken } = require("../Services/AuthService");
const Account = require("../Models/Account");



exports.interBankTransfer= async (req, res) => {
    try {
        const { from, to, amount } = req.body;

        // Validate request body
        if (!from || !to || !amount) {
            return res.status(400).json({
                message: "From account, to account, and amount are required"
            });
        }

        // Get NIBSS bearer token
        const token = await getNibssToken();

        // Send transaction details to NIBSS
        const response = await axios.post(
            `${process.env.NIBSS_BASE_URL}/api/transfer`,
            {
                from,
                to,
                amount
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        // Save transaction details to MongoDB
        const transaction = new Transaction({
            transactionId: response.data.reference,
            userID: req.UserID,
            amount: amount,
            to,
            from
        });

        await transaction.save();

        console.log("NIBSS RESPONSE:", response.data);

        // Send response to customer
        return res.status(201).json({
            message: "Transfer initiated successfully",
            transactionId: response.data.reference,
            status: response.data.status
        });

    } catch (error) {
        console.error("Transfer initiation error:", error.response?.data || error.message);
        return res.status(500).json({
            message: "Failed to initiate transfer"
        });
    }

};

//intraBankTransfer
exports.intraBankTransfer = async (req, res) => {
    try {
        const { from, to, amount } = req.body;

        // Validate request body
        if (!from || !to || amount === undefined) {
            return res.status(400).json({
                success: false,
                message: "from, to and amount are required"
            });
        }

        // Validate amount
        if (Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than zero"
            });
        }

        // Sender and recipient cannot be the same
        if (from === to) {
            return res.status(400).json({
                success: false,
                message: "Sender and recipient accounts cannot be the same"
            });
        }

        const transferAmount = Number(amount);

        // Find sender
        const sender = await Account.findOne({
            accountNumber: from
        });

        if (!sender) {
            return res.status(404).json({
                success: false,
                message: "Sender account not found"
            });
        }

        // Find recipient
        const recipient = await Account.findOne({
            accountNumber: to
        });

        if (!recipient) {
            return res.status(404).json({
                success: false,
                message: "Recipient account not found"
            });
        }

        // Check balance
        if (sender.balance < transferAmount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance"
            });
        }

        // Generate transaction ID
        const transactionId = `TX${Date.now()}`;

        // Perform transfer
        sender.balance -= transferAmount;
        recipient.balance += transferAmount;

        await sender.save();
        await recipient.save();

        // Save transaction
        await Transaction.create({
            transactionId,
            from: sender.accountNumber,
            to: recipient.accountNumber,
            amount: transferAmount,
            status: "SUCCESS",
            type: "INTRA_BANK"
        });

        return res.status(200).json({
            success: true,
            message: "Intra-bank transfer successful",
            transactionId,
            status: "SUCCESS"
        });

    } catch (error) {
        console.error(
            "Intra-bank transfer error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Transfer failed",
            error: error.message
        });
    }
};

//transaction status query
// exports.getTransactionStatus = async (req, res) => {
//     try {
//         const { transactionId } = req.params;

//         // Get NIBSS access token
//         const token = await getNibssToken();

//         // Find the transaction in your database
//         const transaction = await Transaction.findOne({
//             transactionId: transactionId
//         });

//         if (!transaction) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Transaction not found"
//             });
//         }

//         // Query NIBSS for the latest transaction status
//         const response = await axios.get(
//             `${process.env.NIBSS_BASE_URL}/api/transaction/${transactionId}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         //nibss response
//         console.log("NIBSS Transaction Status Response:", response.data);

//         // Update your local transaction status
//         transaction.status = response.data.status;
//         await transaction.save();

//         return res.status(200).json({
//             success: true,
//             transactionId: transaction.transactionId,
//             status: response.data.status
//         });

//     } catch (error) {
//         console.error(
//             "Transaction Status Error:",
//             error.response?.data || error.message
//         );

//         return res.status(error.response?.status || 500).json({
//             success: false,
//             message: "Unable to query transaction status",
//             error: error.response?.data || error.message
//         });
//     }
// };

exports.getTransactionStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;

        // Get NIBSS access token
        const token = await getNibssToken();

        // Call NIBSS Transaction Status Query
        const response = await axios.get(
            `${process.env.NIBSS_BASE_URL}/api/transaction/${transactionId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("NIBSS Transaction Status Response:", response.data);

        // Find transaction in your database
        let transaction = await Transaction.findOne({
            transactionId: transactionId
        });

        // If it doesn't exist locally, create it from the NIBSS response
        if (!transaction) {
            transaction = new Transaction({
                transactionId: response.data.reference,
                from: response.data.senderAccount,
                to: response.data.receiverAccount,
                amount: response.data.amount,
                status: response.data.status,
                type: "INTER_BANK"
            });
        } else {
            // Update the existing transaction
            transaction.from = response.data.senderAccount;
            transaction.to = response.data.receiverAccount;
            transaction.amount = response.data.amount;
            transaction.status = response.data.status;
        }

        await transaction.save();

        return res.status(200).json({
            success: true,
            transactionId: response.data.reference,
            status: response.data.status
        });

    } catch (error) {
        console.error(
            "Transaction Status Error:",
            error.response?.data || error.message
        );

        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Unable to query transaction status",
            error: error.response?.data || error.message
        });
    }
};