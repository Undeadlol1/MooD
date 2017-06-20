'use strict';
module.exports = function(sequelize, DataTypes) {
  var Local = sequelize.define('Local', {
    // TODO add checks: must not have spaces
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      validate: {
        isEmail: true,
        notContains: [' '],
      }
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      validate: {
        notContains: [' '],
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notContains: [' '],
      }
    }
  }, {
    classMethods: {
      tableName: 'locals',
      freezeTableName: true,
      // associations can be defined here
      associate: function(models) {
        Local.belongsTo(models.User, {foreignKey: 'UserId', targetKey: 'id'})
      }
    }
  });
  return Local;
};