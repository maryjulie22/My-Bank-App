const express = require('express');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();

const connectDB = require('./Configurations/DatabaseConfig');

app.use(express.json()); // Middleware to parse JSON request bodies

const userRoute= require('./Router/UserRoute');
const accountRoute= require('./Router/AccountRoute');
connectDB(); // Connect to the database

app.use('/users',userRoute); //use the user user route for user-related endpoints
app.use('/accounts', accountRoute); //use the account route for account-related endpoints

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})