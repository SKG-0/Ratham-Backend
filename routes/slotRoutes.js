const express = require('express')
const router = express.Router()
const slotController = require('../controllers/slotController')
// const getStudent = require('../middlewares/getStudent')
// const getDean = require('../middlewares/getDean')
const { student, dean } = require('../middlewares/middleware')

router.post('/add', dean, slotController.addSlot)
router.post('/book', student, slotController.bookSlot)
router.get('/getForDean', dean, slotController.getSlotDean)
router.get('/getForStudent', student, slotController.getSlotStudent)
module.exports = router
