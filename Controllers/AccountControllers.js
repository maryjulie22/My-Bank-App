// const axios = require("axios");
// const Account = require("../Models/Account");
// const { getNibssToken } = require("../Services/AuthService");


// exports.createAccount = async (req, res) => {
//     try {

//         //Get the information sent by the customer
//         const { kycType, kycId} = req.body;


//         //Validate the request body
//         if (!kycType || !kycId) {
//             return res.status(400).json({
//                 message: "KYC type and KYC ID are required"
//             });
//         }


//         //Get NIBSS bearer token
//         const token = await getNibssToken();


//         // Send the customer's information to NIBSS
//         const response = await axios.post(
//             `${process.env.NIBSS_BASE_URL}/api/account/create`,

//             {
//                 kycType,
//                 kycId,
//                 dob: req.user.dateOfBirth,
//             },

//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );


//         //Get the response from NIBSS
//         const nibssAccount = response.data;

//       return res.status(201).json({
//       message: "Account created successfully",
//       accountNumber: nibssAccount.accountNumber,
//       bankCode: nibssAccount.bankCode,
//       bankName: nibssAccount.bankName,
//       balance: nibssAccount.balance
//   });


// //save the account details to the database
// const account = new Account({
//     id: req.user.id,
//     accountNumber: nibssAccount.accountNumber,
//     bankCode: nibssAccount.bankCode,
//     bankName: nibssAccount.bankName,
//     balance: nibssAccount.balance
// });

// await account.save();


//     } catch (error) {

//         console.error(
//             "Account creation error:",
//             error.response?.data || error.message
//         );

//         return res.status(500).json({
//             message: "Failed to create account"
//         });
//     }
// };

const axios = require("axios");
const Account = require("../Models/Account");
const { getNibssToken } = require("../Services/AuthService");

exports.createAccount = async (req, res) => {
    try {

        // Get information sent by the customer
        const { kycType, kycId } = req.body;

        // Validate request body
        if (!kycType || !kycId) {
            return res.status(400).json({
                message: "KYC type and KYC ID are required"
            });
        }

        // Get NIBSS bearer token
        const token = await getNibssToken();

        // Send customer's information to NIBSS
        const response = await axios.post(
            `${process.env.NIBSS_BASE_URL}/api/account/create`,
            {
                kycType,
                kycId,
                dob: req.DateOfBirth
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // Get response from NIBSS
        const nibssAccount = response.data;

        // Save account details to MongoDB
        const account = new Account({
            userId: req.UserID,
            accountNumber: nibssAccount.accountNumber,
            bankCode: nibssAccount.bankCode,
            bankName: nibssAccount.bankName,
            balance: nibssAccount.balance
        });

        await account.save();

        // Send response to customer
        return res.status(201).json({
            message: "Account created successfully",
            accountNumber: nibssAccount.accountNumber,
            bankCode: nibssAccount.bankCode,
            bankName: nibssAccount.bankName,
            balance: nibssAccount.balance
        });

    } catch (error) {

        console.error(
            "Account creation error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Failed to create account"
        });
    }
};