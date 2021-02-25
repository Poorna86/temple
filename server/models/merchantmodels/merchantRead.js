const mongoose = require('mongoose')


const merchantSchema = new mongoose.Schema({
    merchantid:{
        type: String,
        required: true,
        trim: true
    }
})    

merchantSchema.statics.findMerchant = async (merchantid,merchantName) => {
    const merchant = await MerchantRead.findOne({ merchantid, merchantName }) // select the collection which satisfies 
    
    return merchant
}

const MerchantRead = mongoose.model('Merchant_list', merchantSchema)

module.exports = MerchantRead