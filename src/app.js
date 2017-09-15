'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var LoginRouter = require('./modules/login/routers/');
app.use('/api/v1/login', new LoginRouter());


app.use((req, res, next) => {
  res.send(404, {statusCode: 404, message: 'Not Found'});
});


module.exports = app;

