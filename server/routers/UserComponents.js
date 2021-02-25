const express = require('express');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UserSignup = require('../models/usermodels/usersignup');
const UserCreate = require('../models/merchantmodels/usercreate');
const UserMerchant = require('../models/merchantmodels/usercreate');
const DonationCreate = require('../models/usermodels/createDonation');
const userAuth = require('../middleware/userAuth');
const { sendWelcomeEmail } = require('../emails/account');

const userRouter = new express.Router;

userRouter.post('/api/user/signup', async (req, res) => {
  
  const userInfo = await UserCreate.findOne({ userEmail: req.body.userEmail })
  const usersignupInfo = await UserSignup.find({ userEmail: req.body.userEmail })
  console.log('usersignupInfo: ', usersignupInfo)
  try{
    if(!userInfo){
      throw new Error(': userEmail: User not added, Please contact Merchant !!')
    } else {
      const userDetails = {
        merchantid: userInfo.merchantid,
        userEmail:  req.body.userEmail,
        password: req.body.password,
        repassword: req.body.repassword
      }
      console.log('userDetails: ', userDetails)
      const user = new UserSignup(userDetails)
      await user.save()
      res.status(201).redirect('/')
    }
  } catch(err) {
    if(err.code === 11000){
      err.message =  ': userEmail: Mail id already exists!!'
    }
    const errors = errorhandle(err)
    console.log('errors: ', errors)
    res.status(400).send(errors)
  }
})

userRouter.post('/api/user/login', async (req, res) => {
  
  try{
    const user = await UserSignup.findByCredentials(req.body.userEmail, req.body.password)
    const token = await user.generateAuthToken()
    res.cookie('user_token', token)
    const userInfo = await UserCreate.find({ userEmail: req.body.userEmail })
    const eventName = userInfo.map(({userEvent}) => userEvent)
    const details = userInfo[0]
    eventName.unshift('Select')
    const userdetails = {
      userphone: details.userphone,
      useremail: details.userEmail,
      eventName
    }
    console.log('userdetails: ', userdetails)
    res.status(201).send(userdetails)
  } catch(err){
    console.log(err)
    const errors = errorhandle(err)
    res.status(400).send(errors)
  }
});

userRouter.get('/api/userprofileedit', userAuth, async (req, res) => {
  
  try {
    if(!req.user){
    } else {
      const userInfo = await UserCreate.find({ userEmail: req.user.userEmail })
      const details = userInfo[0]
      const userdetails = {
        userphone: details.userphone,
        useremail: details.userEmail
      }
      res.status(201).send(userdetails)
    }
   }
   catch (e) {
    console.log('e: ', e)
    const errors = errorhandle(e)
    res.status(400).send(errors)
   }
});

userRouter.patch('/api/userprofileedit', userAuth, async (req, res) => {
  const updates = Object.keys(req.body)//getting input columns
  const userUpdate = await UserCreate.findOne({ userEmail: req.user.userEmail })
  try {
    switch (updates[0]) {
      case 'phone':
        const validatePhone = validateSignupPhone(req.body.phone) 
          if (validatePhone){
            userUpdate.userphone = req.body.phone
            await UserCreate.updateMany({ userEmail : req.user.userEmail }, { userphone : req.body.phone });
            const pswdstatus = ''
            const userPublicDetails = getUserPublicDetails(userUpdate, pswdstatus)
            return res.status(201).send(userPublicDetails)
          } else {
            throw new Error (': phone: please enter valid phone number')
          }
      // case 'email':
      //   if (userUpdate.userEmail === req.body.email){
      //     throw new Error (': email: duplicate email. Please enter unique mail id')
      //   } else if(!validator.isEmail(req.body.email)){
      //     throw new Error (': email: invalid mail format')
      //   } else {
      //     userUpdate.userEmail = req.body.email
      //     await UserCreate.updateMany({ userEmail : req.user.userEmail }, { userphone : req.body.phone });
      //     const pswdstatus = ''
      //     const userPublicDetails = getUserPublicDetails(userUpdate, pswdstatus)
      //     return res.status(201).send(userPublicDetails)
      //   }
      case 'oldPassword':
          const authenticated = await bcrypt.compare(req.body.oldPassword, req.user.password)
          if (authenticated) {
            req.user['password'] = req.body['password']
            req.user['repassword'] = req.body['repassword']
            await req.user.save()
            const pswdstatus = 'OK'
            const userPublicDetails = getUserPublicDetails(userUpdate,pswdstatus)
            return res.status(201).send(userPublicDetails)
          } else {
            throw new Error(': password: old password entered invalid. Password was not updated.')
          }
      case 'undefined':
          break;
    }
  } catch (err) {
    console.log('errors: ', err)
    const errors = errorhandle(err)
    res.status(400).send(errors)
  }
});

userRouter.get('/api/userdashboard', userAuth, async (req, res) => {

  try {
    if(!req.user){
    } else {
      const donationInfo = await DonationCreate.find({ userEmail: req.user.userEmail })
      res.status(201).send(donationInfo)
    }
   }
   catch (e) {
    console.log('e: ', e)
    const errors = errorhandle(e)
    res.status(400).send(errors)
   }
});

userRouter.get('/api/userdonorreceipt', userAuth, async (req, res) => {

  try {
    if(!req.user){
    } else {
      const userInfo = await UserCreate.find({ userEmail: req.user.userEmail })
      const eventName = userInfo.map(({userEvent}) => userEvent)
      eventName.unshift('Select')
      const eventDetails = {
        eventName,
        userEmail: req.user.userEmail
      }
      console.log(eventDetails)
      res.status(201).send(eventDetails)
    }
   }
   catch (e) {
    console.log('e: ', e)
    const errors = errorhandle(e)
    res.status(400).send(errors)
   }
});

userRouter.post('/api/userdonorreceipt', userAuth, async (req, res) => {

  try {
    if(!req.user){
    } else {
      const donationDetails = {
        merchantid: req.user.merchantid,
        userEmail: req.user.userEmail,
        donorName: req.body.donorName,
        donAmount: req.body.donAmount,
        donPhone: req.body.donPhone,
        assignEvent: req.body.assignEvent,
        donationDate: req.body.donationDate
      }
      const createDonation = new DonationCreate(donationDetails)
      await createDonation.save()
      res.status(201).send()
    }
   }
   catch (e) {
    console.log('e: ', e)
    const errors = errorhandle(e)
    res.status(400).send(errors)
   }
})

userRouter.post('/userlogout', userAuth, async (req, res) => {
	try {
    if(!req.user){
      throw new Error(': userID: Not login')
    }
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token
    })
    await req.user.save()
    res.clearCookie('user_token')
    res.status(200).send()
	} catch (e) {
    const errors = errorhandle(e)
    console.log('errors: ', errors)
    res.status(400).send(errors)
	}
})

const errorhandle = (e) => {
  const errors = {}
  console.log(e)
  const error = JSON.stringify(e.message)
  const allErrors = error.substring(error.indexOf(':')+1).trim()
  const allErrorsInArrayFormat = allErrors.split(',').map(e => e.trim())
  allErrorsInArrayFormat.forEach(error => {
    const [key, value] = error.split(':').map(err => err.trim());
    errors[key] = value.replace(/"/g, "")
  })
  return errors
}

const validateSignupPhone = (phone) => {
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return regex.test(phone)
}

const getUserPublicDetails = (user, pswdstatus) => {
  const userPublicDetails = {
    userID: user.userID,
    phone: user.userphone,
    email: user.useremail,
    pswdstatus: pswdstatus
  }
  return userPublicDetails
}

module.exports = userRouter