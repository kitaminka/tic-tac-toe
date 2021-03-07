const express = require('express');
const session = require('express-session');
require('dotenv').config();

const userRouter = require('./routes/userRouter');
const mainRouter = require('./routes/mainRouter');

const app = express();
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}));

app.use('/users', userRouter);
app.use('/', mainRouter);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(80);