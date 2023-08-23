require('dotenv').config()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')
//register a dean
const registerDean = async (req, res) => {
    try {
        const { name, email, pass, user_id, userType } = req.query
        //checking if a dean already exists with same name,email and user_id
        const checkDean = await User.findOne({
            name: name,
            email: email,
            user_id: user_id,
            userType: 'Dean',
        })
        if (checkDean) {
            return res.json({ message: 'Dean exists' })
        }
        //encrypting password
        const salt = await bcrypt.genSalt(10)
        const securePass = await bcrypt.hash(pass, salt)
        const dean = await User.create({
            user_id: user_id,
            name: name,
            email: email,
            pass: securePass,
            userType: 'Dean',
        })
        if (!dean) {
            return res.json({
                message: 'Error creating account',
            })
        }
        res.json({ message: 'Account created successfully' })
    } catch (error) {
        res.json({ message: 'Error Occured' })
    }
}
//Dean login
const loginDean = async (req, res) => {
    try {
        const { user_id, pass, userType } = req.query
        //check for dean type and user_id
        const dean = await User.findOne({ user_id: user_id, userType: 'Dean' })
        if (!dean) {
            return res.json({
                message: 'No account found.',
            })
        }
        //matching password
        const matchPassword = await bcrypt.compare(pass, dean.pass)
        if (!matchPassword) {
            return res.json({
                message: 'password does not matches',
            })
        }
        const data = {
            dean: {
                user_id: dean.user_id,
                userType: 'Dean',
            },
        }
        //generating auth token
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({
            message: 'Login Successfully',
            token: authToken,
        })
    } catch (error) {
        console.log(error.message)
        res.json({ message: 'Error Occured' })
    }
}
//get details of a dean
const getDean = async (req, res) => {
    try {
        const { user_id, userType } = req.query
        //check for dean with user_id
        const dean = await User.findOne({
            user_id: user_id,
            userType: 'Dean',
        }).select('-pass')
        if (!dean) {
            return res.json({ message: 'No dean found' })
        }
        res.json({ message: 'Dean found', data: dean })
    } catch (error) {
        console.log(error.message)
        res.json({ message: 'Error occurred.' })
    }
}
module.exports = { registerDean, loginDean, getDean }
