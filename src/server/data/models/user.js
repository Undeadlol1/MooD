'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    facebook_id: DataTypes.STRING,
    twitter_id: DataTypes.STRING,
    vk_id: DataTypes.STRING,
  }, {
    tableName: 'users',    
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};