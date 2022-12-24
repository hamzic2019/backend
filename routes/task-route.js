const { response } = require('express');
const express = require('express');
const router = express.Router();
const Task = require('./../database/models/Task');
const auth = require('./../middleware/auth');


// Create new Task
router.post('/',auth, async(req, res) => {
    try {
        const options = Object.keys(req.body);
        const allowed = ["task"];
        const isAllowed = options.every(option => allowed.includes(option));

        if(!isAllowed) throw 'Sorry Buddy NEKI PROBLEM SA VALDINOSCU***???!';
    
        const task = new Task({
            ...req.body,
            owner: req.user._id
        });

        await task.save();

        res.status(200).send({task});
    } catch(e) {
        res.status(400).send({e});
    }
})


// Read All Tasks (Later to be configured only for Admins!)
router.get('/', auth, async(req, res) => {
    try {
        const tasks = await Task.find();
    
        res.status(200).send({tasks});
    } catch(e) {
        res.status(400).send({e});
    }
}); 

router.patch('/:id', auth ,async(req, res) => {
    try {
        const options = Object.keys(req.body);
        const allowed = ["task", "isCompleted"];
        const isValid = options.every(option => allowed.includes(option));

        if(!isValid) throw 'SORRY BUDDY!';

        const id = req.params.id;
        const task = await Task.findOne({_id: id, owner: req.user._id});

        options.forEach(option => {
            task[option] = req.body[option];
        })

        await task.save();

        res.status(200).send(task);
    } catch(e) {
        res.status(400).send({e});
    }
})

router.delete('/:id',auth,  async(req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOneAndDelete({_id: id, owner: req.user._id});

        res.status(200).send({task});
    } catch(e) {
        res.status(400).send({e});
    }
});



module.exports = router;