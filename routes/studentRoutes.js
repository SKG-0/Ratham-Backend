const express = require('express')
const router = express.Router()
const StudentController = require('../controllers/studentController')
const { student } = require('../middlewares/middleware')
router.post('/register', StudentController.registerStudent)
router.post('/login', StudentController.loginStudent)
router.get('/get', student, StudentController.getStudent)

module.exports = router
