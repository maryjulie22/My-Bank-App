const jwt = require("jsonwebtoken");
const User = require("../Models/Users");

const authenticateUser = async (req, res, next) => {
    try {
        // Get the token from the request
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // Verify the JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find the user using the ID inside the JWT
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Make user information available to the controller
        req.UserID = user._id;
        req.DateOfBirth = user.dateOfBirth;

        next();

    } catch (error) {
        console.error("Authentication error:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateUser;