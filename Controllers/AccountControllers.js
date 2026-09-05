const axios = require("axios");
const Account = require("../Models/Account");
const { getNibssToken } = require("../Services/AuthService");

exports.createAccount = async (req, res) => {
    try {

        // Get information sent by the customer
        const { kycType, kycID, dob } = req.body;

        // Validate request body
        if (!kycType || !kycID || !dob) {
            return res.status(400).json({
                message: "KYC type, KYC ID, and date of birth are required"
            });
        }

        // Get NIBSS bearer token
        const token = await getNibssToken();

        // Send customer's information to NIBSS
        const response = await axios.post(
            `${process.env.NIBSS_BASE_URL}/api/account/create`,
            {
                kycType,
                kycID,
                dob,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // Get response from NIBSS
        const nibssAccount = response.data.account;  
        console.log("NIBSS ACCOUNT RESPONSE:", nibssAccount);

        // Save account details to MongoDB
        const account = new Account({
            userId: req.UserID,
            accountNumber: nibssAccount.accountNumber,
            bankCode: nibssAccount.bankCode,
            balance: nibssAccount.balance,
            accountName: nibssAccount.accountName
        });

        await account.save();

        // Send response to customer
        return res.status(201).json({
            message: "Account created successfully",
            accountNumber: nibssAccount.accountNumber,
            bankCode: nibssAccount.bankCode,
            balance: nibssAccount.balance,
            accountName: nibssAccount.accountName
        });


    } catch (error) {
        console.error("ACCOUNT CREATION ERROR:", error.response?.data || error.message);

        return res.status(500).json({
            message: "Failed to create account"
        });
    }
};

//Name Enquiry Controller

exports.nameEnquiry = async (req, res) => {
    try {
        const { accountNumber } = req.params;

        // Get NIBSS access token
        const token = await getNibssToken();

        // Call NIBSS Name Enquiry API
        const response = await axios.get(
            `${process.env.NIBSS_BASE_URL}/api/account/name-enquiry/${accountNumber}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error("Name Enquiry Error:", error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Name enquiry failed",
            error: error.response?.data || error.message
        });
    }
};

//Account Balance Enquiry Controller

exports.accountBalanceEnquiry = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        // Get NIBSS access token
        const token = await getNibssToken();
        // Call NIBSS Account Balance Enquiry API
        const response = await axios.get(
            `${process.env.NIBSS_BASE_URL}/api/account/balance/${accountNumber}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            success: true,
            data: response.data
        });

    } catch (error) {
        console.error("Account Balance Enquiry Error:", error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Account balance enquiry failed",
            error: error.response?.data || error.message
        });
    }
};
