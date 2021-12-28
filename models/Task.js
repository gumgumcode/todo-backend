const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            required: [true, 'Please provide a task name'],
            maxlength: 50,
        },
        completed: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user'],
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Task', TaskSchema)
