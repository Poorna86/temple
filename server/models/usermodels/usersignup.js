const passwordValidator = require('password-validator');
const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    merchantid:{
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    userEmail:{
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
userSchema.pre('save', async function (next) {     
    const signup = this
    console.log('signup: ', signup)
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

userSchema.statics.findByCredentials = async (userEmail, password) => {
    const user = await UserSignup.findOne({ userEmail }) // select the collection which satisfies 
    
    if (!user) {
        throw new Error(': usermail: Unable to login')
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error(': password: Unable to login')
    }
    return user
}

userSchema.methods.generateAuthToken = async function() { // no arrow function because of use of 'this'
    try {
        const user = this
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
        user.tokens = user.tokens.concat({token})
        await user.save()
        return token
    }   catch(e) {
        console.log(e)
    }
}

const UserSignup = mongoose.model('User_signup', userSchema)

module.exports = UserSignup