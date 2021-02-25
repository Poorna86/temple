const mongoose = require('mongoose');

const createEvent = new mongoose.Schema({
    merchantid:{
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    merchantName: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    eventName: {
        type: String,
        required: true,
        unique: false,
        trim: true 
    },
    eventManager: {
        type: String,
        required: true,
        unique: false,
        trim: true
    },
    eventManagerPhone: {
        type: Number,
        contact: true,
        required: true,
        trim: true
    },
    eventDate:{
        type: Date,
        required: true,
        trim: true
    }
},{
    timestamps: true
})

createEvent.pre('save', async function (next) {     
    const user = this

    next()
})

const EventCreate = mongoose.model('Event_Merchant', createEvent)

module.exports = EventCreate