const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const userRouter = require('./routes/userRouter');
const roomRouter = require('./routes/roomRouter');
const mainRouter = require('./routes/mainRouter');
const gameRouter = require('./routes/gameRouter');

mongoose.connect(process.env.MONGO_URL, {
    retryWrites: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const app = express();
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(session({
    key: 'session',
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {
            retryWrites: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    })
}));

app.use('/users', userRouter);
app.use('/rooms', roomRouter);
app.use('/game', gameRouter);
app.use('/', mainRouter);

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(80);