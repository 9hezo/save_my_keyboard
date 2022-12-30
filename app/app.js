'use strict';

const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = require('./src/routes');
app.use('/api', router);

module.exports = app;
