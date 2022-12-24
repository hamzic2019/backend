const jwt = require('jsonwebtoken');
const User = require('./../database/models/User');
const dotenv = require('dotenv');

dotenv.config();

const auth = async (req, res, next) => {
    let token = req.headers["authorization"] //.replace('Bearer ', '');
    
    if(token === undefined){
        req.logged = false;
        next();
    }else {
        token = token.replace('Bearer ', '');

  
        const isValid = jwt.verify(token, `${process.env.TOKEN_SECRET}`)

        const user = await User.findOne({_id: isValid._id});

        req.user = user;
        req.token = token; 
        req.logged = true;

        next();
    }
}

module.exports = auth;