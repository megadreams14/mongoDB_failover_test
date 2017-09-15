'use strict';

var mongoose = require('mongoose');

var LoginLogSchema = {
  userSchemaId: mongoose.Schema.Types.ObjectId,
  loginDate:{type:Date},
};
module.exports = LoginLogSchema;

