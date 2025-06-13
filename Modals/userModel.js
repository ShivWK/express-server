const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please Provide email"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
        unique: true,
        trim: true
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
    },
    confirmPassword: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: "Password and confirm password does not match."

            // this validator will work for the save and create action but not for update by default we need to make validation: true in the update action then it will work there also
        }
    }
})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    // encrypt the password when it is modified
    this.password = await bcryptjs.hash(this.password, 12);
    this.confirmPassword = undefined;
})

const User = mongoose.model("User", userSchema);
module.exports = User;