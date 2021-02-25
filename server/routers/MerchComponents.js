const express = require('express')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const merchantAuth = require('../middleware/merchantAuth')
const MerchantRead = require('../models/merchantmodels/merchantRead')
const MerchantSignup = require('../models/merchantmodels/merchantsignup')
const UserCreate = require('../models/merchantmodels/usercreate')
const EventCreate = require('../models/merchantmodels/eventCreate')
const DonationCreate = require('../models/usermodels/createDonation')
const { sendWelcomeEmail } = require('../emails/account')

const mrchRouter = new express.Router;

//
// without middleware: new request -> run route handler
//
// with middleware: new request -> do something -> run route handler
//

mrchRouter.post('/merchant/signup', async (req, res) => {

  try{
    const merchantid = await MerchantRead.findMerchant(req.body.merchantid, req.body.merchantName)
    if(!merchantid){
      throw new Error(': merchantid: Please enter valid merchant id and Name')
    } else {
      const validPhone = validateSignupPhone(req.body.phone)
      if(!validPhone) {
        throw new Error(': phone: Please enter valid valid phone number')
      }
      const merchant = new MerchantSignup(req.body)
      await merchant.save()
      res.status(201).redirect('/')
    }
  } catch(err) {
    if(err.code === 11000){
      err.message =  ': merchantid: Please enter unique merchant id'
    }
    const errors = errorhandle(err)
    console.log('errors: ', errors)
    res.status(400).send(errors)
  }
})

mrchRouter.post('/merch/login', async (req, res) => {
  
    try{
      const merchant = await MerchantSignup.findByCredentials(req.body.merchantid, req.body.password)
      const token = await merchant.generateAuthToken()
      res.cookie('auth_token', token)
      res.status(201).send(merchant)
    } catch(err){
      const errors = errorhandle(err)
      res.status(400).send(errors)
    }
});

mrchRouter.get('/api/dashboard', merchantAuth, async (req, res) => {
  const date_ob = new Date()
   try {
     if(req.merchant){
      const eventList = await EventCreate.find({eventDate: {$gte: date_ob}, merchantid: req.merchant.merchantid}, 'eventName eventDate')
      const donationUserList = await DonationCreate.find({merchantid: req.merchant.merchantid})
  
      const upcomingEventDetails = eventList.map((element) => {
                                    
                                    const eventColList = {eventName: element.eventName,
                                                          eventDate: element.eventDate}
                                    return eventColList
                                  })
      const mrchDashboardDetails = {
        upcomingEventDetails,
        donationUserList
      }
      res.status(201).send(mrchDashboardDetails)
      }
    }catch (e) {
      console.log('e: ', e)
    }
});

mrchRouter.get('/api/profileedit', merchantAuth, async (req, res) => {
  try {
    if(!req.merchant){
    } else {
      res.status(201).send(req.merchant)
    }
   } 
   catch (e) {
    console.log('e: ', e)
    const errors = errorhandle(e)
    res.status(400).send(errors)
   }
});

