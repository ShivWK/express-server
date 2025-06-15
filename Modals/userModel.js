const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto"); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name."],
        trim: true
    },
    role: {
        type: String,
        enum: ["admin", "user", "superUser"],
        default: 'user',
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
        select: false,
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
    },
    passwordChangedAt : Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date
})

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    // encrypt the password when it is modified
    this.password = await bcryptjs.hash(this.password, 12);
    this.confirmPassword = undefined;
});

userSchema.methods.verifyThePassword = async function(lgPassword) {
    return await bcryptjs.compare(lgPassword, this.password);
}

userSchema.methods.verifyIsPasswordChanged = async function(JWTIssuedAt) {
    if (this.passwordChangedAt) {
        const passwordChangedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        console.log(passwordChangedTimeStamp, JWTIssuedAt);

        return JWTIssuedAt < passwordChangedTimeStamp;
        // jo pehele bana hai uska timestamp bad me bane hue se jada hoga, isko aise smjhon ki kitna der hui bane
    }

    return false;
}

userSchema.methods.createRandomToken = async function() {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetTokenExpiry = Date.now() + 15*60*1000;

    return resetToken;
}


const User = mongoose.model("User", userSchema);
module.exports = User;