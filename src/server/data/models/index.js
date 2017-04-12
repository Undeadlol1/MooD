'use strict';

// load production values to process.env
require('dotenv').config()

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename || 'index.js');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config.js')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// TODO rework to this in future (seems like a better decision)
// var context = require.context('.', true, /.js?$/);
// context.keys().forEach(key => {
//   // console.log('context key', key)
// })

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    // console.log(file)
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.resolve(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
