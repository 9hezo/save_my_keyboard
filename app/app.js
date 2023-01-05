'use strict';

const express = require('express');
const app = express();

const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http);

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

module.exports = app;
