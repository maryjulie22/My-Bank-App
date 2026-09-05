const axios = require("axios");

let accessToken = null;
let tokenExpiry = null;

const getNibssToken = async () => {
    try {
        // If we already have a token and it has not expired,
        // return the existing token.
        if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
            return accessToken;
        }

        // Otherwise, request a new token from NIBSS
        const response = await axios.post(
            `${process.env.NIBSS_BASE_URL}/api/auth/token`,
            {
                apiKey: process.env.API_KEY,
                apiSecret: process.env.API_SECRET
            },
            {
        headers: {
            "Content-Type": "application/json"
        }
          }
        );

        // Save the new token
        accessToken = response.data.token;

        // Token expires in 1 hour.
        // We subtract 1 minute so we don't accidentally use
        // a token that is about to expire.
        tokenExpiry = Date.now() + (59 * 60 * 1000);

        return accessToken;

    } catch (error) {
        console.error(
            "NIBSS authentication failed:",
            error.response?.data || error.message
        );

        throw new Error("Unable to authenticate with NIBSS");
    }
};

module.exports = {
    getNibssToken
};