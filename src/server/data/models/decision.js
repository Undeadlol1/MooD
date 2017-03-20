'use strict';
module.exports = function(sequelize, DataTypes) {
  var Decision = sequelize.define('Decision', {
    rating: {
      defaultValue: 0,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    nextViewAt: {
      allowNull: true,
      type: DataTypes.DATE,
      // defaultValue: null
    },
    NodeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // unique: 'compositeIndex'
    },
    UserId: {
      allowNull: false,      
      type: DataTypes.INTEGER,
      // unique: 'compositeIndex'
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Decision.belongsTo(models.Node, {foreignKey: 'NodeId', targetKey: 'id'});
        Decision.belongsTo(models.User, {foreignKey: 'UserId', targetKey: 'id'});
      }
    }
  });
  return Decision;
};