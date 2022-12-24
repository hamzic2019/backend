const express = require('express');
const router = express.Router();
const User = require('./../database/models/User');
const auth = require('./../middleware/auth');


router.get('/profile',auth ,async(req, res) => {
    try {
        res.status(200).send({user: req.user, token: req.token});
    } catch(e) {
        res.status(400).send({e});
    }
});

router.get('/tasks', auth ,async(req, res) => {
    try {
        await req.user.populate('tasks');
        res.status(200).send(req.user.tasks);
    } catch(e) {
        res.status(400).send({e});
    }
});



// C from CRUD
router.post('/', async(req, res) => {
    try {
        const options = Object.keys(req.body);
        const allowed = ["email", "password"];
        const isValid = options.every(option => allowed.includes(option));

        if(!isValid) throw 'Sorry Buddy!';

        const user = new User(req.body);
        const token = user.makeToken();

        await user.save();
    
        res.status(200).send({user, token});
    } catch(e) {
        res.status(400).send({e});
    }
});
 
// R from CRUD
router.get('/',async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({users});
    } catch(e) {
        res.status(400).send({e});
    }
});

// U from CRUD
router.patch('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const options = Object.keys(req.body);
        const allowed = ["email", "password"];
        const isAllowed = options.every(option => allowed.includes(option));


        if(!isAllowed) throw 'Sorry Buddy';

        const user = await User.findById(id);

        options.forEach(option => {
            user[option] = req.body[option]
        });

        await user.save();

        res.status(200).send({user});
        
    }catch(e) {
        res.status(400).send({e});
    }
})

// D from CRUD
router.delete('/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        res.status(200).send({msg: 'User Deleted'});
        
    } catch(e) {
        res.status(400).send({e});
    }
});



// LOGIN USER IN!!
router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = user.makeToken();
        await user.save();

        res.status(200).send({user, token});
    }catch(e) {
        res.status(400).send({e});
    }
})

module.exports = router;