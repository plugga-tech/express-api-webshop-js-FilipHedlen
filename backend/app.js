const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products')

const MongoClient = require("mongodb").MongoClient;

const app = express();

MongoClient.connect("mongodb://127.0.0.1:27017", {
    useUnifiedTopology: true
})
.then(client => {
    console.log("Vi är uppkopplade mot databasen!");
    const db = client.db("filip-hedlen");
    app.locals.db = db;
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

module.exports = app;