mrchRouter.patch('/api/profileedit', merchantAuth, async (req, res) => {
  const updates = Object.keys(req.body)//getting input columns
  try {
    switch (updates[0]) {
      case 'phone':
        const validatePhone = validateSignupPhone(req.body.phone) 
          if (validatePhone){
            req.merchant.phone = req.body.phone
            await req.merchant.save()
            const pswdstatus = ''
            const merchantPublicDetails = getMerchantPublicDetails(req.merchant, pswdstatus)
            return res.status(201).send(merchantPublicDetails)
          } else {
            throw new Error (': phone: please enter valid phone number')
          }
      case 'email':
        if (req.merchant.email === req.body.email){
          throw new Error (': email: duplicate email. Please enter unique mail id')
        } else if(!validator.isEmail(req.body.email)){
          throw new Error (': email: invalid mail format')
        } else {
          req.merchant.email = req.body.email
          await req.merchant.save()
          const pswdstatus = ''
          const merchantPublicDetails = getMerchantPublicDetails(req.merchant, pswdstatus)
          return res.status(201).send(merchantPublicDetails)
        }
      case 'oldPassword':
          const authenticated = await bcrypt.compare(req.body.oldPassword, req.merchant.password)
          if (authenticated) {
            req.merchant['password'] = req.body['password']
            req.merchant['repassword'] = req.body['repassword']
            await req.merchant.save()
            const pswdstatus = 'OK'
            const merchantPublicDetails = getMerchantPublicDetails(req.merchant,pswdstatus)
            return res.status(201).send(merchantPublicDetails)
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

mrchRouter.get('/api/createuser', merchantAuth, async (req, res) => {
  let date_ob = new Date()
  try {
    const eventList = await EventCreate.find({eventDate: {$gte: date_ob}, merchantid: req.merchant.merchantid}, 'eventName')
    const userList = await UserCreate.find({merchantid: req.merchant.merchantid})
    const userDetails = userList.map((element) => {
                        const userColList = {name: element.userEmail}
                        return userColList
                        })
    const usercolsDetails = userList.map((element) => {
                            const userColList = {userEmail: element.userEmail,
                                                 userphone: element.userphone}
                            return userColList
                          })
    const eventName = eventList.map(({eventName}) => eventName)
    eventName.unshift('Select')
    const eventDetails = {
      eventName,
      merchantid: req.merchant.merchantid,
      userDetails,
      usercolsDetails
    }
    res.status(201).send(eventDetails)
  }  
  catch (err) {
    console.log(err)
  }  
})

mrchRouter.post('/api/createuser', merchantAuth, async (req, res) => {

  try {
      if(!req.merchant){
        res.redirect('/')
      } else {
          const userList = await UserCreate.find({userEmail: req.body.userEmail})
          if(userList){
            userList.map((element) => {
              if(element.userEvent === req.body.userEvent){
                throw new Error (': event: Already Event added to this user')
              }
              if(element.userphone !== req.body.userphone){
                throw new Error (': phone: Please check Prev phone num to this user')
              }
            })
          }
          
          const validatePhone = validateSignupPhone(req.body.userPhone)
          if (!validatePhone){
            throw new Error (': phone: please enter valid phone number')
          }
          const userDetails = {
            merchantid: req.merchant.merchantid,
            merchantName: req.merchant.merchantName,
            userEvent: req.body.userEvent,
            userphone: req.body.userPhone,
            userEmail: req.body.userEmail
          }
          const createUser = new UserCreate(userDetails)
          console.log('createUser: ', createUser)
          await createUser.save()
          sendWelcomeEmail(userDetails.userEmail,userDetails.userPhone)
          res.status(201).send(userDetails)
      } 
    } 
  catch (err) {
    if(err.code === 11000){
      var field = err.message.split(".$")[1];
          field = field.split(" dup key")[0];
          field = field.substring(0, field.lastIndexOf("_"));
          err.message = `: ${field}: please enter unique user mail ID`
    }
    const errors = errorhandle(err)
    console.log('errors: ', errors)
    res.status(400).send(errors)
  }
})

mrchRouter.post('/api/createevent', merchantAuth, async (req, res) => {

  try {
      if(!req.merchant){
        res.redirect('/')
      } else {
          const validatePhone = validateSignupPhone(req.body.eventManagerPhone)
          if (!validatePhone){
            throw new Error (': phone: please enter valid phone number')
          }
          const eventDetails = {
            merchantid: req.merchant.merchantid,
            merchantName: req.merchant.merchantName,
            eventName: req.body.eventName,
            eventDate: req.body.eventDate,
            eventManager: req.body.eventManager,
            eventManagerPhone: req.body.eventManagerPhone
          }
          const createUser = new EventCreate(eventDetails)
          console.log('createUser: ', eventDetails)
          await createUser.save()
          res.status(201).send(eventDetails)
      } 
    } 
  catch (err) {
    console.log('error1: ', err)
    if(err.code === 11000){
      var field = err.message.split(".$")[1];
          field = field.split(" dup key")[0];
          field = field.substring(0, field.lastIndexOf("_"));
          err.message = `: ${field}: please enter unique ${field}`
    }
    const errors = errorhandle(err)
    console.log('errors: ', errors)
    res.status(400).send(errors)
  }
})

mrchRouter.post('/logout', merchantAuth, async (req, res) => {
	try {
    if(!req.merchant){
      throw new Error(': merchantid: Not login')
    }
		req.merchant.tokens = req.merchant.tokens.filter((token) => {
			return token.token !== req.token
    })
    await req.merchant.save()
    res.clearCookie('auth_token')
    res.status(200).send()
	} catch (e) {
    const errors = errorhandle(e)
    console.log('errors: ', errors)
    res.status(400).send(errors)
	}
})


// const generateUserID = (merchantName) => {
//   var val = Math.floor(1000 + Math.random() * 9000);
//   var userid = 'U' + merchantName + val
//   return userid
// }


const getMerchantPublicDetails = (merchant, pswdstatus) => {
  const merchantPublicDetails = {
    merchantid: merchant.merchantid,
    phone: merchant.phone,
    email: merchant.email,
    pswdstatus: pswdstatus
  }
  return merchantPublicDetails
}

const validateSignupPhone = (phone) => {
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return regex.test(phone)
}

const errorhandle = (e) => {
    const errors = {}
    const error = JSON.stringify(e.message)
    const allErrors = error.substring(error.indexOf(':')+1).trim()
    const allErrorsInArrayFormat = allErrors.split(',').map(e => e.trim())
    allErrorsInArrayFormat.forEach(error => {
      const [key, value] = error.split(':').map(err => err.trim());
      errors[key] = value.replace(/"/g, "")
    })
    return errors
}

module.exports = mrchRouter;