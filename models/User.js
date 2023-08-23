const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        user_id: { type: String, required: true },
        name: { type: String, required: true },
        pass: { type: String, required: true },
        email: { type: String, required: true },
        userType: { type: String, enum: ['Dean', 'Student'], required: true },
    },
    { timestamps: true }
)

const User = mongoose.model('user', userSchema)
User.createIndexes()
module.exports = User
