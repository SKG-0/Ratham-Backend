require('dotenv').config()
const Slot = require('../models/Slot')
//checking for thursday or friday
const isThursdayOrFriday = (date) => {
    return date.getDay() === 4 || date.getDay() === 5 // 4 for Thursday, 5 for Friday
}
//adding a slot by dean
const addSlot = async (req, res) => {
    try {
        const { dean_id, time } = req.query
        const date = new Date(time)
        if (isThursdayOrFriday(date)) {
            //checking for same slots
            const checkSameSlot = await Slot.findOne({
                dean_id: dean_id,
                time: date,
            })
            if (checkSameSlot) {
                return res.json({
                    message: 'Cannot add two slots for same dean at same time',
                })
            }
            const slot = await Slot.create({
                dean_id: dean_id,
                time: date,
                alloted: false,
            })
            if (!slot) {
                return res.json({
                    message: 'Error adding slot',
                })
            }
            res.json({ message: 'Slot added successfully' })
        } else {
            return res.json({
                message: 'Please select a thursday or friday',
            })
        }
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error occurred.' })
    }
}
//get slots for dean
const getSlotDean = async (req, res) => {
    try {
        const { dean_id } = req.query
        //show slots booked by students
        const slots = await Slot.find({ dean_id: dean_id, alloted: true })
        const date = new Date()
        const filteredSlots = slots.filter((slot) => {
            const slotDate = new Date(slot.time)
            return slotDate > date
        })
        if (!slots) {
            return res.json({
                message: 'No alloted slots found.',
            })
        }
        res.json({
            message: 'slot found successfully.',
            data: filteredSlots,
        })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error occurred.' })
    }
}
//get slot for student
const getSlotStudent = async (req, res) => {
    try {
        //show slots that are available for booking
        const slots = await Slot.find({ alloted: false })
        if (!slots) {
            return res.json({
                message: 'No slots available.',
            })
        }
        res.json({
            message: 'Slots found successfully.',
            data: slots,
        })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error occurred.' })
    }
}
//book slots for students for a dean
const bookSlot = async (req, res) => {
    try {
        const { student_id, dean_id, time } = req.query
        //find a slot in which dean is available
        const slot = await Slot.findOne({
            dean_id: dean_id,
            time: time,
            alloted: false,
        })
        if (!slot) {
            return res.json({
                message: 'No slots found.',
            })
        }
        await Slot.updateOne(
            {
                dean_id: dean_id,
                time: time,
                alloted: false,
            },
            { $set: { alloted: true, student_id: student_id } }
        )
        //book an available slot
        const up = await Slot.findOne({
            dean_id: dean_id,
            time: time,
            alloted: true,
            student_id: student_id,
        })
        if (up) {
            return res.json({
                message: 'Slot booked successfully',
            })
        }
        return res.json({ message: 'Error while booking slot' })
    } catch (error) {
        console.log(error)
        res.json({ message: 'Error occurred.' })
    }
}

module.exports = { addSlot, getSlotDean, getSlotStudent, bookSlot }
