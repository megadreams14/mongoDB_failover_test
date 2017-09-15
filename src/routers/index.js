'use strict';

class CommonRouter {

  constructor() {
    this.express = require('express');
    this.router  = this.express.Router();
  }

  actionExec(action) {
    var self = this;
    return action.before()
        .then(function(){
          return action.execute();
        })
        .then(function(){
          return action.dispatch();
        })
        .then(function(){
          return action.after();
        })
        .catch(function(error){
          return action.errorResponse(errorObj);
        });
   }

  afterRouter() {
    this.router.use(function(req, res, next){
      if (res.msg) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.json(res.msg);
      } else {
        next();
      }
    });
    return this.router;
  }
};

module.exports = CommonRouter;

