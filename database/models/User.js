const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: (email) => {
            return validator.isEmail(email)
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true});

userSchema.virtual('tasks', { 
    ref: "Task", 
    localField: "_id", 
    foreignField: "owner" 
}) 

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();

    delete userObject.__v;
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.makeToken = function() {
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, `${process.env.TOKEN_SECRET}`);

    user.tokens = user.tokens.concat({token});

    return token;
}

userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({email});
    if(user === null) throw 'No User Found';

    const isValidPw = await bcrypt.compare(password, user.password);
    if(!isValidPw ) throw 'Wrong Password';

    return user;
}

const User = mongoose.model('User', userSchema);


module.exports = User;