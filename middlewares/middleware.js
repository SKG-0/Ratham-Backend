require('dotenv').config()
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const student = (req, res, next) => {
    //    Get the user from the jwt token
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send({ error: 'Please authenticate using valid token' })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET)
        //checking if the token provided is for student
        if (data.student.userType != 'Student') {
            res.status(401).send({
                error: 'Please authenticate using valid token',
            })
        }
        req.student = data.student
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate using valid token' })
    }
}
const dean = (req, res, next) => {
    //    Get the user from the jwt token
    const token = req.header('auth-token')
    if (!token) {
        res.status(401).send({ error: 'Please authenticate using valid token' })
    }

    try {
        const data = jwt.verify(token, JWT_SECRET)
        //checking if the token provided is for dean
        if (data.dean.userType != 'Dean') {
            res.status(401).send({
                error: 'Please authenticate using valid token',
            })
        }
        req.dean = data.dean
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate using valid token' })
    }
}

module.exports = { dean, student }
