const axios = require("axios");
const { getNibssToken } = require("../Services/AuthService");


//admin to insert bvn into the NIBSS identity store
exports.insertBvn = async (req, res) => {
    try {
        const { bvn, firstName, lastName, dob, phone } = req.body;

        // Validate request
        if (!bvn || !firstName || !lastName || !dob || !phone) {
            return res.status(400).json({
                message: "All BVN fields are required"
            });
        }

        // Get NIBSS token
        const token = await getNibssToken();

        // Register BVN in NIBSS identity store
        const response = await axios.post(
            `${process.env.NIBSS_BASE_URL}/api/insertBvn`,
            {
                bvn,
                firstName,
                lastName,
                dob,
                phone
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(201).json(response.data);

    } catch (error) {
        console.error(
            "BVN registration error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Failed to register BVN",
            error: error.response?.data || error.message
        });
    }
};

//admin to insert nin into the NIBSS identity store
exports.insertNin = async (req, res) => {
    try {
        const { nin, firstName, lastName, dob } = req.body;

        // Validate request
        if (!nin || !firstName || !lastName || !dob) {
            return res.status(400).json({
                message: "All NIN fields are required"
            });
        }

        // Get NIBSS token
        const token = await getNibssToken();

        // Register BVN in NIBSS identity store
        const response = await axios.post(
            `${process.env.NIBSS_BASE_URL}/api/insertBvn`,
            {
                bvn,
                firstName,
                lastName,
                dob,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(201).json(response.data);

    } catch (error) {
        console.error(
            "NIN registration error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Failed to register NIN",
            error: error.response?.data || error.message
        });
    }
};

//get all accounts of the bank registered with NIBSS
exports.getAllAccounts = async (req, res) => {
    try {
        // Get NIBSS token
        const token = await getNibssToken();
        // Call NIBSS API to get all accounts
        const response = await axios.get(
            `${process.env.NIBSS_BASE_URL}/api/accounts`,
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
        console.error("Get All Accounts Error:", error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve accounts",
            error: error.response?.data || error.message
        });
    }
};
