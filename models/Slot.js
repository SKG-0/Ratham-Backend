const mongoose = require('mongoose')

const slotSchema = mongoose.Schema(
    {
        student_id: { type: String },
        dean_id: { type: String, required: true },
        time: { type: Date, required: true },
        alloted: { type: Boolean, required: true },
    },
    { timestamps: true }
)

const Slot = mongoose.model('slot', slotSchema)
Slot.createIndexes()
module.exports = Slot
