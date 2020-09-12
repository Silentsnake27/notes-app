const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URI, {

        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: true
    })
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));