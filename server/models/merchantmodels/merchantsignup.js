const passwordValidator = require('password-validator');
const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const merchantSchema = new mongoose.Schema({
    merchantid:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: [7, "password is shorter than the minimum allowed length (7)"],
        trim: true,
        validate: {
            validator: function(value) {    
                return !value.toLowerCase().includes('password')
            }, message: 'password should not contain key word "password"'
        }
    },
    repassword: {
        type: String,
        required: true,
        minlength: [7, 're-password is shorter than the minimum allowed length (7)'],
        trim: true,
        validate: {
            validator: function(value) {    
                return !value.toLowerCase().includes('password')
            }, message: 'password should not contain key word "password"'
        }
    },
    merchantName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        contact: true,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }]  
},{
    timestamps: true
})

const pswdSchema = new passwordValidator();

pswdSchema
.is().min(8)                                    // Minimum length 8
.is().max(16)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']) // Blacklist these values

// //hash the plain text password before saving the password
merchantSchema.pre('save', async function (next) {     
    const signup = this
    if(signup.isModified('password')) {
        const pswd=pswdSchema.validate(signup.password)
        if (!pswd){
            throw new Error(': password: password should have 1 uppercase 1 lowercase 2 numeric digit and no spaces.')
        } else if(signup.password !== signup.repassword) {
            throw new Error(': repassword: password and reentered password are not same')
            } else {
                signup.password = await bcrypt.hash(signup.password, 8)
                signup.repassword = await bcrypt.hash(signup.repassword, 8)
            }  
        }
    next()
})

merchantSchema.statics.findByCredentials = async (merchantid, password) => {
    const merchant = await MerchantSignup.findOne({ merchantid }) // select the collection which satisfies 
    
    if (!merchant) {
        throw new Error(': merchantid: Unable to login')
    }
    
    const isMatch = await bcrypt.compare(password, merchant.password)
    if (!isMatch) {
        throw new Error(': password: Unable to login')
    }
    return merchant
}

merchantSchema.methods.generateAuthToken = async function() { // no arrow function because of use of 'this'
    try {
        const merchant = this
        const token = jwt.sign({ _id: merchant._id.toString() }, process.env.JWT_SECRET)
        merchant.tokens = merchant.tokens.concat({token})
        await merchant.save()
        return token
    }   catch(e) {
        console.log(e)
    } 
}

const MerchantSignup = mongoose.model('Merchant_signup', merchantSchema)

module.exports = MerchantSignup