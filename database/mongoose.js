const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.set('strictQuery', false);


mongoose.connect(`${process.env.DATABASE_URL}`)
    .then(() => {
        console.log(`Database connected`);
    })
    .catch(e => {
        console.log(`Error: ${e}`);
    })

    
// salelonga_996

// mongodb+srv://developer:salelonga_996@taxi.6rkptz5.mongodb.net/?retryWrites=true&w=majority