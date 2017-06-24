'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    image: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    twitter_id: DataTypes.STRING,
    vk_id: DataTypes.STRING,
  }, {
    tableName: 'users',
    freezeTableName: true,
    classMethods: {
      // associations can be defined here
      associate: function(models) {
        User.hasOne(models.Profile)
        User.hasOne(models.Local)
        User.hasOne(models.Twitter)
        User.hasOne(models.Vk)
      }
    }
  });
  return User;
};