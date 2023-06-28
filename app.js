const express = require('express');
const bodyParser = require('body-parser');

const { mongoConnect } = require('./utils/database');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    const error = {};
    error.statusCode = err.statusCode || 500;
    error.message = err.message || 'Something went wrong.';
    res.status(error.statusCode).json({error: error});
});

mongoConnect(() => app.listen(8080));