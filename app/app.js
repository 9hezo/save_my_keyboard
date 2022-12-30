'use strict';

const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/src/public`));

const router = require('./src/routes');
app.use('/api', router);
app.use('/', router);
app.use('/', (req, res) => {
  res.render('index');
});

module.exports = app;
