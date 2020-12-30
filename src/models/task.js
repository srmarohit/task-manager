const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 4,
        required: true,
        trim: true
    },
    description: {
        type: String,
        minlength: 8,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;