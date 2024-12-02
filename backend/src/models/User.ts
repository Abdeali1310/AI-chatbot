const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const chatSchema =  new mongoose.Schema({
    role:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    }
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    
    profilePicUrl:{
        type:String,
    },
    chats:[chatSchema]
})

//password hashing
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});


const User = mongoose.model("User", userSchema);

module.exports = User;