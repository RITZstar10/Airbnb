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
    description: {
        type: String,
    },
    perks: [String],
    extraInfo: [String],
    checkIn: {
        type: Number,
    },
    checkOut: {
        type: Number,
    },
    maxGuests: {
        type: Number,
    },
    price: {
        type: Number,
    }
})

export const PlaceModel = mongoose.model('Place', placeSchema);