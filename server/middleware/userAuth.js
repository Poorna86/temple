const jwt = require('jsonwebtoken')
const UserSignup = require('../models/usermodels/usersignup');

const userAuth = async (req, res, next) => {
    try{
        const token = req.cookies['user_token']
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // ensure token hasn't expired
        const user = await UserSignup.findOne({_id: decoded._id, 'tokens.token': token}) // grab user from database
        if (user) {
			req.user = user
        }
        req.token = token //added for logout
        next()
    } catch (e) {
        console.log('please authenticate!!', e)
        res.status(401).send(e)
    }
}

module.exports = userAuth