const axios = require("axios");
const Account = require("../Models/Account");
const { getNibssToken } = require("../Services/AuthService");


// exports.createAccount = async (req, res) => {
//     try {

//         //Get the information sent by the customer
//         const { kycType, kycId, dateOfBirth } = req.body;


//         //Validate the request body
//         if (!kycType || !kycId || !dateOfBirth) {
//             return res.status(400).json({
//                 message: "KYC type, KYC ID and date of birth are required"
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
//                 dateOfBirth
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


//         //Save the account information in MongoDB
//         const newAccount = new Account({
//             userId: req.user.id,
//             accountNumber: nibssAccount.accountNumber,
//             bankCode: nibssAccount.bankCode,
//             bankName: nibssAccount.bankName,
//             balance: nibssAccount.balance
//         });


//         await newAccount.save();


//         //Send the account information back to the customer
//         return res.status(201).json({
//             message: "Account created successfully",
//             account: newAccount
//         });


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

exports.createAccount = async (req, res) => {
    try {
        const { kycType, kycId, dateOfBirth } = req.body;

        res.status(200).json({
            message: "Account endpoint is working",
            body: {
                kycType,
                kycId,
                dateOfBirth
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
};