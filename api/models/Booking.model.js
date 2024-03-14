import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    price: {
        type: Number
    }
});

export const BookingModel = mongoose.model('BookingModel', bookingSchema);