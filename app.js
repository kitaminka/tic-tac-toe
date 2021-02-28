const express = require('express');
const userRouter = require('./routes/userRouter');
const mainRouter = require('./routes/mainRouter');

const app = express();
app.set('view engine', 'ejs');

app.use('/users', userRouter);
app.use('/', mainRouter);

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(80);