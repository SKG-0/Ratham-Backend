const express = require('express')
const router = express.Router()
const DeanController = require('../controllers/deanController')
// const getDean = require('../middlewares/getDean')
const { dean } = require('../middlewares/middleware')
router.post('/register', DeanController.registerDean)
router.post('/login', DeanController.loginDean)
router.get('/get', dean, DeanController.getDean)

module.exports = router
