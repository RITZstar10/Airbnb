import mongoose, { Schema } from "mongoose";

const placeSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "UserModel"
    },
    title: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: [String],
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number
})

export const PlaceModel = mongoose.model('PlaceModel', placeSchema);