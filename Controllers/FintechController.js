const axios = require("axios");
const { getNibssToken } = require("../Services/AuthService");

//validate bvn with NIBSS
exports.validateBvn = async (req, res) => {
    try {
        const { bvn } = req.body;

        // Validate request body
        if (!bvn) {
            return res.status(400).json({
                message: "BVN is required"
            });
        }

        // Get NIBSS bearer token
        const token = await getNibssToken();

        // Send BVN to NIBSS for validation
        const response = await axios.post(
            `${process.env.NIBSS_BASE_URL}/api/validateBvn`,
            { bvn },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("NIBSS BVN Validation Response:", response.data);

        return res.status(200).json({
            success: true,
            message: "BVN validated successfully",
            data: response.data
        });

    } catch (error) {
        console.error("BVN Validation Error:", error.response?.data || error.message);

        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Unable to validate BVN",
            error: error.response?.data || error.message
        });
    }
};


//validate nin with NIBSS
exports.validateNin = async (req, res) => {
    try {
        const { nin } = req.body;

        // Validate request body
        if (!nin) {
            return res.status(400).json({
                message: "NIN is required"
            });
        }
        // Get NIBSS bearer token
    const token = await getNibssToken();

        // Send NIN to NIBSS for validation
        const response = await axios.post(
            `${process.env.NIBSS_BASE_URL}/api/validateNin`,
            { nin },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("NIBSS NIN Validation Response:", response.data);

        return res.status(200).json({
            success: true,
            message: "NIN validated successfully",
            data: response.data
        });

    } catch (error) {
        console.error("NIN Validation Error:", error.response?.data || error.message);

        return res.status(error.response?.status || 500).json({
            success: false,
            message: "Unable to validate NIN",
            error: error.response?.data || error.message
        });
    }
};
