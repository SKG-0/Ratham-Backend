require('dotenv').config()
const Student = require('../models/Student')
const bcrypt = require('bcryptjs')
// const JWT_SECRET =
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
const JWT_SECRET = process.env.JWT_SECRET
const jwt = require('jsonwebtoken')
//register a student
const registerStudent = async (req, res) => {
    try {
        const { name, pass, email, student_id } = req.query
        //check for an existing student
        const checkStudent = await Student.findOne({
            student_id: student_id,
        })
        if (checkStudent) {
            return res.json({
                message: 'Account already exists',
            })
        }
        //encrypting password
        const salt = await bcrypt.genSalt(10)
        const securePass = await bcrypt.hash(pass, salt)
        const student = await Student.create({
            student_id: student_id,
            email: email,
            name: name,
            pass: securePass,
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
        const { student_id, pass } = req.query
        //check for an account with student_id
        const student = await Student.findOne({ student_id: student_id })
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
                student_id: student.student_id,
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
        const student_id = req.student.student_id
        const student = await Student.findOne({
            student_id: student_id,
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
