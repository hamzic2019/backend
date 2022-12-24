const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        trim: true
    },
    isCompleted: { type: Boolean, default: false },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

const Task = mongoose.model('Task', taskSchema);


module.exports = Task;