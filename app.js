const hbs = require('hbs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
var cors = require('cors');

app.use(cors());

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://superb-biscuit-289d7d.netlify.app');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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

app.get('/', (req, res) => {
    try {
        res.sendStatus(200);
    } catch(e) {
        res.status(400).send({e});
    }
});

app.listen(PORT, () =>{
    console.log(`Server is up and running on PORT: ${PORT}`);
});