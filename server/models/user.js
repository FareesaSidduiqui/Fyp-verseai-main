const mongoose = require('mongoose')
// const { userInfo } = require('os')

const UserSchema = new mongoose.Schema({
    uid: {
       type : String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },

}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User