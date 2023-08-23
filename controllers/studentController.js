require('dotenv').config()
const bcrypt = require('bcryptjs')
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')
const User = require('../models/User')
//register a student
const registerStudent = async (req, res) => {
    try {
        const { name, pass, email, user_id, userType } = req.query
        //check for an existing student
        const checkStudent = await User.findOne({
            user_id: user_id,
            userType: 'Student',
        })
        if (checkStudent) {
            return res.json({
                message: 'Student already exists',
            })
        }
        //encrypting password
        const salt = await bcrypt.genSalt(10)
        const securePass = await bcrypt.hash(pass, salt)
        const student = await User.create({
            user_id: user_id,
            email: email,
            name: name,
            pass: securePass,
            userType: 'Student',
        })

        if (!student) {
            return res.json({
                message: 'Error creating acount',
            })
        }
        res.json({ message: 'Account created successfuly.' })
    } catch (error) {
        console.log(error.message)
        res.json({ message: 'Error Occured' })
    }
}
//student login
const loginStudent = async (req, res) => {
    try {
        const { user_id, pass } = req.query
        //check for an account with user_id and student type
        const student = await User.findOne({
            user_id: user_id,
            userType: 'Student',
        })
        if (!student) {
            return res.json({
                message: 'Account does not exist.',
            })
        }
        //matching passwords
        const matchPassword = await bcrypt.compare(pass, student.pass)
        if (!matchPassword) {
            return res.json({
                message: 'Password does not match.',
            })
        }
        const data = {
            student: {
                user_id: student.user_id,
                userType: 'Student',
            },
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({
            message: 'Logged in Successfully',
            token: authToken,
        })
    } catch (error) {
        console.log(error.message)
        res.json({ message: 'Error Occured' })
    }
}
//get student data
const getStudent = async (req, res) => {
    try {
        const { user_id, userType } = req.query
        const student = await User.findOne({
            user_id: user_id,
            userType: 'Student',
        }).select('-pass')
        if (!student) {
            return res.json({ message: 'Student not found.' })
        }
        res.json({
            message: 'Student data found successfully',
            data: student,
        })
    } catch (error) {
        res.json({ message: 'Error occurred.' })
    }
}

module.exports = { registerStudent, loginStudent, getStudent }
