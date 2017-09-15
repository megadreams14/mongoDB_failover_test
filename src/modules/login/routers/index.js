'use strict';

var path = require("path").resolve("");
var CommonRouter = require(path + '/src/routers/');

class LoginRouter extends CommonRouter
{
  constructor()
  {
    super();
    var self = this;
    this.router.get('/', function(res, req, next){
      var LoginAction = require('../actions/index.js');
      return self.actionExec(new LoginAction(res, req, next));
    });
    return this.afterRouter();
  }
}

module.exports = LoginRouter;



