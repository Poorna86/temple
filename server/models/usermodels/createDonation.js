const mongoose = require('mongoose');
const validator = require('validator');

const createDonation = new mongoose.Schema({
    merchantid:{
        type: String,
        required: true,
        unique: false,
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
    },
    donorName: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    donAmount: {
        type: Number,
        required: true,
        unique: false,
        trim: true
    },
    donPhone: {
        type: Number,
        required: true,
        unique: false,
        trim: true
    },
    assignEvent: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    donationDate:{
        type: Date,
        required: true,
        trim: true
    }
},{
    timestamps: true
})

createDonation.pre('save', async function (next) {     
    const donation = this
    next()
})

const DonationCreate = mongoose.model('Donation_Create', createDonation)

module.exports = DonationCreate