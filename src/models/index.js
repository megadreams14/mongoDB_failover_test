'use strict';


const Config =  require('config');


var Models = {

  mongoose:  require('mongoose'),
  ObjectID: require('mongodb').ObjectID,

  models: {},

  db: null,


  initialize: function() {
    try {
      this.connect();
      this.setModels();
    } catch (e) {
      throw new Error(e);
    }
  },

  setModels: function() {
    var self = this;
    Config.models.forEach(function(config){
      if (!self.models[config.model]) {
        var Schema = require('./schema/' + config.fileName);
        self.models[config.model] = self.createModel(config.collection, new self.mongoose.Schema(Schema, {collection: config.collection}));
      }
    });
  },


  connect: function() {
    if (!this.db) {
      this.db = null;
      this.mongoose.Promise = global.Promise;

      var databaseConfig = Config.database.mongodb;

      var options = databaseConfig.options;

      // 複数台のDBで運用する場合
      if (databaseConfig.db02.host !== '') {
        var url  = 'mongodb://' + databaseConfig.db01.host + ':' + databaseConfig.db01.port;
        url += ',' + databaseConfig.db02.host + ':' + databaseConfig.db02.port + '/' + databaseConfig.db02.database;
        url += '?replicaSet=' + databaseConfig.db02.replicaSet
      } else {
        var url = 'mongodb://' + databaseConfig.db01.host + ':' + databaseConfig.db01.port + '/' + databaseConfig.db01.database;
      }
      console.log('DB接続');
      console.log(url);
      this.db = this.mongoose.createConnection(url, options);

      // Nodejsのシングルトンの場合は、プロセスが活きている間は有効になるため、
      // プロセスダウン時にコネクションの明示的な切断を実施する
      var self = this;
      process.on('exit',  (code)=> {
        self.disconnect();
      });
    }
    return this.db;
  },

  disconnect: function() {
    if (this.db) {
      console.log('DB接続解除');
      this.mongoose.disconnect();
      this.db = null;
      this.models = [];
    }
  },

  createModel: function(collectionName, Scheme) {
    return this.db.model(collectionName, Scheme);
  },

  getObjectId: function(_id) {
    return this.ObjectID(_id);
  },

};

module.exports = Models;

