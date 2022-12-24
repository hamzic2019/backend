const hbs = require('hbs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
var cors = require('cors');

app.use(cors());

// including database
require('./database/mongoose');

// Setting port
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, './public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './templates/views'));
hbs.registerPartials(path.join(__dirname, './templates/partials'));

const userRoutes = require('./routes/user-route');
const taskRoutes = require('./routes/task-route');

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

const auth = require('./middleware/auth');

app.get('/', auth,(req, res) => {
    try {
        res.status(200).send({user: req.user, token: req.token, logged: req.logged});
    } catch(e) {
        res.status(400).send({e});
    }
});

app.listen(PORT, () =>{
    console.log(`Server is up and running on PORT: ${PORT}`);
});