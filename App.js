const express = require('express');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();

const connectDB = require('./Configurations/DatabaseConfig');

app.use(express.json()); // Middleware to parse JSON request bodies

const userRoute= require('./Router/UserRoute');
const accountRoute= require('./Router/AccountRoute');
const adminRoute= require('./Router/AdminRoute');
const transactionRoute= require('./Router/TransactionRoute');
const fintechRoute= require('./Router/FintechRoute');
connectDB(); // Connect to the database

app.use('/users',userRoute); //use the user user route for user-related endpoints
app.use('/accounts', accountRoute); //use the account route for account-related endpoints
app.use('/admin', adminRoute); //use the admin route for admin-related endpoints
app.use('/bvn', fintechRoute); //use the fintech route for fintech-related endpoints
app.use('/nin', fintechRoute); //use the fintech route for fintech-related endpoints
app.use('/transfers', transactionRoute); //use the transaction route for transaction-related endpoints
app.use("/enquiry", accountRoute); //use the account route for name enquiry endpoint
app.use("/all-accounts", adminRoute); //use the admin route for get all accounts endpoint
app.use("/balance", accountRoute); //use the account route for balance enquiry endpoint
app.use("/intraBankTransfer", transactionRoute); //use the transaction route for intra bank transfer endpoint
app.use("/TransactionStatus", transactionRoute); //use the transaction route for transaction status endpoint


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})