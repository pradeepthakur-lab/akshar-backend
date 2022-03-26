const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/astroapi', { useNewUrlParser: true });
// mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
// mongoose.connect(process.env.MONGO_DB);
// mongoose.debug = true
// mongoose.set('debug', true);

mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connection Success!');
}).catch((err) => {
    console.log('Database connection faild!', err);
});

mongoose.debug = true
mongoose.set('debug', true);