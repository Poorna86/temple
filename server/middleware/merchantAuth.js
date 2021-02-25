const jwt = require('jsonwebtoken')
const MerchantSignup = require('../models/merchantmodels/merchantsignup');

const merchantAuth = async (req, res, next) => {
    try{
        const token = req.cookies['auth_token']
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // ensure token hasn't expired
        const merchant = await MerchantSignup.findOne({_id: decoded._id, 'tokens.token': token}) // grab user from database
        if (merchant) {
			req.merchant = merchant
        }
        req.token = token //added for logout
        next()
    } catch (e) {
        console.log(console.log('please authenticate!!', e))
        res.status(401).send(e)
    }
}

module.exports = merchantAuth