//define database structure


import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    profile: {},
    firstname: {},
    lastname: {},
    email: {
        type: String,
        required: [true, "Please provide an unique email"],
        unique: true,
    },
    phoneNumber: {
        type: Number,
    },
    password: {
        type : String,
        required: [true, "Please provide a password"],
        unique: false,
    },
    role: {
        type: String,
        required: [true, "Please provide a role"],

    }

export default mongoose.model.Users || mongoose.model('User', UserSchema)