const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    insID: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    originalImage: {
        type: String,
        required: true
    },
    editImage: {
        type: String,
        required: false
    },
    score: {
        type: Number,
        required: false
    },
}, { timestamps: true })

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task };