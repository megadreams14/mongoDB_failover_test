'use strict';

const path = require("path").resolve("");
const CommonAction = require(path + '/src/actions/');
const BaseModel = require(path + '/src/models/');

class LoginAction extends CommonAction {

  before() {
    this.isAuth = false;
    return super.before();
  }

  execute() {
    const UserModel     = BaseModel.models.UserModel;
    const LoginLogModel = BaseModel.models.LoginLogModel;

    var self = this;
    selft.result = {
      'statusCode': 0,
      'message': 'Success.'
    };

    return new Promise((resolve, reject) => {
      // ユーザを検索
      UserModel.findOne({loginCode: '12345'}, function(error, res){
        if (error) {
          // TODO: エラー処理
          selft.result.statusCode = -1;
          selft.result.message    = 'Error';
          return reject(error);
        }
        return resolve(res);
      });
    }).then(function(user) {

      if (user) {
        // ログインログを残す
        var loginLog = new LoginLogModel({userSchemaId: user['_id'], loginDate: new Date()});
        return  new Promise((resolve, reject) => {
          loginLog.save(function(error, res){
            if (error) {
              // TODO: エラー処理
              selft.result.statusCode = -1;
              selft.result.message    = 'Error';
              return reject(error);
            }
            return resolve(res);
          })
        });
      }
    });
  }

  dispatch() {
    this.response = {
      'statusCode': selft.result.statusCode,
      'message': selft.result.message
    };
    return super.dispatch();
  }


}

module.exports = LoginAction;







