var bcrypt   = require('bcrypt-nodejs');

'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    twitter_id: DataTypes.STRING,
    vk_id: DataTypes.STRING,
  }, {
    tableName: 'users',
    freezeTableName: true,
    classMethods: {
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },
      // associations can be defined here
      associate: function(models) {
        User.hasOne(models.Profile)
        User.hasOne(models.Local)
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });
  return User;
};