const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    
    firstname: {
        type: String,
        required: true,
    
    },
    lastname: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    

},
{timestamps: true}

);

//create model
const User = mongoose.model('User', userSchema);
module.exports = User;