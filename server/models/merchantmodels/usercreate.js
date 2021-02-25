const mongoose = require('mongoose');
const validator = require('validator');

const createUser = new mongoose.Schema({
    merchantid:{
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    // userID: {
    //     type: String,
    //     required: true,
    //     unique: false,
    //     trim: true
    // },
    merchantName: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    userEvent: {
        type: String,
        required: true,
        unique: false
    },
    userphone: {
        type: Number,
        contact: true,
        required: true,
        trim: true
    },
    userEmail:{
        type: String,
        required: true,
        unique: false,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    }
},{
    timestamps: true
})

createUser.pre('save', async function (next) {

    next()
})

const UserCreate = mongoose.model('User_Merchant', createUser)

module.exports = UserCreate