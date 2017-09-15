'use strict';

var path = require("path").resolve("");
const BaseModel = require(path + '/src/models/');

class CommonAction {

  constructor(req, res, next) {
    this.req  = req;
    this.res  = res;
    this.next = next;

    this.isAuth = false;

    // 認証で利用する
    this.user = {};

    this.requestParams = req.query

    // レスポンスも共通化のために箱を用意しておく
    this.response = {};

    // DBの接続及び必要なModelの定義を行う
    BaseModel.initialize();
  }

  before() {
    var self = this;
    return new Promise(function(resolve, reject){
      if (self.isAuth) {
        // TODO: 認証の必要があればここに処理を記載
        return resolve(true);
      }
      return resolve(true);
    });
  }

  execute() {
    throw new Error('override');
  }

  dispatch() {
    this.res.msg = this.response;
    this.next();
    return Promise.resolve(this);
  }

  after() {
    return Promise.resolve(this);
  }


  errorResponse(error) {
    error = error || {};
    var httpStatusCode = error.httpStatusCode || 200;
    var errorCode      = error.errorCode      ||   0;
    var errorMessage   = error.errorMessage   ||  '';

    this.res.status(httpStatusCode);
    this.res.msg = {errorCode: errorCode, errorMessage: errorMessage};
    this.next();
  }
}

module.exports = CommonAction;

