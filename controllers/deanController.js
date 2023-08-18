require('dotenv').config()
const Dean = require('../models/Dean')
const bcrypt = require('bcryptjs')
// const JWT_SECRET =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')
//register a dean
const registerDean = async (req, res) => {
    try {
        const { name, email, pass, dean_id } = req.query
        //checking if a dean already exists with same name,email and dean_id
        const checkDean = await Dean.findOne({
            name: name,
            email: email,
            dean_id: dean_id,
        })
        if (checkDean) {
            return res.json({ message: 'Dean exists' })
        }
        //encrypting password
        const salt = await bcrypt.genSalt(10)
        const securePass = await bcrypt.hash(pass, salt)
        const dean = await Dean.create({
            dean_id: dean_id,
            name: name,
            email: email,
            pass: securePass,
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
        const { dean_id, pass } = req.query
        //check for dean
        const dean = await Dean.findOne({ dean_id })
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
                dean_id: dean.dean_id,
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
        const id = req.dean.dean_id
        //check for dean with dean_id
        const dean = await Dean.findOne({ dean_id: id }).select('-pass')
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
