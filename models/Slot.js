const mongoose = require('mongoose')

const slotSchema = mongoose.Schema(
    {
        dean_id: {
            type: String,
            required: true,
        },
        student_id: {
            type: String,
        },
        time: { type: Date, required: true },
        alloted: { type: Boolean, required: true },
    },
    { timestamps: true }
)

const Slot = mongoose.model('slot', slotSchema)
Slot.createIndexes()
module.exports = Slot
